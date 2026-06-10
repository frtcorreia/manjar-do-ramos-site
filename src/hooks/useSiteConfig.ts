import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type {
  Block,
  BlockContent,
  BlockKey,
  MaintenanceConfig,
  MenuCategory,
  NavPage,
  PageContent,
  PageKey,
  RestauranteConfig,
  Testimonial,
} from "@/lib/admin-store";

type WinesData = {
  eyebrow: string;
  title: string;
  subtitle: string;
  categories: {
    id: string;
    name: string;
    items: {
      id: string;
      name: string;
      producer: string;
      region: string;
      year: string;
      price: string;
      image: string;
      notes: string;
      visible: boolean;
    }[];
  }[];
};

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_BLOCKS: Block[] = [
  { key: "hero", label: "Hero", description: "", visible: true },
  { key: "about", label: "Conceito", description: "", visible: true },
  { key: "specialties", label: "Especialidades", description: "", visible: true },
  { key: "gallery", label: "Espaço", description: "", visible: true },
  { key: "testimonials", label: "Testemunhos", description: "", visible: true },
  { key: "reservation", label: "Reservas", description: "", visible: true },
];

const DEFAULT_NAV_PAGES: NavPage[] = [
  { key: "conceito", label: "Conceito", href: "/#conceito", route: false, visible: true },
  { key: "ementa", label: "Ementa", href: "/ementa", route: true, visible: true },
  { key: "encomendas", label: "Encomendas", href: "/encomendas", route: true, visible: true },
  { key: "catering", label: "Catering", href: "/catering", route: true, visible: true },
  { key: "espaco", label: "Espaço", href: "/#espaco", route: false, visible: true },
  { key: "testemunhos", label: "Testemunhos", href: "/#testemunhos", route: false, visible: true },
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
];

const DEFAULT_RESTAURANTE: RestauranteConfig = {
  logo: "",
  morada: "Rua da Taberna 12, Lisboa",
  telefone: "+351 210 000 000",
  email: "geral@manjardoramos.pt",
  horario: "Terça a Domingo · 12h00–15h00 · 19h00–23h30",
  googleMapsUrl: "#",
  googleMapsEmbed: "",
  social: {
    instagram: { url: "#", visible: true },
    facebook: { url: "#", visible: true },
    tripadvisor: { url: "", visible: false },
  },
};

const DEFAULT_MAINTENANCE: MaintenanceConfig = {
  enabled: false,
  titulo: "Em manutenção",
  mensagem: "Estamos a preparar algo especial. Voltamos em breve.",
};

/* ------------------------------------------------------------------ */
/*  Helpers de fetch por domínio                                       */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = (table: string) => supabase.from(table as any) as any;

async function fetchMenu(): Promise<MenuCategory[] | null> {
  const { data } = await db("site_menu").select("data").maybeSingle();
  return (data?.data as MenuCategory[]) ?? null;
}

async function fetchWines(): Promise<WinesData | null> {
  const { data } = await db("site_wines").select("data").maybeSingle();
  return (data?.data as WinesData) ?? null;
}

async function fetchTestimonials(): Promise<Testimonial[] | null> {
  const { data } = await db("site_testimonials").select("data").maybeSingle();
  return (data?.data as Testimonial[]) ?? null;
}

async function fetchContent(key: string): Promise<BlockContent | PageContent | null> {
  const { data } = await db("site_content").select("value").eq("key", key).maybeSingle();
  return (data?.value as BlockContent | PageContent) ?? null;
}

async function fetchSetting<T>(key: string): Promise<T | null> {
  const { data } = await db("site_settings").select("value").eq("key", key).maybeSingle();
  return (data?.value as T) ?? null;
}

/* ------------------------------------------------------------------ */
/*  Hooks públicos                                                     */
/* ------------------------------------------------------------------ */

export function useSiteBlocks() {
  const [blocks, setBlocks] = useState<Block[]>(DEFAULT_BLOCKS);

  useEffect(() => {
    fetchSetting<Block[]>("blocks").then((data) => {
      if (data?.length) setBlocks(data);
    });
  }, []);

  const isVisible = (key: Block["key"]) => blocks.find((b) => b.key === key)?.visible ?? true;

  return { isVisible };
}

export function usePageContent(pageKey: PageKey) {
  const [page, setPage] = useState<PageContent | null>(null);

  useEffect(() => {
    fetchContent(`page_${pageKey}`).then((data) => {
      if (data) setPage(data as PageContent);
    });
  }, [pageKey]);

  const field = (label: string, fallback = "") =>
    page?.fields.find((f) => f.label === label)?.value ?? fallback;

  const image = (label: string, fallback = "") =>
    page?.images.find((i) => i.label === label)?.url ?? fallback;

  return { field, image };
}

export function useSiteMenu() {
  const [menu, setMenu] = useState<MenuCategory[] | null>(null);

  useEffect(() => {
    fetchMenu().then((data) => {
      if (data) setMenu(data);
    });
  }, []);

  return menu;
}

export function useSiteWines() {
  const [wines, setWines] = useState<WinesData | null>(null);

  useEffect(() => {
    fetchWines().then((data) => {
      if (data) setWines(data);
    });
  }, []);

  return wines;
}

export function useSiteTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[] | null>(null);

  useEffect(() => {
    fetchTestimonials().then((data) => {
      if (data) setTestimonials(data);
    });
  }, []);

  return testimonials;
}

export function useBlockContent(blockKey: BlockKey) {
  const [content, setContent] = useState<BlockContent | null>(null);

  useEffect(() => {
    fetchContent(`block_${blockKey}`).then((data) => {
      if (data) setContent(data as BlockContent);
    });
  }, [blockKey]);

  const field = (label: string, fallback = "") =>
    content?.fields.find((f) => f.label === label)?.value ?? fallback;

  const image = (label: string, fallback = "") =>
    content?.images.find((i) => i.label === label)?.url ?? fallback;

  const images = () => content?.images ?? [];

  return { field, image, images };
}

export function useRestaurante() {
  const [restaurante, setRestaurante] = useState<RestauranteConfig>(DEFAULT_RESTAURANTE);

  useEffect(() => {
    fetchSetting<RestauranteConfig>("restaurante").then((data) => {
      if (data) setRestaurante(data);
    });
  }, []);

  return restaurante;
}

export function useNavPages() {
  const [navPages, setNavPages] = useState<NavPage[]>(DEFAULT_NAV_PAGES);

  useEffect(() => {
    fetchSetting<NavPage[]>("navPages").then((data) => {
      if (data?.length) setNavPages(data);
    });
  }, []);

  return navPages;
}

export function useMaintenance() {
  const [maintenance, setMaintenance] = useState<MaintenanceConfig>(DEFAULT_MAINTENANCE);

  useEffect(() => {
    fetchSetting<MaintenanceConfig>("maintenance").then((data) => {
      if (data) setMaintenance(data);
    });
  }, []);

  return maintenance;
}
