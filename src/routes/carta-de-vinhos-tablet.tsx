import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Delete, Wine as WineIcon } from "lucide-react";
import { useSiteWines } from "@/hooks/useSiteConfig";
import type { WineCategory, WineItem } from "@/lib/admin-store";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const PIN_STORAGE_KEY = "wine_tablet_pin_ok";
const CORRECT_PIN = "2929";

export const Route = createFileRoute("/carta-de-vinhos-tablet")({
  head: () => ({
    meta: [
      { title: "Carta de Vinhos · Manjar do Ramos" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content: "Carta de vinhos do Manjar do Ramos, em formato de vitrine para tablet.",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
    ],
  }),
  component: WineTabletPage,
});

function WineTabletPage() {
  const [unlocked, setUnlocked] = useState(
    () => typeof window !== "undefined" && localStorage.getItem(PIN_STORAGE_KEY) === "true",
  );

  if (!unlocked) return <PinGate onSuccess={() => setUnlocked(true)} />;

  return <WineTabletContent />;
}

function WineTabletContent() {
  const wines = useSiteWines();

  const categories = (wines?.categories ?? []).filter((c) =>
    c.items.some((i) => i.visible),
  ) as WineCategory[];

  if (!wines) return <StatusScreen message="A carregar a carta de vinhos…" />;
  if (categories.length === 0)
    return <StatusScreen message="A carta de vinhos ainda não tem vinhos disponíveis." />;

  return <WineShowcase categories={categories} />;
}

function PinGate({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const addDigit = (digit: string) => {
    if (error || pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    if (next.length < 4) return;

    if (next === CORRECT_PIN) {
      localStorage.setItem(PIN_STORAGE_KEY, "true");
      onSuccess();
      return;
    }

    setError(true);
    setTimeout(() => {
      setPin("");
      setError(false);
    }, 600);
  };

  const removeDigit = () => setPin((p) => p.slice(0, -1));

  return (
    <div className="fixed inset-0 flex h-dvh w-screen flex-col items-center justify-center gap-10 bg-charcoal px-6 text-cream">
      <div className="text-center">
        <WineIcon className="mx-auto h-9 w-9 text-gold/70" />
        <h1 className="mt-4 font-serif text-2xl text-cream">Carta de Vinhos</h1>
        <p className="mt-1 text-sm text-cream/50">Introduza o PIN para continuar</p>
      </div>

      <div className={cn("flex gap-4", error && "animate-shake")}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-3.5 w-3.5 rounded-full border transition-colors",
              error
                ? "border-destructive bg-destructive"
                : i < pin.length
                  ? "border-gold bg-gold"
                  : "border-cream/30 bg-transparent",
            )}
          />
        ))}
      </div>

      <div className="grid w-full max-w-xs grid-cols-3 gap-3">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => addDigit(d)}
            className="rounded-2xl bg-white/10 py-4 text-xl font-medium text-cream backdrop-blur-md transition-colors hover:bg-white/20 active:bg-white/25"
          >
            {d}
          </button>
        ))}
        <div />
        <button
          type="button"
          onClick={() => addDigit("0")}
          className="rounded-2xl bg-white/10 py-4 text-xl font-medium text-cream backdrop-blur-md transition-colors hover:bg-white/20 active:bg-white/25"
        >
          0
        </button>
        <button
          type="button"
          aria-label="Apagar"
          onClick={removeDigit}
          className="flex items-center justify-center rounded-2xl bg-white/10 py-4 text-cream backdrop-blur-md transition-colors hover:bg-white/20 active:bg-white/25"
        >
          <Delete className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function StatusScreen({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 flex h-dvh w-screen items-center justify-center bg-charcoal px-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <WineIcon className="h-10 w-10 text-gold/60" />
        <p className="text-cream/70">{message}</p>
      </div>
    </div>
  );
}

function WineShowcase({ categories }: { categories: WineCategory[] }) {
  const [activeCatId, setActiveCatId] = useState(categories[0].id);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const activeCat = categories.find((c) => c.id === activeCatId) ?? categories[0];
  const items = activeCat.items.filter((i) => i.visible);
  const wine: WineItem | undefined = items[current];

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  const selectCategory = (id: string) => {
    if (id === activeCatId) return;
    setActiveCatId(id);
    setCurrent(0);
    api?.scrollTo(0, true);
  };

  return (
    <div className="fixed inset-0 h-dvh w-screen overflow-hidden bg-charcoal text-cream">
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: false }}
        className="absolute inset-0 h-full w-full"
      >
        <CarouselContent className="ml-0 h-dvh">
          {items.map((w) => (
            <CarouselItem key={w.id} className="h-dvh basis-full pl-0">
              <WineSlide wine={w} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <CategoryNav
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        activeId={activeCatId}
        onSelect={selectCategory}
      />

      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Vinho anterior"
            disabled={!canPrev}
            onClick={() => api?.scrollPrev()}
            className="absolute left-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-cream backdrop-blur-md transition-opacity disabled:opacity-0 md:left-6"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Próximo vinho"
            disabled={!canNext}
            onClick={() => api?.scrollNext()}
            className="absolute right-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-cream backdrop-blur-md transition-opacity disabled:opacity-0 md:right-6"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {wine && <WineOverlay wine={wine} count={items.length} index={current} />}
    </div>
  );
}

function WineSlide({ wine }: { wine: WineItem }) {
  return (
    <div className="relative h-dvh w-full">
      {wine.image ? (
        <img
          src={wine.image}
          alt={wine.name}
          draggable={false}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-espresso to-charcoal">
          <WineIcon className="h-16 w-16 text-cream/15" />
        </div>
      )}
    </div>
  );
}

function WineOverlay({ wine, count, index }: { wine: WineItem; count: number; index: number }) {
  const meta = [wine.region, wine.year && wine.year !== "NV" ? wine.year : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/55 to-transparent pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-28">
      <div className="flex items-end justify-between gap-4 px-6 md:px-12">
        <div className="min-w-0">
          {meta && (
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">{meta}</p>
          )}
          <h1 className="mt-1 font-serif text-3xl leading-tight text-cream md:text-5xl">
            {wine.name}
          </h1>
          {wine.producer && (
            <p className="mt-1 text-sm text-cream/60 md:text-base">{wine.producer}</p>
          )}
        </div>
        <p className="shrink-0 font-serif text-2xl font-medium text-gold md:text-4xl">
          {wine.price || "—"}
        </p>
      </div>

      {count > 1 && (
        <div className="mt-5 flex items-center justify-center gap-1.5 px-6">
          {Array.from({ length: count }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-5 bg-gold" : "w-1.5 bg-cream/30",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryNav({
  categories,
  activeId,
  onSelect,
}: {
  categories: { id: string; name: string }[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const navRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeId]);

  return (
    <div className="absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-black/80 to-transparent pb-10 pt-[max(1rem,env(safe-area-inset-top))]">
      <div
        ref={navRef}
        className="flex gap-2 overflow-x-auto px-5 scrollbar-none md:px-10"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat) => {
          const isActive = activeId === cat.id;
          return (
            <button
              key={cat.id}
              ref={
                isActive
                  ? (el) => {
                      activeRef.current = el;
                    }
                  : undefined
              }
              onClick={() => onSelect(cat.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium backdrop-blur-md transition-all duration-200",
                isActive
                  ? "bg-gold text-charcoal shadow-gold"
                  : "bg-white/10 text-cream/75 hover:bg-white/20 hover:text-cream",
              )}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
