import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { AdminState, Block } from "@/lib/admin-store";

const DEFAULT_BLOCKS: Block[] = [
  { key: "hero", label: "Hero", description: "", visible: true },
  { key: "about", label: "Conceito", description: "", visible: true },
  { key: "specialties", label: "Especialidades", description: "", visible: true },
  { key: "gallery", label: "Espaço", description: "", visible: true },
  { key: "testimonials", label: "Testemunhos", description: "", visible: true },
  { key: "reservation", label: "Reservas", description: "", visible: true },
];

export function useSiteBlocks() {
  const [blocks, setBlocks] = useState<Block[]>(DEFAULT_BLOCKS);

  useEffect(() => {
    supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from("site_config" as any)
      .select("value")
      .eq("key", "admin_state")
      .maybeSingle()
      .then(({ data }) => {
        const state = data?.value as AdminState | undefined;
        if (state?.blocks?.length) setBlocks(state.blocks);
      });
  }, []);

  const isVisible = (key: Block["key"]) =>
    blocks.find((b) => b.key === key)?.visible ?? true;

  return { isVisible };
}
