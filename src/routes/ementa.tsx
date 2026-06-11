import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { usePageContent, useSiteMenu } from "@/hooks/useSiteConfig";
import { supabase } from "@/integrations/supabase/client";
import type { Allergen } from "@/lib/admin-store";

const EMENTA_SESSION_KEY = "ementa_read_recorded";

const ALLERGENS: { id: Allergen; label: string; emoji: string }[] = [
  { id: "gluten", label: "Glúten", emoji: "🌾" },
  { id: "crustaceans", label: "Crustáceos", emoji: "🦐" },
  { id: "eggs", label: "Ovos", emoji: "🥚" },
  { id: "fish", label: "Peixes", emoji: "🐟" },
  { id: "peanuts", label: "Amendoins", emoji: "🥜" },
  { id: "soy", label: "Soja", emoji: "🫘" },
  { id: "milk", label: "Leite", emoji: "🥛" },
  { id: "nuts", label: "Frutos de casca rija", emoji: "🌰" },
  { id: "celery", label: "Aipo", emoji: "🌿" },
  { id: "mustard", label: "Mostarda", emoji: "🟡" },
  { id: "sesame", label: "Sementes de sésamo", emoji: "⚪" },
  { id: "sulphites", label: "Dióxido de enxofre e sulfitos", emoji: "🍷" },
  { id: "lupin", label: "Tremoço", emoji: "🟠" },
  { id: "molluscs", label: "Moluscos", emoji: "🦑" },
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
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(EMENTA_SESSION_KEY)) return;
    sessionStorage.setItem(EMENTA_SESSION_KEY, "1");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.rpc as any)("record_ementa_read").catch(() => {});
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

  return (
    <div className="bg-background">
      <Navbar forceScrolled />
      <CategoryNav categories={visibleCategories.map((c) => ({ id: c.slug, name: c.name }))} activeId={activeId} />

      <main className="pt-[140px] md:pt-[148px]">
        {/* Menu */}
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
                                      className="text-base leading-none"
                                    >
                                      {info.emoji}
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

            <Reveal className="mt-20 rounded-2xl border border-border bg-secondary/50 p-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Legenda de alergénicos
              </p>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {ALLERGENS.map((a) => (
                  <li key={a.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-base leading-none">{a.emoji}</span>
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
