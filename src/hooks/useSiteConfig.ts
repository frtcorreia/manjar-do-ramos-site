import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { AdminState, Block, MenuCategory, PageKey } from "@/lib/admin-store";

type Wines = AdminState["wines"];

const DEFAULT_BLOCKS: Block[] = [
  { key: "hero", label: "Hero", description: "", visible: true },
  { key: "about", label: "Conceito", description: "", visible: true },
  { key: "specialties", label: "Especialidades", description: "", visible: true },
  { key: "gallery", label: "Espaço", description: "", visible: true },
  { key: "testimonials", label: "Testemunhos", description: "", visible: true },
  { key: "reservation", label: "Reservas", description: "", visible: true },
];

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
