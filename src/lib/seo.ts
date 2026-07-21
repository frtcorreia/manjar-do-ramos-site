import { DEFAULT_RESTAURANTE, fetchContent, fetchSetting } from "@/hooks/useSiteConfig";
import type { PageContent, PageKey, RestauranteConfig } from "@/lib/admin-store";

export type PageSeo = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
};

/** Busca os campos de SEO de uma página guardada no admin, com fallback ao texto por omissão. */
export async function getPageSeo(pageKey: PageKey, fallback: PageSeo): Promise<PageSeo> {
  const page = (await fetchContent(`page_${pageKey}`)) as PageContent | null;
  const field = (label: string, def: string) =>
    page?.fields.find((f) => f.label === label)?.value.trim() || def;

  return {
    title: field("Título (SEO)", fallback.title),
    description: field("Descrição (SEO)", fallback.description),
    ogTitle: field("OG Título", fallback.ogTitle),
    ogDescription: field("OG Descrição", fallback.ogDescription),
  };
}

export async function getRestauranteSeo(): Promise<RestauranteConfig> {
  const data = await fetchSetting<RestauranteConfig>("restaurante");
  return data ?? DEFAULT_RESTAURANTE;
}
