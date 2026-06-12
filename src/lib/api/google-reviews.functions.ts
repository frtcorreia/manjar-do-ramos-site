import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";
  return createClient(url, key);
}

export const syncGoogleReviews = createServerFn({ method: "POST" })
  .inputValidator(z.object({ placeId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_PLACES_API_KEY não configurada no servidor.");
    }

    const url = `https://places.googleapis.com/v1/places/${data.placeId}?fields=reviews&languageCode=pt`;
    const res = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "reviews",
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Google Places API error (${res.status}): ${body}`);
    }

    const json = await res.json();
    const reviews: Array<{
      name: string;
      authorAttribution?: { displayName?: string; photoUri?: string };
      rating?: number;
      text?: { text?: string };
      relativePublishTimeDescription?: string;
      publishTime?: string;
    }> = json.reviews ?? [];

    if (reviews.length === 0) {
      return { synced: 0 };
    }

    const db = getSupabaseAdmin();
    const now = new Date().toISOString();

    const rows = reviews.map((r) => ({
      id: r.name ?? `review_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      author_name: r.authorAttribution?.displayName ?? "Anónimo",
      rating: r.rating ?? 5,
      text: r.text?.text ?? "",
      relative_time_description: r.relativePublishTimeDescription ?? "",
      profile_photo_url: r.authorAttribution?.photoUri ?? "",
      publish_time: r.publishTime ?? null,
      fetched_at: now,
    }));

    const { error } = await db.from("google_reviews").upsert(rows, { onConflict: "id" });
    if (error) throw new Error(`Supabase upsert error: ${error.message}`);

    return { synced: rows.length };
  });

export const findPlaceId = createServerFn({ method: "POST" })
  .inputValidator(z.object({ query: z.string().min(1) }))
  .handler(async ({ data }) => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_PLACES_API_KEY não configurada no servidor.");
    }

    const url = "https://places.googleapis.com/v1/places:searchText";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress",
      },
      body: JSON.stringify({ textQuery: data.query }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Google Places API error (${res.status}): ${body}`);
    }

    const json = await res.json();
    const places: Array<{
      id: string;
      displayName?: { text?: string };
      formattedAddress?: string;
    }> = json.places ?? [];

    return places.map((p) => ({
      placeId: p.id,
      name: p.displayName?.text ?? "",
      address: p.formattedAddress ?? "",
    }));
  });
