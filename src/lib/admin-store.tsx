import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/* assets usados como conteúdo inicial dos blocos */
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

export type Page = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  inNav: boolean;
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

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  context: string;
  visible: boolean;
};

/* Conteúdo editável por bloco: textos + imagens */
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
};

export type BlockContent = {
  key: BlockKey;
  label: string;
  fields: ContentField[];
  images: ContentImage[];
};

export type AdminState = {
  blocks: Block[];
  pages: Page[];
  menu: MenuCategory[];
  testimonials: Testimonial[];
  content: BlockContent[];
};

/* ------------------------------------------------------------------ */
/*  Dados iniciais (mock)                                              */
/* ------------------------------------------------------------------ */

const uid = () => Math.random().toString(36).slice(2, 10);

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
    { id: uid(), title: "Início", slug: "/", published: true, inNav: true },
    { id: uid(), title: "Ementa", slug: "/ementa", published: true, inNav: true },
    { id: uid(), title: "Catering", slug: "/catering", published: true, inNav: true },
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
        { id: uid(), label: "Carnes Maturadas", url: dishCarne },
        { id: uid(), label: "Bacalhau à Lagareiro", url: dishBacalhau },
        { id: uid(), label: "Petiscos Portugueses", url: dishPetiscos },
        { id: uid(), label: "Tábuas de Partilha", url: dishTabua },
        { id: uid(), label: "Sobremesas de Sempre", url: dishSobremesa },
        { id: uid(), label: "Cocktails & Sangrias", url: dishCocktails },
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

const STORAGE_KEY = "manjar-admin-state-v1";

type AdminContextValue = {
  state: AdminState;
  setState: React.Dispatch<React.SetStateAction<AdminState>>;
  reset: () => void;
  newId: () => string;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminState>(initialState);

  // hidratar do localStorage no cliente
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