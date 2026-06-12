import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";

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

export type Allergen =
  | "gluten"
  | "crustaceans"
  | "eggs"
  | "fish"
  | "peanuts"
  | "soy"
  | "milk"
  | "nuts"
  | "celery"
  | "mustard"
  | "sesame"
  | "sulphites"
  | "lupin"
  | "molluscs";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  delivery: boolean;
  takeaway: boolean;
  restaurant: boolean;
  visible: boolean;
  allergens: Allergen[];
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
  price: string;
  image: string;
  notes: string;
  visible: boolean;
};

export type WineCategory = {
  id: string;
  name: string;
  items: WineItem[];
};

export const WINE_REGIONS = [
  "Douro",
  "Alentejo",
  "Dão",
  "Vinho Verde",
  "Bairrada",
  "Lisboa",
  "Tejo",
  "Setúbal",
  "Açores",
  "Madeira",
  "Távora-Varosa",
  "Beira Interior",
  "Algarve",
] as const;

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
  backgroundColor?: string;
};

export type SocialNetwork = {
  url: string;
  visible: boolean;
};

export type GoogleReview = {
  id: string;
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  profile_photo_url: string;
  publish_time: string | null;
  visible: boolean;
  fetched_at: string;
};

export type RestauranteConfig = {
  logo: string;
  nomeProprietario: string;
  nif: string;
  morada: string;
  telefone: string;
  email: string;
  horario: string;
  horarioRestaurante: string;
  horarioPatio: string;
  googleMapsUrl: string;
  googleMapsEmbed: string;
  googlePlaceId: string;
  social: {
    instagram: SocialNetwork;
    facebook: SocialNetwork;
    tripadvisor: SocialNetwork;
  };
};

export type NavPageKey =
  | "conceito"
  | "ementa"
  | "encomendas"
  | "catering"
  | "espaco"
  | "testemunhos"
  | "carta-de-vinhos"
  | "a-minha-conta"
  | "auth";

export type NavPage = {
  key: NavPageKey;
  label: string;
  href: string;
  route: boolean;
  visible: boolean;
};

export type MaintenanceConfig = {
  enabled: boolean;
  titulo: string;
  mensagem: string;
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
  restaurante: RestauranteConfig;
  navPages: NavPage[];
  maintenance: MaintenanceConfig;
  menuPrices: { takeawayBox: string; bag: string };
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const uid = () => Math.random().toString(36).slice(2, 10);

const f = (label: string, value: string, multiline?: boolean): ContentField => ({
  id: uid(),
  label,
  value,
  multiline,
});

const img = (
  label: string,
  url: string,
  extra?: { title?: string; description?: string },
): ContentImage => ({
  id: uid(),
  label,
  url,
  ...extra,
});

/* ------------------------------------------------------------------ */
/*  Dados iniciais                                                     */
/* ------------------------------------------------------------------ */

const initialState: AdminState = {
  blocks: [
    {
      key: "hero",
      label: "Hero",
      description: "Imagem principal e chamada de ação.",
      visible: true,
    },
    { key: "about", label: "Conceito", description: "Secção sobre a taberna.", visible: true },
    {
      key: "specialties",
      label: "Especialidades",
      description: "Cards dos pratos da casa.",
      visible: true,
    },
    { key: "gallery", label: "Espaço", description: "Galeria do ambiente.", visible: true },
    {
      key: "testimonials",
      label: "Testemunhos",
      description: "Avaliações de clientes.",
      visible: true,
    },
    {
      key: "reservation",
      label: "Reservas",
      description: "Formulário de reserva de mesa.",
      visible: true,
    },
  ],
  pages: [
    {
      key: "index",
      label: "Início",
      fields: [
        f("Título (SEO)", "Manjar do Ramos · Taberna Moderna Portuguesa em Lisboa"),
        f(
          "Descrição (SEO)",
          "Sabores portugueses com alma de taberna. Carnes maturadas, petiscos e tábuas de partilha num ambiente acolhedor. Reserve a sua mesa.",
          true,
        ),
        f("OG Título", "Manjar do Ramos · Taberna Moderna Portuguesa"),
        f(
          "OG Descrição",
          "Uma experiência gastronómica feita para partilhar, saborear e voltar. Reserve a sua mesa no Manjar do Ramos.",
          true,
        ),
      ],
      images: [],
    },
    {
      key: "ementa",
      label: "Ementa",
      fields: [
        f("Título (SEO)", "Ementa · Manjar do Ramos · Taberna Moderna Portuguesa"),
        f(
          "Descrição (SEO)",
          "Descubra a ementa do Manjar do Ramos: petiscos, carnes maturadas, bacalhau, tábuas de partilha, sobremesas e cocktails. Sabores portugueses para partilhar.",
          true,
        ),
        f("OG Título", "Ementa · Manjar do Ramos"),
        f(
          "OG Descrição",
          "Petiscos, carnes maturadas, bacalhau e tábuas de partilha numa taberna portuguesa contemporânea.",
          true,
        ),
        f("Hero — Etiqueta", "Ementa da Casa"),
        f("Hero — Título", "A nossa ementa", true),
        f("Hero — Subtítulo", "Sabores portugueses pensados para partilhar à volta da mesa.", true),
      ],
      images: [img("Hero — Imagem de fundo", dishCarne)],
    },
    {
      key: "catering",
      label: "Catering",
      fields: [
        f("Título (SEO)", "Catering · Manjar do Ramos · Eventos & Celebrações"),
        f(
          "Descrição (SEO)",
          "Serviço de catering do Manjar do Ramos para casamentos, eventos de empresa e festas privadas. Sabores portugueses de taberna levados até si.",
          true,
        ),
        f("OG Título", "Catering · Manjar do Ramos"),
        f(
          "OG Descrição",
          "Leve a alma da taberna ao seu evento: petiscos, tábuas, carnes na brasa e doçaria portuguesa.",
          true,
        ),
        f("Hero — Etiqueta", "Catering & Eventos"),
        f("Hero — Título", "A taberna vai até si", true),
        f(
          "Hero — Subtítulo",
          "Levamos a abundância, o convívio e os sabores do Manjar do Ramos ao seu evento.",
          true,
        ),
        f("Hero — Botão", "Pedir Orçamento"),
        f("Intro — Etiqueta", "O Nosso Catering"),
        f("Intro — Título", "Mesas que reúnem, sabores que ficam", true),
        f(
          "Intro — Parágrafo 1",
          "Quer seja um jantar íntimo ou uma grande celebração, levamos a alma da taberna portuguesa onde quiser. Petiscos generosos, carnes na brasa, tábuas de partilha e doçaria de sempre — servidos com o calor e o cuidado que nos definem.",
          true,
        ),
        f(
          "Intro — Parágrafo 2",
          "Cada evento é único, por isso desenhamos cada ementa a pensar em si e nos seus convidados.",
          true,
        ),
        f("Serviços — Etiqueta", "O Que Oferecemos"),
        f("Serviços — Título", "Um serviço pensado ao detalhe", true),
        f("Como Funciona — Etiqueta", "Como Funciona"),
        f("Como Funciona — Título", "Simples, do primeiro contacto ao brinde", true),
        f("CTA — Título", "Vamos planear o seu evento", true),
        f(
          "CTA — Subtítulo",
          "Conte-nos os detalhes e enviamos-lhe uma proposta à medida. Resposta em até 48 horas.",
          true,
        ),
        f("CTA — Email", "eventos@manjardoramos.pt"),
        f("CTA — Telefone", "+351 210 000 000"),
      ],
      images: [img("Hero — Imagem de fundo", dishTabua), img("Intro — Imagem", about2)],
    },
  ],
  menu: [
    {
      id: uid(),
      name: "Entradas",
      items: [
        { id: uid(), name: "Pão", description: "", price: "1,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["gluten"] },
        { id: uid(), name: "Pão Torrado", description: "", price: "2,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["gluten"] },
        { id: uid(), name: "Azeitonas Marinadas", description: "", price: "1,20€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["sulphites"] },
      ],
    },
    {
      id: uid(),
      name: "Da Terra",
      items: [
        { id: uid(), name: "Palitos Mozzarella", description: "", price: "5,20€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["gluten", "milk", "eggs", "soy", "celery", "molluscs", "crustaceans", "nuts", "lupin", "mustard"] },
        { id: uid(), name: "Queijo Quente c/ Azeite e Orégãos", description: "", price: "4,80€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["milk"] },
        { id: uid(), name: "Queijo Quente de Cabra c/ Azeitonas", description: "", price: "5,20€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["milk", "sulphites"] },
        { id: uid(), name: "Tábua de Queijo", description: "Brie/Camembert e Argolas de Cebola", price: "10,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["gluten", "milk"] },
        { id: uid(), name: "Queijo Fresco", description: "", price: "5,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["milk"] },
        { id: uid(), name: "Salada de Orelha", description: "", price: "6,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["sulphites"] },
        { id: uid(), name: "Orelha Quente", description: "", price: "7,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["sulphites"] },
        { id: uid(), name: "Moelas", description: "", price: "6,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["gluten", "eggs", "soy", "celery", "sulphites"] },
        { id: uid(), name: "Dobradinha", description: "", price: "7,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["gluten", "milk", "eggs", "soy", "celery", "sulphites", "nuts"] },
        { id: uid(), name: "Frango à Passarinho", description: "", price: "7,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: [] },
        { id: uid(), name: "Corações Galinha ao Alho", description: "", price: "7,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["gluten", "milk", "sulphites"] },
        { id: uid(), name: "Asas de Frango", description: "", price: "7,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: [] },
        { id: uid(), name: "Panados à Taberna", description: "Frango panado c/ Molho de Mostarda e Mel", price: "12,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["gluten", "eggs", "mustard", "sulphites", "milk"] },
        { id: uid(), name: "Febras a Palitar", description: "", price: "8,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["sulphites", "celery"] },
        { id: uid(), name: "Entremeada a Palitar", description: "", price: "8,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["sulphites", "celery"] },
        { id: uid(), name: "Mista a Palitar", description: "", price: "9,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["sulphites", "celery"] },
        { id: uid(), name: "Fígado à Matança", description: "", price: "6,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: [] },
        { id: uid(), name: "Rins à Matança", description: "", price: "6,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["sulphites", "celery"] },
        { id: uid(), name: "Pica-Pau Vitela", description: "", price: "10,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["sulphites", "celery"] },
        { id: uid(), name: "Febras Alguidar", description: "", price: "8,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["sulphites", "celery"] },
        { id: uid(), name: "Febras Pica-Pau", description: "", price: "8,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["sulphites", "celery"] },
        { id: uid(), name: "Picadinho de Secretos", description: "", price: "12,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["gluten", "sulphites", "celery"] },
        { id: uid(), name: "Secretos no Bolo do Caco", description: "", price: "13,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["gluten", "milk"] },
        { id: uid(), name: "Tirinhas de Vitela", description: "c/ Molho de Natas e Mostarda", price: "11,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["milk", "mustard", "sulphites", "celery"] },
        { id: uid(), name: "Picado de Frango ou Porco", description: "c/ Molho de Natas e Batata Frita", price: "14,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["milk", "mustard", "sulphites", "celery", "gluten"] },
        { id: uid(), name: "Pica-Pau de Lombinho de Porco", description: "c/ Cogumelos, Presunto e Molho de Vinho Branco", price: "14,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["sulphites", "celery", "gluten", "milk"] },
        { id: uid(), name: "Pica-Pau de Frango", description: "c/ Camarão, Abacaxi e Molho de Mostarda e Mel", price: "16,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["crustaceans", "mustard", "sulphites", "milk"] },
        { id: uid(), name: "Francesinha Escangalhada", description: "Vitela, Salsicha Toscana, Linguiça, Bacon, Queijo Mozzarella no Bolo do Caco com Ovo Estrelado e Batata Frita", price: "18,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["gluten", "milk", "eggs", "sulphites", "celery"] },
      ],
    },
    {
      id: uid(),
      name: "Do Fumeiro",
      items: [
        { id: uid(), name: "Linguiça Frita", description: "", price: "7,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["gluten", "milk"] },
        { id: uid(), name: "Chouriça Assada", description: "", price: "7,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["milk"] },
        { id: uid(), name: "Morcela Assada", description: "", price: "7,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["sulphites"] },
        { id: uid(), name: "Moura Assada", description: "", price: "7,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["sulphites"] },
        { id: uid(), name: "Alheira Frita", description: "", price: "8,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["gluten"] },
        { id: uid(), name: "Farinheira Frita", description: "", price: "7,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["gluten", "milk", "eggs"] },
        { id: uid(), name: "Chouriça Frita", description: "", price: "7,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["milk"] },
        { id: uid(), name: "Prova de Enchidos", description: "", price: "14,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["gluten", "milk"] },
      ],
    },
    {
      id: uid(),
      name: "Da Água",
      items: [
        { id: uid(), name: "Salada de Pota", description: "", price: "7,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["molluscs", "sulphites"] },
        { id: uid(), name: "Petinga com Molho Escabeche", description: "", price: "7,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["fish", "gluten", "sulphites"] },
        { id: uid(), name: "Jaquinzinhos com Molho Escabeche", description: "", price: "7,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["fish", "gluten", "sulphites"] },
        { id: uid(), name: "Gambão Frito", description: "", price: "11,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["crustaceans"] },
        { id: uid(), name: "Miolo de Camarão à Guilho", description: "", price: "16,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["crustaceans", "sulphites", "milk"] },
        { id: uid(), name: "Amêijoas à Bulhão Pato", description: "", price: "14,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["molluscs", "sulphites"] },
        { id: uid(), name: "Choco Frito", description: "", price: "10,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["molluscs", "gluten"] },
        { id: uid(), name: "Pitéu de Lulas", description: "", price: "10,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["molluscs"] },
        { id: uid(), name: "Jaquinzinhos Fritos", description: "", price: "8,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["fish", "gluten"] },
        { id: uid(), name: "Petinga Frita", description: "", price: "8,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["fish", "gluten"] },
        { id: uid(), name: "Barriga de Atum Grelhada", description: "", price: "11,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["fish"] },
        { id: uid(), name: "Cachaço de Bacalhau Frito", description: "", price: "12,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["fish"] },
        { id: uid(), name: "Peixe Rei Frito", description: "", price: "8,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["fish"] },
      ],
    },
    {
      id: uid(),
      name: "Do Cú da Galinha",
      items: [
        { id: uid(), name: "Ovos com Farinheira", description: "", price: "6,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["eggs", "gluten", "milk"] },
        { id: uid(), name: "Ovos com Alheira e Espargos", description: "", price: "7,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["eggs", "gluten", "milk"] },
        { id: uid(), name: "Ovos Rotos com Presunto", description: "", price: "7,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["eggs", "sulphites"] },
        { id: uid(), name: "Ovos Rotos com Bacon", description: "", price: "8,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["eggs", "sulphites", "milk"] },
        { id: uid(), name: "Ovos Rotos Batata Doce Presunto", description: "", price: "9,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["eggs", "sulphites"] },
        { id: uid(), name: "Ovos Rotos à Taberna", description: "c/ Presunto, Azeitona Preta e Queijo Mozzarella", price: "10,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["eggs", "sulphites", "milk", "gluten"] },
        { id: uid(), name: "Ovos Rotos de Farinheira", description: "c/ Chips de Batata, Cogumelos e Espinafres", price: "12,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["eggs", "gluten", "milk", "sulphites", "celery"] },
        { id: uid(), name: "Ovos Rotos de Bacalhau", description: "c/ Chips de Batata, Azeitona Preta, Cebola e Salsa", price: "15,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["eggs", "fish", "gluten"] },
        { id: uid(), name: "Ovos Rotos de Alheira", description: "c/ Chips de Batata, Bacon, Cogumelos e Queijo Mozzarella", price: "14,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["eggs", "gluten", "milk"] },
        { id: uid(), name: "Ovos Rotos de Camarão e Bacon", description: "c/ Chips de Batata, Miolo de Camarão à Guilho e Bacon", price: "19,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["eggs", "crustaceans", "sulphites", "milk", "gluten"] },
        { id: uid(), name: "Ovos Caóticos com Chouriço", description: "c/ Ovos mexidos, Batata Frita, Cogumelos, Cebola e Queijo Mozzarella", price: "10,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["eggs", "milk", "sulphites", "celery"] },
        { id: uid(), name: "Ovos Caóticos com Bacon ou Presunto", description: "c/ Ovos mexidos, Batata Frita, Cogumelos, Cebola e Queijo Mozzarella", price: "10,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["eggs", "milk", "sulphites"] },
      ],
    },
    {
      id: uid(),
      name: "Ao Natural",
      items: [
        { id: uid(), name: "Tabuinha de Queijo", description: "", price: "5,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["milk"] },
        { id: uid(), name: "Tabuinha de Presunto", description: "", price: "4,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["sulphites"] },
        { id: uid(), name: "Banquinho 4 Queijos e Marmelada", description: "", price: "12,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["milk"] },
        { id: uid(), name: "Banquinho Fumado", description: "", price: "11,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["milk"] },
        { id: uid(), name: "Banquinho com Queijo e Enchido", description: "", price: "11,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["milk", "sulphites"] },
      ],
    },
    {
      id: uid(),
      name: "Nem Carne Nem Peixe",
      items: [
        { id: uid(), name: "Ovos Rotos Vegetarianos", description: "c/ Cogumelos, Feijão Vermelho, Broa e Couve", price: "12,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["eggs", "gluten"] },
        { id: uid(), name: "Da Horta ao Tacho", description: "c/ Cebola, Pimentos, Grão, Cogumelos, Espinafres, Tomate, Batata Doce e Ovo Cozido", price: "14,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["eggs", "sulphites"] },
      ],
    },
    {
      id: uid(),
      name: "Para Acompanhar",
      items: [
        { id: uid(), name: "Arroz", description: "", price: "3,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: [] },
        { id: uid(), name: "Açorda", description: "", price: "3,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["gluten", "milk"] },
        { id: uid(), name: "Salada Simples (Tomate ou Alface)", description: "", price: "4,20€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: [] },
        { id: uid(), name: "Salada Mista Tomate e Alface", description: "", price: "4,80€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: [] },
        { id: uid(), name: "Salada à Pátio", description: "", price: "6,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: [] },
        { id: uid(), name: "Pimentos Salteados", description: "", price: "4,80€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: [] },
        { id: uid(), name: "Pimentos Padron Grelhados", description: "", price: "8,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: [] },
        { id: uid(), name: "Couve com Broa", description: "", price: "4,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["gluten"] },
        { id: uid(), name: "Migas de Couve Rústica", description: "", price: "5,20€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["gluten"] },
        { id: uid(), name: "Cogumelos Salteados", description: "", price: "4,75€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: [] },
        { id: uid(), name: "Cogumelos à Bulhão Pato", description: "c/ Ovo e Espinafres", price: "6,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["eggs", "sulphites"] },
        { id: uid(), name: "Feijão Preto", description: "", price: "4,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["celery", "sulphites"] },
        { id: uid(), name: "Legumes Salteados", description: "", price: "4,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["milk"] },
        { id: uid(), name: "Chips Batata Doce", description: "", price: "5,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: [] },
        { id: uid(), name: "Chips de Batata", description: "", price: "4,20€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: [] },
        { id: uid(), name: "Batata Frita", description: "", price: "4,20€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: [] },
        { id: uid(), name: "Esparregado", description: "", price: "4,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["milk", "sulphites"] },
        { id: uid(), name: "Tempura de Legumes", description: "", price: "5,40€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["gluten", "eggs", "soy"] },
      ],
    },
    {
      id: uid(),
      name: "Do Mar ao Prato",
      items: [
        { id: uid(), name: "Filetes de Pescada", description: "c/ Arroz de Tomate ou Salada Russa", price: "13,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["fish", "gluten", "eggs"] },
        { id: uid(), name: "Bacalhau à Taberna", description: "Posta de Bacalhau frita c/ Cebolada, Batata à Racha e Ovo Cozido", price: "17,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["fish", "eggs", "gluten"] },
        { id: uid(), name: "Bacalhau Lascado com Broa", description: "c/ Batata à Racha, Couve e Azeite de Alho", price: "17,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["fish", "gluten"] },
        { id: uid(), name: "Polvo à Lagareiro", description: "c/ Batata a Murro, Couve Salteada e Azeite de Alho", price: "21,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["molluscs"] },
        { id: uid(), name: "Polvo Frito com Migas", description: "c/ Migas de Couve Rústica e Batata Frita", price: "21,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["molluscs", "gluten"] },
        { id: uid(), name: "Choco Frito", description: "c/ Arroz de Tomate e Batata Frita", price: "15,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["molluscs", "gluten"] },
        { id: uid(), name: "Arroz de Marisco (Mín. 2 Pessoas)", description: "", price: "18,00€ p/p", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["crustaceans", "molluscs", "sulphites"] },
        { id: uid(), name: "Feijoada de Marisco (Mín. 2 Pessoas)", description: "", price: "18,00€ p/p", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["crustaceans", "molluscs", "sulphites"] },
      ],
    },
    {
      id: uid(),
      name: "Cortes de Carne",
      items: [
        { id: uid(), name: "Bitoque de Porco", description: "Febras de Porco c/ Ovo Estrelado, Arroz e Batata Frita", price: "11,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["eggs", "sulphites", "celery"] },
        { id: uid(), name: "Bitoque de Vitela", description: "Prego de Vitela c/ Ovo Estrelado, Arroz e Batata Frita", price: "14,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["eggs", "sulphites", "celery"] },
        { id: uid(), name: "Secretos de Porco Preto", description: "c/ Arroz de Feijão, Batata Frita e Pimentos Padron", price: "16,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["celery", "sulphites"] },
        { id: uid(), name: "Plumas de Porco Preto", description: "c/ Migas de Couve, Batata Frita e Pimentos Padron", price: "17,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["gluten"] },
        { id: uid(), name: "Costeletão de Vitela (Aprox. 600gr)", description: "c/ Batata à Racha, Arroz e Legumes Salteados", price: "24,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["milk"] },
        { id: uid(), name: "Naco de Vitela na Grelha", description: "c/ Batata Frita, Arroz e Pimentos Salteados", price: "18,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: [] },
        { id: uid(), name: "Naco de Vitela com Molho de Três Pimentas", description: "c/ Batata Frita e Arroz", price: "20,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["milk", "sulphites", "celery"] },
        { id: uid(), name: "Naco de Vitela com Molho de Cogumelos", description: "c/ Batata Frita e Arroz", price: "20,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["milk", "sulphites", "celery"] },
        { id: uid(), name: "Costeletas de Borrego Grelhadas", description: "c/ Batata Frita, Arroz e Legumes Salteados", price: "18,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["milk"] },
      ],
    },
    {
      id: uid(),
      name: "No Tacho e Forno",
      items: [
        { id: uid(), name: "Arroz de Pato à Antiga", description: "Tostado no forno c/ Chouriço e Bacon", price: "15,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["milk", "sulphites", "celery"] },
        { id: uid(), name: "Arroz de Lingueirão (Mín. 2 Pessoas)", description: "", price: "17,50€ p/p", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["molluscs", "sulphites"] },
        { id: uid(), name: "Arroz de Polvo (Mín. 2 Pessoas)", description: "", price: "18,50€ p/p", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["molluscs", "sulphites"] },
        { id: uid(), name: "Arroz de Tamboril c/ Camarão (Mín. 2 Pessoas)", description: "", price: "19,50€ p/p", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["fish", "crustaceans", "sulphites"] },
        { id: uid(), name: "Massada de Peixe c/ Camarão (Mín. 2 Pessoas)", description: "", price: "18,00€ p/p", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["fish", "crustaceans", "gluten", "sulphites"] },
        { id: uid(), name: "Massada de Polvo e Camarão (Mín. 2 Pessoas)", description: "", price: "19,50€ p/p", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["molluscs", "crustaceans", "gluten", "sulphites"] },
        { id: uid(), name: "Tomatada de Peixe c/ Ovos Escalfados (Mín. 2 Pessoas)", description: "", price: "18,00€ p/p", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["fish", "eggs", "sulphites"] },
      ],
    },
    {
      id: uid(),
      name: "Menu Infantil",
      items: [
        { id: uid(), name: "Douradinhos de Pescada", description: "c/ Arroz e Batata Frita", price: "7,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["fish", "gluten"] },
        { id: uid(), name: "Nuggets de Frango", description: "c/ Arroz e Batata Frita", price: "7,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["gluten", "soy", "milk"] },
        { id: uid(), name: "Salsicha com Ovo", description: "c/ Arroz e Batata Frita", price: "7,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["eggs", "soy", "milk"] },
      ],
    },
    {
      id: uid(),
      name: "Saladas",
      items: [
        { id: uid(), name: "Salada de Atum", description: "Alface, Tomate, Cenoura, Milho, Ovo Cozido, Atum, Cebola e Azeitonas", price: "12,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["fish", "eggs"] },
        { id: uid(), name: "Salada de Frango Crisp", description: "Alface, Tomate, Cenoura, Milho, Frango Panado, Queijo Parmesão e Molho de Iogurte", price: "14,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["gluten", "milk", "eggs", "mustard"] },
        { id: uid(), name: "Salada de Camarão", description: "Alface, Tomate, Cenoura, Milho, Abacaxi, Miolo de Camarão e Molho Cocktail", price: "16,50€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["crustaceans", "eggs", "mustard", "sulphites"] },
        { id: uid(), name: "Salada de Queijo de Cabra", description: "Alface, Rúcula, Tomate Seco, Nozes, Queijo de Cabra e Molho de Mel e Mostarda", price: "15,00€", image: "", delivery: true, takeaway: true, restaurant: true, visible: true, allergens: ["milk", "nuts", "mustard", "sulphites"] },
      ],
    },
  ],
  wines: {
    eyebrow: "Garrafeira da Casa",
    title: "Carta de Vinhos",
    subtitle:
      "Uma seleção rotativa de produtores portugueses, escolhidos a dedo para acompanhar a mesa.",
    categories: [
      {
        id: uid(),
        name: "Tintos",
        items: [
          {
            id: uid(),
            name: "Quinta do Crasto Reserva",
            producer: "Quinta do Crasto",
            region: "Douro",
            year: "2019",
            price: "38,00€",
            image: dishCocktails,
            notes: "Encorpado, taninos firmes, notas de frutos pretos e especiarias.",
            visible: true,
          },
          {
            id: uid(),
            name: "Mouchão",
            producer: "Herdade do Mouchão",
            region: "Alentejo",
            year: "2017",
            price: "62,00€",
            image: dishCocktails,
            notes: "Clássico alentejano, complexo, com madeira bem integrada.",
            visible: true,
          },
        ],
      },
      {
        id: uid(),
        name: "Brancos",
        items: [
          {
            id: uid(),
            name: "Soalheiro Alvarinho",
            producer: "Soalheiro",
            region: "Vinho Verde",
            year: "2022",
            price: "32,00€",
            image: dishCocktails,
            notes: "Fresco, mineral, com notas cítricas e final persistente.",
            visible: true,
          },
          {
            id: uid(),
            name: "Quinta dos Roques Encruzado",
            producer: "Quinta dos Roques",
            region: "Dão",
            year: "2021",
            price: "34,00€",
            image: dishCocktails,
            notes: "Elegante, com volume de boca e ligeira madeira.",
            visible: true,
          },
        ],
      },
      {
        id: uid(),
        name: "Espumantes & Champanhes",
        items: [
          {
            id: uid(),
            name: "Murganheira Bruto",
            producer: "Caves da Murganheira",
            region: "Távora-Varosa",
            year: "NV",
            price: "28,00€",
            image: dishCocktails,
            notes: "Bolha fina, fresco, ideal para começar a refeição.",
            visible: true,
          },
        ],
      },
    ],
  },
  testimonials: [
    {
      id: uid(),
      quote:
        "Fomos jantar a dois e saímos a planear a próxima visita. A carne na brasa é das melhores que provei em Lisboa.",
      name: "Inês Carvalho",
      context: "Jantar romântico",
      visible: true,
    },
    {
      id: uid(),
      quote:
        "Levei o grupo todo do trabalho. As tábuas de partilha foram um sucesso e o ambiente é acolhedor.",
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
        {
          id: uid(),
          label: "Subtítulo",
          value: "Comida de alma, mesa cheia e o calor de uma taberna portuguesa contemporânea.",
          multiline: true,
        },
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
        {
          id: uid(),
          label: "Parágrafo 1",
          value: "Nascemos do desejo de juntar pessoas à volta de boa comida.",
          multiline: true,
        },
        {
          id: uid(),
          label: "Parágrafo 2",
          value: "Sabores tradicionais reinterpretados, num ambiente rústico e acolhedor.",
          multiline: true,
        },
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
        {
          id: uid(),
          label: "Prato 1",
          url: dishCarne,
          title: "Carnes Maturadas",
          description: "Cortes nobres na brasa, crosta estaladiça e o ponto certo de sal grosso.",
        },
        {
          id: uid(),
          label: "Prato 2",
          url: dishBacalhau,
          title: "Bacalhau à Lagareiro",
          description: "Lombo alourado, batata a murro e o azeite a perfumar a mesa.",
        },
        {
          id: uid(),
          label: "Prato 3",
          url: dishPetiscos,
          title: "Petiscos Portugueses",
          description: "Gambas, chouriço e croquetes — para começar e nunca mais parar.",
        },
        {
          id: uid(),
          label: "Prato 4",
          url: dishTabua,
          title: "Tábuas de Partilha",
          description: "Enchidos, queijos regionais e mel, servidos para toda a mesa.",
        },
        {
          id: uid(),
          label: "Prato 5",
          url: dishSobremesa,
          title: "Sobremesas de Sempre",
          description: "Doçaria tradicional reinterpretada, com canela e açúcar caramelizado.",
        },
        {
          id: uid(),
          label: "Prato 6",
          url: dishCocktails,
          title: "Cocktails & Sangrias",
          description: "Sangrias de fruta e criações de autor para acompanhar a noite.",
        },
      ],
    },
    {
      key: "gallery",
      label: "Espaço",
      fields: [
        { id: uid(), label: "Etiqueta", value: "A Experiência do Espaço" },
        {
          id: uid(),
          label: "Título",
          value: "Madeira, luz quente e mesas cheias",
          multiline: true,
        },
        {
          id: uid(),
          label: "Subtítulo",
          value: "Um ambiente rústico e contemporâneo, onde cada detalhe convida a ficar.",
          multiline: true,
        },
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
        {
          id: uid(),
          label: "Subtítulo",
          value: "Reserve já e garanta o seu lugar numa noite memorável.",
          multiline: true,
        },
        { id: uid(), label: "Telefone", value: "+351 210 000 000" },
        { id: uid(), label: "Label Telefone", value: "Chamada para a rede móvel nacional" },
      ],
      images: [],
    },
  ],
  restaurante: {
    logo: "",
    nomeProprietario: "Elsa Maria Dias da Silva Ramos",
    nif: "207373/28",
    morada: "Rua da Taberna 12, Lisboa",
    telefone: "+351 210 000 000",
    email: "geral@manjardoramos.pt",
    horario: "Terça a Domingo · 12h00–15h00 · 19h00–23h30",
    horarioRestaurante: "Terça a Domingo · 12h00–15h00 · 19h00–23h30",
    horarioPatio: "",
    googleMapsUrl: "#",
    googleMapsEmbed: "",
    googlePlaceId: "",
    social: {
      instagram: { url: "https://instagram.com/manjardoramos", visible: true },
      facebook: { url: "https://facebook.com/manjardoramos", visible: true },
      tripadvisor: { url: "", visible: false },
    },
  },
  navPages: [
    { key: "conceito", label: "Conceito", href: "/#conceito", route: false, visible: true },
    { key: "ementa", label: "Ementa", href: "/ementa", route: true, visible: true },
    { key: "encomendas", label: "Encomendas", href: "/encomendas", route: true, visible: true },
    { key: "catering", label: "Catering", href: "/catering", route: true, visible: true },
    { key: "espaco", label: "Espaço", href: "/#espaco", route: false, visible: true },
    {
      key: "testemunhos",
      label: "Testemunhos",
      href: "/#testemunhos",
      route: false,
      visible: true,
    },
    {
      key: "carta-de-vinhos",
      label: "Carta de Vinhos",
      href: "/carta-de-vinhos",
      route: true,
      visible: false,
    },
    {
      key: "a-minha-conta",
      label: "A minha conta",
      href: "/minhas-encomendas",
      route: true,
      visible: true,
    },
    { key: "auth", label: "Login / Registo", href: "/auth", route: true, visible: true },
  ],
  maintenance: {
    enabled: false,
    titulo: "Em manutenção",
    mensagem: "Estamos a preparar algo especial. Voltamos em breve.",
  },
  menuPrices: { takeawayBox: "0,50€", bag: "0,20€" },
};

/* ------------------------------------------------------------------ */
/*  Helpers de persistência                                            */
/* ------------------------------------------------------------------ */

const NOW = () => new Date().toISOString();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = (table: string) => supabase.from(table as any) as any;

async function loadFromSupabase(): Promise<Partial<AdminState>> {
  const [menuRes, winesRes, testimonialsRes, contentRes, settingsRes] = await Promise.all([
    db("site_menu").select("data").maybeSingle(),
    db("site_wines").select("data").maybeSingle(),
    db("site_testimonials").select("data").maybeSingle(),
    db("site_content").select("key, value"),
    db("site_settings").select("key, value"),
  ]);

  const partial: Partial<AdminState> = {};

  // menu — garantir campo allergens em itens antigos
  if (menuRes.data?.data) {
    partial.menu = (menuRes.data.data as MenuCategory[]).map((cat) => ({
      ...cat,
      items: cat.items.map((item) => ({ ...item, allergens: item.allergens ?? [] })),
    }));
  }

  if (winesRes.data?.data) partial.wines = winesRes.data.data as AdminState["wines"];
  if (testimonialsRes.data?.data)
    partial.testimonials = testimonialsRes.data.data as AdminState["testimonials"];

  // site_content → blocos e páginas
  if (contentRes.data?.length) {
    const blocks: BlockContent[] = [];
    const pages: PageContent[] = [];
    for (const row of contentRes.data as { key: string; value: unknown }[]) {
      if (row.key.startsWith("block_")) {
        const loaded = row.value as BlockContent;
        // Garante que campos adicionados ao initialState depois da última gravação
        // no Supabase também aparecem no backoffice.
        const defaults = initialState.content.find((b) => b.key === loaded.key);
        if (defaults) {
          const existingLabels = new Set(loaded.fields.map((f) => f.label));
          const missingFields = defaults.fields.filter((f) => !existingLabels.has(f.label));
          blocks.push({ ...loaded, fields: [...loaded.fields, ...missingFields] });
        } else {
          blocks.push(loaded);
        }
      } else if (row.key.startsWith("page_")) pages.push(row.value as PageContent);
    }
    if (blocks.length) partial.content = blocks;
    if (pages.length) partial.pages = pages;
  }

  // site_settings → restaurante, navPages, maintenance, blocks
  if (settingsRes.data?.length) {
    for (const row of settingsRes.data as { key: string; value: unknown }[]) {
      if (row.key === "restaurante") partial.restaurante = row.value as AdminState["restaurante"];
      if (row.key === "navPages") {
        const saved = row.value as AdminState["navPages"];
        // merge: keep saved entries, append any new keys from initialState not yet persisted
        const merged = [...saved];
        for (const def of initialState.navPages) {
          if (!merged.find((p) => p.key === def.key)) merged.push(def);
        }
        partial.navPages = merged;
      }
      if (row.key === "maintenance") partial.maintenance = row.value as AdminState["maintenance"];
      if (row.key === "blocks") partial.blocks = row.value as AdminState["blocks"];
      if (row.key === "menuPrices") partial.menuPrices = row.value as AdminState["menuPrices"];
    }
  }

  return partial;
}

async function saveToSupabase(state: AdminState): Promise<void> {
  const contentRows = [
    ...state.content.map((b) => ({ key: `block_${b.key}`, value: b, updated_at: NOW() })),
    ...state.pages.map((p) => ({ key: `page_${p.key}`, value: p, updated_at: NOW() })),
  ];
  const settingsRows = [
    { key: "restaurante", value: state.restaurante, updated_at: NOW() },
    { key: "navPages", value: state.navPages, updated_at: NOW() },
    { key: "maintenance", value: state.maintenance, updated_at: NOW() },
    { key: "blocks", value: state.blocks, updated_at: NOW() },
    { key: "menuPrices", value: state.menuPrices, updated_at: NOW() },
  ];

  await Promise.all([
    db("site_menu").upsert({ id: true, data: state.menu, updated_at: NOW() }),
    db("site_wines").upsert({ id: true, data: state.wines, updated_at: NOW() }),
    db("site_testimonials").upsert({ id: true, data: state.testimonials, updated_at: NOW() }),
    db("site_content").upsert(contentRows),
    db("site_settings").upsert(settingsRows),
  ]);
}

async function resetSupabase(): Promise<void> {
  await Promise.all([
    db("site_menu").delete().eq("id", true),
    db("site_wines").delete().eq("id", true),
    db("site_testimonials").delete().eq("id", true),
    db("site_content").delete().neq("key", ""),
    db("site_settings").delete().neq("key", ""),
  ]);
}

/* ------------------------------------------------------------------ */
/*  Contexto                                                           */
/* ------------------------------------------------------------------ */

type AdminContextValue = {
  state: AdminState;
  setState: React.Dispatch<React.SetStateAction<AdminState>>;
  reset: () => void;
  newId: () => string;
  saving: boolean;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminState>(initialState);
  const [saving, setSaving] = useState(false);
  const isFirstLoad = useRef(true);

  // Carregar estado das novas tabelas ao montar
  useEffect(() => {
    loadFromSupabase().then((partial) => {
      if (Object.keys(partial).length > 0) {
        setState((s) => ({ ...s, ...partial }));
      }
    });
  }, []);

  // Guardar nas novas tabelas sempre que o estado muda (exceto carga inicial)
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    setSaving(true);
    saveToSupabase(state).finally(() => setSaving(false));
  }, [state]);

  const reset = useCallback(() => {
    setState(initialState);
    resetSupabase();
  }, []);

  return (
    <AdminContext.Provider value={{ state, setState, reset, newId: uid, saving }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin deve ser usado dentro de <AdminProvider>");
  return ctx;
}

export function useAdminSaving() {
  return useAdmin().saving;
}
