import { useEffect, useState } from "react";
import { useAdmin, type GoogleReview } from "@/lib/admin-store";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search, Star } from "lucide-react";
import { toast } from "sonner";
import { syncGoogleReviews, findPlaceId } from "@/lib/api/google-reviews.functions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = (table: string) => supabase.from(table as any) as any;

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < count ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

export function GoogleReviewsSection() {
  const { state, setState } = useAdmin();
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { placeId: string; name: string; address: string }[]
  >([]);

  const placeId = state.restaurante.googlePlaceId ?? "";

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    const { data } = await db("google_reviews")
      .select("*")
      .order("publish_time", { ascending: false });
    if (data) setReviews(data as GoogleReview[]);
  }

  async function handleSync() {
    if (!placeId) {
      toast.error("Configura o Google Place ID primeiro.");
      return;
    }
    setSyncing(true);
    try {
      const result = await syncGoogleReviews({ data: { placeId } });
      toast.success(`${result.synced} reviews sincronizadas do Google.`);
      await loadReviews();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao sincronizar.");
    } finally {
      setSyncing(false);
    }
  }

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const results = await findPlaceId({ data: { query: searchQuery } });
      setSearchResults(results);
      if (results.length === 0) toast.info("Nenhum resultado encontrado.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro na pesquisa.");
    } finally {
      setSearching(false);
    }
  }

  function selectPlaceId(id: string) {
    setState((s) => ({
      ...s,
      restaurante: { ...s.restaurante, googlePlaceId: id },
    }));
    setSearchResults([]);
    toast.success("Place ID configurado.");
  }

  async function toggleVisible(id: string, visible: boolean) {
    await db("google_reviews").update({ visible }).eq("id", id);
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, visible } : r)));
  }

  const lastFetch = reviews[0]?.fetched_at
    ? new Date(reviews[0].fetched_at).toLocaleString("pt-PT")
    : null;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-charcoal">Google Reviews</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sincroniza críticas do Google e escolhe quais aparecem no site.
        </p>
      </header>

      {/* Place ID config */}
      <div className="space-y-3 rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-charcoal">Google Place ID</h2>
        <div className="flex gap-2">
          <Input
            value={placeId}
            onChange={(e) =>
              setState((s) => ({
                ...s,
                restaurante: { ...s.restaurante, googlePlaceId: e.target.value },
              }))
            }
            placeholder="Ex: ChIJ..."
            className="flex-1"
          />
        </div>

        <div className="border-t border-border pt-3">
          <p className="mb-2 text-xs text-muted-foreground">
            Não sabes o Place ID? Pesquisa pelo nome do restaurante:
          </p>
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ex: Taberna Manjar do Ramos"
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={searching} variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              {searching ? "A pesquisar..." : "Pesquisar"}
            </Button>
          </div>
          {searchResults.length > 0 && (
            <div className="mt-2 space-y-2">
              {searchResults.map((r) => (
                <button
                  key={r.placeId}
                  onClick={() => selectPlaceId(r.placeId)}
                  className="w-full rounded-lg border border-border p-3 text-left transition hover:bg-accent"
                >
                  <p className="font-medium text-charcoal">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.address}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{r.placeId}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sync button */}
      <div className="flex items-center gap-4">
        <Button onClick={handleSync} disabled={syncing || !placeId} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "A sincronizar..." : "Sincronizar com Google"}
        </Button>
        {lastFetch && (
          <span className="text-xs text-muted-foreground">
            Última sincronização: {lastFetch}
          </span>
        )}
      </div>

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma review encontrada. Configura o Place ID e sincroniza.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((r) => (
            <div
              key={r.id}
              className={`space-y-3 rounded-xl border border-border bg-card p-5 transition ${
                !r.visible ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={r.visible}
                    onCheckedChange={(v) => toggleVisible(r.id, v)}
                  />
                  <span className="text-xs text-muted-foreground">
                    {r.visible ? "Visível" : "Oculto"}
                  </span>
                </div>
                <Stars count={r.rating} />
              </div>
              {r.text && (
                <p className="text-sm leading-relaxed text-charcoal">"{r.text}"</p>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {r.profile_photo_url && (
                  <img
                    src={r.profile_photo_url}
                    alt={r.author_name}
                    className="h-6 w-6 rounded-full"
                  />
                )}
                <span className="font-medium">{r.author_name}</span>
                {r.relative_time_description && (
                  <>
                    <span>·</span>
                    <span>{r.relative_time_description}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
