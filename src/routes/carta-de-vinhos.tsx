import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { useSiteWines } from "@/hooks/useSiteConfig";
import { supabase } from "@/integrations/supabase/client";
import { QrCode } from "lucide-react";
import heroImg from "@/assets/dish-cocktails.jpg";

const TOKEN_KEY = "qr_carta_token";

type TokenState = { expiresAt: number } | null;

function readToken(): TokenState {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { expiresAt: number };
    if (!parsed?.expiresAt || parsed.expiresAt < Date.now()) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeToken(durationMinutes: number) {
  const expiresAt = Date.now() + durationMinutes * 60_000;
  localStorage.setItem(TOKEN_KEY, JSON.stringify({ expiresAt }));
  return expiresAt;
}

export const Route = createFileRoute("/carta-de-vinhos")({
  head: () => ({
    meta: [
      { title: "Carta de Vinhos · Manjar do Ramos" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content: "Garrafeira do Manjar do Ramos: tintos, brancos e espumantes portugueses.",
      },
    ],
  }),
  component: WinesPage,
});

function WinesPage() {
  const [status, setStatus] = useState<"checking" | "granted" | "denied">("checking");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const url = new URL(window.location.href);
      const key = url.searchParams.get("key");

      if (key) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase.rpc as any)("redeem_qr_key", { p_key: key });
        const row = Array.isArray(data) ? data[0] : data;
        if (!error && row?.valid) {
          writeToken(Number(row.duration_minutes));
          url.searchParams.delete("key");
          window.history.replaceState({}, "", url.pathname + url.search);
          if (!cancelled) setStatus("granted");
          return;
        }
      }

      const existing = readToken();
      if (!cancelled) setStatus(existing ? "granted" : "denied");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">A verificar acesso…</p>
      </div>
    );
  }

  if (status === "denied") return <LockedScreen />;

  return <WinesContent />;
}

function LockedScreen() {
  return (
    <div className="bg-background">
      <Navbar />
      <main className="flex min-h-[70vh] items-center justify-center px-5 py-24">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold">
            <QrCode className="h-8 w-8" />
          </div>
          <h1 className="mt-6 font-serif text-3xl text-espresso md:text-4xl">Carta de Vinhos</h1>
          <p className="mt-4 text-muted-foreground">
            A nossa carta de vinhos está disponível apenas para quem se senta à nossa mesa. Por
            favor leia o QR code disponível no restaurante para aceder.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function WinesContent() {
  const wines = useSiteWines();

  return (
    <div className="bg-background">
      <Navbar />
      <main>
        <section className="relative flex h-[55svh] min-h-[380px] items-center justify-center overflow-hidden bg-charcoal">
          <img
            src={heroImg}
            alt="Carta de vinhos do Manjar do Ramos"
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <Reveal className="relative z-10 px-5 text-center">
            <span className="eyebrow text-gold">{wines?.eyebrow ?? "Garrafeira da Casa"}</span>
            <h1 className="mt-5 font-serif text-5xl font-medium leading-tight text-cream md:text-7xl">
              {wines?.title ?? "Carta de Vinhos"}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-cream/85 md:text-lg">
              {wines?.subtitle ?? "Uma seleção rotativa de produtores portugueses."}
            </p>
          </Reveal>
        </section>

        <section className="bg-background py-24 md:py-32">
          <div className="mx-auto max-w-4xl px-5 md:px-10">
            <div className="space-y-16">
              {(wines?.categories ?? []).map((cat) => {
                const visible = cat.items.filter((i) => i.visible);
                if (visible.length === 0) return null;
                return (
                  <Reveal key={cat.id}>
                    <div className="mb-8 text-center">
                      <h2 className="font-serif text-3xl text-espresso md:text-4xl">{cat.name}</h2>
                      <span className="mx-auto mt-4 block h-0.5 w-12 bg-gold" />
                    </div>
                    <ul className="divide-y divide-border">
                      {visible.map((wine) => (
                        <li
                          key={wine.id}
                          className="flex flex-col gap-4 py-5 md:flex-row md:items-start md:gap-6"
                        >
                          {wine.image && (
                            <img
                              src={wine.image}
                              alt={wine.name}
                              className="h-24 w-24 flex-shrink-0 rounded-md object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-serif text-xl text-espresso">
                              {wine.name}
                              {wine.year && wine.year !== "NV" && (
                                <span className="ml-2 font-sans text-sm font-normal text-muted-foreground">
                                  · {wine.year}
                                </span>
                              )}
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {[wine.producer, wine.region].filter(Boolean).join(" — ")}
                            </p>
                            {wine.notes && (
                              <p className="mt-1 text-sm italic text-muted-foreground/85">
                                {wine.notes}
                              </p>
                            )}
                          </div>
                          <span className="w-24 text-left font-serif text-lg font-medium text-wine md:text-right">
                            {wine.price || "—"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
