import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

// Proxies Supabase Storage public objects through our own domain so the
// Supabase project host never leaks into rendered HTML/DOM (view-source,
// devtools, etc). Public site images reference this route via
// toProxiedAssetUrl() / hideSupabaseUrls() instead of the raw Supabase URL.
export const Route = createFileRoute("/storage/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
        if (!supabaseUrl) {
          return new Response("Storage not configured", { status: 500 });
        }

        // params._splat already contains "v1/object/public/<bucket>/<path>"
        // (see toProxiedAssetUrl, which strips only the Supabase origin).
        const upstream = `${supabaseUrl}/storage/${params._splat ?? ""}`;
        const res = await fetch(upstream);

        if (!res.ok || !res.body) {
          return new Response(null, { status: res.status });
        }

        const headers = new Headers();
        const contentType = res.headers.get("content-type");
        if (contentType) headers.set("content-type", contentType);
        headers.set("cache-control", "public, max-age=31536000, immutable");

        return new Response(res.body, { status: 200, headers });
      },
    },
  },
});
