import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type {
  AdminState,
  Block,
  BlockKey,
  BlockContent,
  MaintenanceConfig,
  MenuCategory,
  NavPage,
  PageKey,
  RestauranteConfig,
  Testimonial,
} from "@/lib/admin-store";

type Wines = AdminState["wines"];

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
  { key: "carta-de-vinhos", label: "Carta de Vinhos", href: "/carta-de-vinhos", route: true, visible: false },
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

function fetchAdminState(): Promise<AdminState | null> {
  return supabase
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .from("site_config" as any)
    .select("value")
    .eq("key", "admin_state")
    .maybeSingle()
    .then(({ data }) => (data?.value as AdminState) ?? null);
}

export function useSiteBlocks() {
  const [blocks, setBlocks] = useState<Block[]>(DEFAULT_BLOCKS);

  useEffect(() => {
    fetchAdminState().then((state) => {
      if (state?.blocks?.length) setBlocks(state.blocks);
    });
  }, []);

  const isVisible = (key: Block["key"]) =>
    blocks.find((b) => b.key === key)?.visible ?? true;

  return { isVisible };
}

export function usePageContent(pageKey: PageKey) {
  const [state, setState] = useState<AdminState | null>(null);

  useEffect(() => {
    fetchAdminState().then(setState);
  }, []);

  const page = state?.pages.find((p) => p.key === pageKey);

  const field = (label: string, fallback = "") =>
    page?.fields.find((f) => f.label === label)?.value ?? fallback;

  const image = (label: string, fallback = "") =>
    page?.images.find((i) => i.label === label)?.url ?? fallback;

  return { field, image };
}

export function useSiteMenu() {
  const [menu, setMenu] = useState<MenuCategory[] | null>(null);

  useEffect(() => {
    fetchAdminState().then((state) => {
      if (state?.menu) setMenu(state.menu);
    });
  }, []);

  return menu;
}

export function useSiteWines() {
  const [wines, setWines] = useState<Wines | null>(null);

  useEffect(() => {
    fetchAdminState().then((state) => {
      if (state?.wines) setWines(state.wines);
    });
  }, []);

  return wines;
}

export function useSiteTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[] | null>(null);

  useEffect(() => {
    fetchAdminState().then((state) => {
      if (state?.testimonials) setTestimonials(state.testimonials);
    });
  }, []);

  return testimonials;
}

export function useBlockContent(blockKey: BlockKey) {
  const [content, setContent] = useState<BlockContent | null>(null);

  useEffect(() => {
    fetchAdminState().then((state) => {
      const block = state?.content?.find((b) => b.key === blockKey);
      if (block) setContent(block);
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
    fetchAdminState().then((state) => {
      if (state?.restaurante) setRestaurante(state.restaurante);
    });
  }, []);

  return restaurante;
}

export function useNavPages() {
  const [navPages, setNavPages] = useState<NavPage[]>(DEFAULT_NAV_PAGES);

  useEffect(() => {
    fetchAdminState().then((state) => {
      if (state?.navPages?.length) setNavPages(state.navPages);
    });
  }, []);

  return navPages;
}

export function useMaintenance() {
  const [maintenance, setMaintenance] = useState<MaintenanceConfig>(DEFAULT_MAINTENANCE);

  useEffect(() => {
    fetchAdminState().then((state) => {
      if (state?.maintenance) setMaintenance(state.maintenance);
    });
  }, []);

  return maintenance;
}
