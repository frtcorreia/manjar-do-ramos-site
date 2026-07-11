import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageLoader } from "@/components/PageLoader";
import { Reveal } from "@/components/Reveal";
import { usePageContent, useSiteMenu, useMenuPrices, useRestaurante } from "@/hooks/useSiteConfig";
import { supabase } from "@/integrations/supabase/client";
import type { Allergen } from "@/lib/admin-store";

const EMENTA_SESSION_KEY = "ementa_read_recorded";

function AllergenIcon({ id, size = 24 }: { id: string; size?: number }) {
  const icons: Record<string, React.ReactNode> = {
    sulphites: (
      <path d="M12 4v2m0 0a2 2 0 012 2v1h1a1 1 0 011 1v1h-8v-1a1 1 0 011-1h1V8a2 2 0 012-2zm-3 8h6l-.5 6a2 2 0 01-2 2h-1a2 2 0 01-2-2L9 12z" stroke="white" strokeWidth="1.2" fill="none" />
    ),
    gluten: (
      <g stroke="white" strokeWidth="1.1" fill="none">
        <path d="M12 20V10" />
        <path d="M12 10c-1-2-3-3-4-6 2 .5 3.5 2.5 4 4" />
        <path d="M12 10c1-2 3-3 4-6-2 .5-3.5 2.5-4 4" />
        <path d="M12 13c-1-1.5-2.5-2-3.5-4.5 1.8.3 3 1.8 3.5 3" />
        <path d="M12 13c1-1.5 2.5-2 3.5-4.5-1.8.3-3 1.8-3.5 3" />
      </g>
    ),
    milk: (
      <g stroke="white" strokeWidth="1.2" fill="none">
        <rect x="8" y="6" width="8" height="13" rx="1" />
        <path d="M8 10h8" />
        <path d="M10 6V4h4v2" />
      </g>
    ),
    eggs: (
      <ellipse cx="12" cy="13" rx="4.5" ry="5.5" stroke="white" strokeWidth="1.2" fill="none" />
    ),
    soy: (
      <g stroke="white" strokeWidth="1.2" fill="none">
        <ellipse cx="10" cy="11" rx="2.5" ry="4" transform="rotate(-20 10 11)" />
        <ellipse cx="14" cy="13" rx="2.5" ry="4" transform="rotate(20 14 13)" />
      </g>
    ),
    celery: (
      <g stroke="white" strokeWidth="1.2" fill="none">
        <path d="M12 20v-8" />
        <path d="M12 12c-2-3-5-4-5-7 2 1 4 3 5 5" />
        <path d="M12 12c2-3 5-4 5-7-2 1-4 3-5 5" />
        <path d="M12 15c-1.5-2-3-3-3-5 1.5.5 2.5 2 3 3.5" />
        <path d="M12 15c1.5-2 3-3 3-5-1.5.5-2.5 2-3 3.5" />
      </g>
    ),
    fish: (
      <g stroke="white" strokeWidth="1.2" fill="none">
        <path d="M4 12c3-4 7-5 11-3l-3 3 3 3c-4 2-8 1-11-3z" />
        <circle cx="14" cy="11" r=".8" fill="white" />
        <path d="M19 9c1 1 1 3 0 4" strokeLinecap="round" />
      </g>
    ),
    molluscs: (
      <g stroke="white" strokeWidth="1.2" fill="none">
        <path d="M6 16c0-5 3-10 6-10s6 5 6 10" />
        <path d="M6 16h12" />
        <path d="M9 11c1-1 2-1 3 0s2 1 3 0" />
      </g>
    ),
    crustaceans: (
      <g stroke="white" strokeWidth="1.2" fill="none">
        <ellipse cx="12" cy="13" rx="4" ry="3" />
        <path d="M8 13c-2-1-3-3-3-4l2 1" />
        <path d="M16 13c2-1 3-3 3-4l-2 1" />
        <path d="M10 10l-1-3" />
        <path d="M14 10l1-3" />
        <path d="M10 16l-1 2" />
        <path d="M12 16v2" />
        <path d="M14 16l1 2" />
      </g>
    ),
    nuts: (
      <g stroke="white" strokeWidth="1.2" fill="none">
        <ellipse cx="12" cy="14" rx="4" ry="3" />
        <path d="M8 14c0-4 1.5-7 4-8 2.5 1 4 4 4 8" />
      </g>
    ),
    peanuts: (
      <g stroke="white" strokeWidth="1.2" fill="none">
        <ellipse cx="12" cy="14" rx="4" ry="3" />
        <path d="M8 14c0-4 1.5-7 4-8 2.5 1 4 4 4 8" />
      </g>
    ),
    lupin: (
      <g stroke="white" strokeWidth="1.2" fill="none">
        <circle cx="10" cy="12" r="2.5" />
        <circle cx="14.5" cy="12" r="2.5" />
        <path d="M12 15v4" />
      </g>
    ),
    mustard: (
      <g stroke="white" strokeWidth="1.2" fill="none">
        <rect x="9" y="8" width="6" height="10" rx="1" />
        <path d="M10 8V6h4v2" />
        <path d="M12 5V4" />
        <path d="M9 12h6" />
      </g>
    ),
    sesame: (
      <g stroke="white" strokeWidth="1.2" fill="none">
        <ellipse cx="10" cy="12" rx="2" ry="3" transform="rotate(-15 10 12)" />
        <ellipse cx="14" cy="12" rx="2" ry="3" transform="rotate(15 14 12)" />
      </g>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="currentColor" className="text-foreground" />
      {icons[id]}
    </svg>
  );
}

const ALLERGENS: { id: Allergen; label: string }[] = [
  { id: "sulphites", label: "Sulfitos" },
  { id: "gluten", label: "Glúten" },
  { id: "milk", label: "Lactose" },
  { id: "eggs", label: "Ovo" },
  { id: "soy", label: "Soja" },
  { id: "celery", label: "Aipo" },
  { id: "fish", label: "Peixe" },
  { id: "molluscs", label: "Moluscos" },
  { id: "crustaceans", label: "Crustáceos" },
  { id: "nuts", label: "Frutos casca rija" },
  { id: "peanuts", label: "Amendoins" },
  { id: "lupin", label: "Tremoços" },
  { id: "mustard", label: "Mostarda" },
  { id: "sesame", label: "Sésamo" },
];

export const Route = createFileRoute("/ementa")({
  head: () => ({
    meta: [
      { title: "Ementa · Manjar do Ramos · Taberna Moderna Portuguesa" },
      {
        name: "description",
        content:
          "Descubra a ementa do Manjar do Ramos: petiscos, carnes maturadas, bacalhau, tábuas de partilha, sobremesas e cocktails. Sabores portugueses para partilhar.",
      },
      { property: "og:title", content: "Ementa · Manjar do Ramos" },
      {
        property: "og:description",
        content:
          "Petiscos, carnes maturadas, bacalhau e tábuas de partilha numa taberna portuguesa contemporânea.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: EmentaPage,
});

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function CategoryNav({
  categories,
  activeId,
}: {
  categories: { id: string; name: string }[];
  activeId: string | null;
}) {
  const navRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (activeRef.current && navRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeId]);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    // offset: navbar (~80px) + category nav (~52px) + small gap
    const offset = 140;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <div className="fixed inset-x-0 z-40 bg-charcoal/95 backdrop-blur-md shadow-soft top-[88px] md:top-[96px]">
      <div
        ref={navRef}
        className="flex gap-1 overflow-x-auto px-5 py-3 md:px-10 scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat) => {
          const isActive = activeId === cat.id;
          return (
            <button
              key={cat.id}
              ref={isActive ? (el) => { activeRef.current = el; } : undefined}
              onClick={() => scrollTo(cat.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gold text-charcoal"
                  : "text-cream/70 hover:text-cream hover:bg-white/10"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EmentaPage() {
  usePageContent("ementa");
  const menu = useSiteMenu();
  const menuPrices = useMenuPrices();
  const restaurante = useRestaurante();
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(EMENTA_SESSION_KEY)) return;
    sessionStorage.setItem(EMENTA_SESSION_KEY, "1");
    try { supabase.rpc("record_ementa_read"); } catch { /* best-effort */ }
  }, []);

  const visibleCategories = (menu ?? [])
    .filter((cat) => cat.items.some((i) => i.visible))
    .map((cat) => ({ ...cat, slug: slugify(cat.name) }));

  useEffect(() => {
    if (visibleCategories.length === 0) return;

    const observers: IntersectionObserver[] = [];

    // Use a map to track intersection ratios per section
    const ratios: Record<string, number> = {};

    visibleCategories.forEach((cat) => {
      const el = document.getElementById(cat.slug);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          ratios[cat.slug] = entry.intersectionRatio;
          // Pick the category with the highest intersection ratio
          const best = Object.entries(ratios).sort((a, b) => b[1] - a[1])[0];
          if (best && best[1] > 0) setActiveId(best[0]);
        },
        { threshold: Array.from({ length: 21 }, (_, i) => i / 20), rootMargin: "-120px 0px -40% 0px" },
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu]);

  // Set first category as default active
  useEffect(() => {
    if (!activeId && visibleCategories.length > 0) {
      setActiveId(visibleCategories[0].slug);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleCategories.length]);

  const isLoading = menu === null;

  return (
    <div className="bg-background">
      <PageLoader isLoading={menu === null} />
      <Navbar forceScrolled />
      {!isLoading && (
        <CategoryNav categories={visibleCategories.map((c) => ({ id: c.slug, name: c.name }))} activeId={activeId} />
      )}

      <main className="pt-[140px] md:pt-[148px]">
        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-5 md:px-10">
            <div className="space-y-20">
              {visibleCategories.map((category) => {
                const visibleItems = category.items.filter((i) => i.visible);
                return (
                  <Reveal key={category.id}>
                    <div id={category.slug} className="mb-8 scroll-mt-36 text-center">
                      <h2 className="mt-3 font-serif text-3xl text-espresso md:text-4xl">
                        {category.name}
                      </h2>
                      <span className="mx-auto mt-5 block h-0.5 w-12 bg-gold" />
                    </div>
                    <ul className="space-y-6">
                      {visibleItems.map((item) => (
                        <li key={item.id} className="flex items-baseline gap-4">
                          <div className="flex-1">
                            <div className="flex items-baseline gap-3">
                              <h3 className="font-serif text-xl text-espresso">{item.name}</h3>
                              <span className="h-px flex-1 translate-y-[-2px] border-b border-dashed border-border" />
                              <span className="font-serif text-lg font-medium text-wine">
                                {item.price}
                              </span>
                            </div>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                              {item.description}
                            </p>
                            {(item.allergens ?? []).length > 0 && (
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {(item.allergens ?? []).map((a) => {
                                  const info = ALLERGENS.find((x) => x.id === a);
                                  return info ? (
                                    <span
                                      key={a}
                                      title={info.label}
                                      aria-label={info.label}
                                      className="inline-flex"
                                    >
                                      <AllergenIcon id={a} size={20} />
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                );
              })}
            </div>

            <Reveal className="mt-16 text-center space-y-1">
              <p className="text-sm italic text-muted-foreground">
                Caso tenha alguma alergia informe o funcionário
              </p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                Inclui I.V.A à taxa em vigor — {restaurante.nomeProprietario || "—"} — {restaurante.nif || "—"}
              </p>
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
                Caixa take-away {menuPrices.takeawayBox} Saco {menuPrices.bag}
              </p>
            </Reveal>

            <Reveal className="mt-10 rounded-2xl border border-border bg-secondary/50 p-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Legenda de alergénicos
              </p>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {ALLERGENS.map((a) => (
                  <li key={a.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AllergenIcon id={a.id} size={22} />
                    <span>{a.label}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[11px] leading-relaxed text-muted-foreground/70">
                Os alergénicos indicados são de carácter informativo. Em caso de alergias ou
                intolerâncias alimentares graves, por favor informe o nosso pessoal antes de
                encomendar.
              </p>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
