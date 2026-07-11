const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;

/**
 * Rewrites an absolute Supabase Storage public URL into a same-origin
 * relative path (proxied by the /storage/$ server route), so the
 * Supabase project host never appears in rendered HTML/DOM.
 */
export function toProxiedAssetUrl(url: string): string {
  if (!SUPABASE_URL || typeof url !== "string" || !url.startsWith(SUPABASE_URL)) {
    return url;
  }
  return url.slice(SUPABASE_URL.length);
}

/** Deep-walks any JSON-like value, proxying every Supabase Storage URL string found. */
export function hideSupabaseUrls<T>(value: T): T {
  if (typeof value === "string") {
    return toProxiedAssetUrl(value) as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => hideSupabaseUrls(item)) as unknown as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      out[key] = hideSupabaseUrls(val);
    }
    return out as T;
  }
  return value;
}
