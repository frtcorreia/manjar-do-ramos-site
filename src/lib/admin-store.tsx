import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/* assets usados como conteúdo inicial */
import heroImg from "@/assets/hero.jpg";
import about1 from "@/assets/about-1.jpg";
import about2 from "@/assets/about-2.jpg";
import dishCarne from "@/assets/dish-carne.jpg";
import dishBacalhau from "@/assets/dish-bacalhau.jpg";
import dishPetiscos from "@/assets/dish-petiscos.jpg";
import dishTabua from "@/assets/dish-tabua.jpg";
import dishSobremesa from "@/assets/dish-sobremesa.jpg";
import dishCocktails from "@/assets/dish-cocktails.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";

/* ------------------------------------------------------------------ */
/*  Tipos                                                              */
/* ------------------------------------------------------------------ */

export type BlockKey =
  | "hero"
  | "about"
  | "specialties"
  | "gallery"
  | "testimonials"
  | "reservation";

export type Block = {
  key: BlockKey;
  label: string;
  description: string;
  visible: boolean;
};

export type PageKey = "index" | "ementa" | "catering";

export type PageContent = {
  key: PageKey;
  label: string;
  fields: ContentField[];
  images: ContentImage[];
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  visible: boolean;
};

export type MenuCategory = {
  id: string;
  name: string;
  items: MenuItem[];
};

export type WineItem = {
  id: string;
  name: string;
  producer: string;
  region: string;
  year: string;
  glassPrice: string;
  bottlePrice: string;
  notes: string;
  visible: boolean;
};

export type WineCategory = {
  id: string;
  name: string;
  items: WineItem[];
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  context: string;
  visible: boolean;
};

export type ContentField = {
  id: string;
  label: string;
  value: string;
  multiline?: boolean;
};

export type ContentImage = {
  id: string;
  label: string;
  url: string;
  title?: string;
  description?: string;
};

export type BlockContent = {
  key: BlockKey;
  label: string;
  fields: ContentField[];
  images: ContentImage[];
};

export type AdminState = {
  blocks: Block[];
  pages: PageContent[];
  menu: MenuCategory[];
  wines: {
    title: string;
    eyebrow: string;
    subtitle: string;
    categories: WineCategory[];
  };
  testimonials: Testimonial[];
  content: BlockContent[];
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const uid = () => Math.random().toString(36).slice(2, 10);

const f = (label: string, value: string, multiline?: boolean): ContentField => ({
  id: uid(), label, value, multiline,
});

const img = (
  label: string,
  url: string,
  extra?: { title?: string; description?: string },
): ContentImage => ({
  id: uid(), label, url, ...extra,
});

/* ------------------------------------------------------------------ */
/*  Dados iniciais                                                     */
/* ------------------------------------------------------------------ */

const initialState: AdminState = {
  blocks: [
    { key: "hero", label: "Hero", description: "Imagem principal e chamada de ação.", visible: true },
    { key: "about", label: "Conceito", description: "Secção sobre a taberna.", visible: true },
    { key: "specialties", label: "Especialidades", description: "Cards dos pratos da casa.", visible: true },
    { key: "gallery", label: "Espaço", description: "Galeria do ambiente.", visible: true },
    { key: "testimonials", label: "Testemunhos", description: "Avaliações de clientes.", visible: true },
    { key: "reservation", label: "Reservas", description: "Formulário de reserva de mesa.", visible: true },
  ],
  pages: [
    {
      key: "index",
      label: "Início",
      fields: [
        f("Título (SEO)", "Manjar do Ramos · Taberna Moderna Portuguesa em Lisboa"),
        f("Descrição (SEO)", "Sabores portugueses com alma de taberna. Carnes maturadas, petiscos e tábuas de partilha num ambiente acolhedor. Reserve a sua mesa.", true),
        f("OG Título", "Manjar do Ramos · Taberna Moderna Portuguesa"),
        f("OG Descrição", "Uma experiência gastronómica feita para partilhar, saborear e voltar. Reserve a sua mesa no Manjar do Ramos.", true),
      ],
      images: [],
    },
    {
      key: "ementa",
      label: "Ementa",
      fields: [
        f("Título (SEO)", "Ementa · Manjar do Ramos · Taberna Moderna Portuguesa"),
        f("Descrição (SEO)", "Descubra a ementa do Manjar do Ramos: petiscos, carnes maturadas, bacalhau, tábuas de partilha, sobremesas e cocktails. Sabores portugueses para partilhar.", true),
        f("OG Título", "Ementa · Manjar do Ramos"),
        f("OG Descrição", "Petiscos, carnes maturadas, bacalhau e tábuas de partilha numa taberna portuguesa contemporânea.", true),
        f("Hero — Etiqueta", "Ementa da Casa"),
        f("Hero — Título", "A nossa ementa", true),
        f("Hero — Subtítulo", "Sabores portugueses pensados para partilhar à volta da mesa.", true),
        f("CTA — Título", "Pronto para uma mesa cheia?", true),
        f("CTA — Subtítulo", "Reserve a sua mesa e deixe a noite acontecer entre pratos, vinho e boa conversa.", true),
        f("CTA — Botão", "Reservar Mesa"),
      ],
      images: [
        img("Hero — Imagem de fundo", dishCarne),
      ],
    },
    {
      key: "catering",
      label: "Catering",
      fields: [
        f("Título (SEO)", "Catering · Manjar do Ramos · Eventos & Celebrações"),
        f("Descrição (SEO)", "Serviço de catering do Manjar do Ramos para casamentos, eventos de empresa e festas privadas. Sabores portugueses de taberna levados até si.", true),
        f("OG Título", "Catering · Manjar do Ramos"),
        f("OG Descrição", "Leve a alma da taberna ao seu evento: petiscos, tábuas, carnes na brasa e doçaria portuguesa.", true),
        f("Hero — Etiqueta", "Catering & Eventos"),
        f("Hero — Título", "A taberna vai até si", true),
        f("Hero — Subtítulo", "Levamos a abundância, o convívio e os sabores do Manjar do Ramos ao seu evento.", true),
        f("Hero — Botão", "Pedir Orçamento"),
        f("Intro — Etiqueta", "O Nosso Catering"),
        f("Intro — Título", "Mesas que reúnem, sabores que ficam", true),
        f("Intro — Parágrafo 1", "Quer seja um jantar íntimo ou uma grande celebração, levamos a alma da taberna portuguesa onde quiser. Petiscos generosos, carnes na brasa, tábuas de partilha e doçaria de sempre — servidos com o calor e o cuidado que nos definem.", true),
        f("Intro — Parágrafo 2", "Cada evento é único, por isso desenhamos cada ementa a pensar em si e nos seus convidados.", true),
        f("Serviços — Etiqueta", "O Que Oferecemos"),
        f("Serviços — Título", "Um serviço pensado ao detalhe", true),
        f("Como Funciona — Etiqueta", "Como Funciona"),
        f("Como Funciona — Título", "Simples, do primeiro contacto ao brinde", true),
        f("CTA — Título", "Vamos planear o seu evento", true),
        f("CTA — Subtítulo", "Conte-nos os detalhes e enviamos-lhe uma proposta à medida. Resposta em até 48 horas.", true),
        f("CTA — Email", "eventos@manjardoramos.pt"),
        f("CTA — Telefone", "+351 210 000 000"),
      ],
      images: [
        img("Hero — Imagem de fundo", dishTabua),
        img("Intro — Imagem", about2),
      ],
    },
  ],
  menu: [
    {
      id: uid(),
      name: "Petiscos",
      items: [
        { id: uid(), name: "Gambas à Guilho", description: "Alho, malagueta e coentros.", price: "12,50€", visible: true },
        { id: uid(), name: "Croquetes de Vitela", description: "Estaladiços, com mostarda da casa.", price: "8,00€", visible: true },
      ],
    },
    {
      id: uid(),
      name: "Carnes Maturadas",
      items: [
        { id: uid(), name: "Bife do Lombo (300g)", description: "Maturado 30 dias, na brasa.", price: "24,00€", visible: true },
        { id: uid(), name: "Picanha à Taberna", description: "Sal grosso e legumes assados.", price: "21,00€", visible: true },
      ],
    },
  ],
  testimonials: [
    {
      id: uid(),
      quote: "Fomos jantar a dois e saímos a planear a próxima visita. A carne na brasa é das melhores que provei em Lisboa.",
      name: "Inês Carvalho",
      context: "Jantar romântico",
      visible: true,
    },
    {
      id: uid(),
      quote: "Levei o grupo todo do trabalho. As tábuas de partilha foram um sucesso e o ambiente é acolhedor.",
      name: "Tiago Mendes",
      context: "Jantar de grupo",
      visible: true,
    },
  ],
  content: [
    {
      key: "hero",
      label: "Hero",
      fields: [
        { id: uid(), label: "Etiqueta", value: "Taberna Moderna Portuguesa" },
        { id: uid(), label: "Título", value: "Manjar do Ramos", multiline: true },
        { id: uid(), label: "Subtítulo", value: "Comida de alma, mesa cheia e o calor de uma taberna portuguesa contemporânea.", multiline: true },
        { id: uid(), label: "Botão principal", value: "Reservar Mesa" },
        { id: uid(), label: "Botão secundário", value: "Ver Ementa" },
      ],
      images: [{ id: uid(), label: "Imagem de fundo", url: heroImg }],
    },
    {
      key: "about",
      label: "Conceito",
      fields: [
        { id: uid(), label: "Etiqueta", value: "O Nosso Conceito" },
        { id: uid(), label: "Título", value: "Uma taberna com alma portuguesa", multiline: true },
        { id: uid(), label: "Parágrafo 1", value: "Nascemos do desejo de juntar pessoas à volta de boa comida.", multiline: true },
        { id: uid(), label: "Parágrafo 2", value: "Sabores tradicionais reinterpretados, num ambiente rústico e acolhedor.", multiline: true },
      ],
      images: [
        { id: uid(), label: "Imagem 1", url: about1 },
        { id: uid(), label: "Imagem 2", url: about2 },
      ],
    },
    {
      key: "specialties",
      label: "Especialidades",
      fields: [
        { id: uid(), label: "Etiqueta", value: "Especialidades da Casa" },
        { id: uid(), label: "Título", value: "Cada prato, uma razão para voltar", multiline: true },
      ],
      images: [
        { id: uid(), label: "Prato 1", url: dishCarne, title: "Carnes Maturadas", description: "Cortes nobres na brasa, crosta estaladiça e o ponto certo de sal grosso." },
        { id: uid(), label: "Prato 2", url: dishBacalhau, title: "Bacalhau à Lagareiro", description: "Lombo alourado, batata a murro e o azeite a perfumar a mesa." },
        { id: uid(), label: "Prato 3", url: dishPetiscos, title: "Petiscos Portugueses", description: "Gambas, chouriço e croquetes — para começar e nunca mais parar." },
        { id: uid(), label: "Prato 4", url: dishTabua, title: "Tábuas de Partilha", description: "Enchidos, queijos regionais e mel, servidos para toda a mesa." },
        { id: uid(), label: "Prato 5", url: dishSobremesa, title: "Sobremesas de Sempre", description: "Doçaria tradicional reinterpretada, com canela e açúcar caramelizado." },
        { id: uid(), label: "Prato 6", url: dishCocktails, title: "Cocktails & Sangrias", description: "Sangrias de fruta e criações de autor para acompanhar a noite." },
      ],
    },
    {
      key: "gallery",
      label: "Espaço",
      fields: [
        { id: uid(), label: "Etiqueta", value: "A Experiência do Espaço" },
        { id: uid(), label: "Título", value: "Madeira, luz quente e mesas cheias", multiline: true },
        { id: uid(), label: "Subtítulo", value: "Um ambiente rústico e contemporâneo, onde cada detalhe convida a ficar.", multiline: true },
      ],
      images: [
        { id: uid(), label: "Imagem 1", url: g1 },
        { id: uid(), label: "Imagem 2", url: g2 },
        { id: uid(), label: "Imagem 3", url: g3 },
        { id: uid(), label: "Imagem 4", url: g4 },
      ],
    },
    {
      key: "testimonials",
      label: "Testemunhos",
      fields: [
        { id: uid(), label: "Etiqueta", value: "Quem Já Se Sentou À Mesa" },
        { id: uid(), label: "Título", value: "Histórias que se contam ao jantar", multiline: true },
      ],
      images: [],
    },
    {
      key: "reservation",
      label: "Reservas",
      fields: [
        { id: uid(), label: "Etiqueta", value: "Reserve a Sua Mesa" },
        { id: uid(), label: "Título", value: "Venha sentar-se à nossa mesa", multiline: true },
        { id: uid(), label: "Subtítulo", value: "Reserve já e garanta o seu lugar numa noite memorável.", multiline: true },
      ],
      images: [],
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Contexto                                                           */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "manjar-admin-state-v4";

type AdminContextValue = {
  state: AdminState;
  setState: React.Dispatch<React.SetStateAction<AdminState>>;
  reset: () => void;
  newId: () => string;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminState>(initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const reset = useCallback(() => {
    setState(initialState);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <AdminContext.Provider value={{ state, setState, reset, newId: uid }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin deve ser usado dentro de <AdminProvider>");
  return ctx;
}
