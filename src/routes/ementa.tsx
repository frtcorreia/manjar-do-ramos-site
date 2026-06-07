import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import heroImgDefault from "@/assets/dish-carne.jpg";
import { usePageContent, useSiteMenu } from "@/hooks/useSiteConfig";
import type { Allergen } from "@/lib/admin-store";

const ALLERGENS: { id: Allergen; label: string; emoji: string }[] = [
  { id: "gluten",      label: "Glúten",                       emoji: "🌾" },
  { id: "crustaceans", label: "Crustáceos",                    emoji: "🦐" },
  { id: "eggs",        label: "Ovos",                          emoji: "🥚" },
  { id: "fish",        label: "Peixes",                        emoji: "🐟" },
  { id: "peanuts",     label: "Amendoins",                     emoji: "🥜" },
  { id: "soy",         label: "Soja",                          emoji: "🫘" },
  { id: "milk",        label: "Leite",                         emoji: "🥛" },
  { id: "nuts",        label: "Frutos de casca rija",          emoji: "🌰" },
  { id: "celery",      label: "Aipo",                          emoji: "🌿" },
  { id: "mustard",     label: "Mostarda",                      emoji: "🟡" },
  { id: "sesame",      label: "Sementes de sésamo",            emoji: "⚪" },
  { id: "sulphites",   label: "Dióxido de enxofre e sulfitos", emoji: "🍷" },
  { id: "lupin",       label: "Tremoço",                       emoji: "🟠" },
  { id: "molluscs",    label: "Moluscos",                      emoji: "🦑" },
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

function EmentaPage() {
  const { field, image } = usePageContent("ementa");
  const heroImg = image("Hero — Imagem de fundo", heroImgDefault);
  const menu = useSiteMenu();

  return (
    <div className="bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative flex h-[60svh] min-h-[420px] items-center justify-center overflow-hidden bg-charcoal">
          <img
            src={heroImg}
            alt="Carnes maturadas na brasa do Manjar do Ramos"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <Reveal className="relative z-10 px-5 text-center">
            <span className="eyebrow text-gold">{field("Hero — Etiqueta", "Ementa da Casa")}</span>
            <h1 className="mt-5 font-serif text-5xl font-medium leading-tight text-cream md:text-7xl">
              {field("Hero — Título", "A nossa ementa")}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-cream/85 md:text-lg">
              {field("Hero — Subtítulo", "Sabores portugueses pensados para partilhar à volta da mesa.")}
            </p>
          </Reveal>
        </section>

        {/* Menu */}
        <section className="bg-background py-24 md:py-32">
          <div className="mx-auto max-w-4xl px-5 md:px-10">
            <div className="space-y-20">
              {(menu ?? []).map((category) => {
                const visibleItems = category.items.filter((i) => i.visible);
                if (visibleItems.length === 0) return null;
                return (
                  <Reveal key={category.id}>
                    <div className="mb-8 text-center">
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
                                      className="text-base leading-none"
                                      aria-label={info.label}
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
                Os alergénicos indicados são de carácter informativo. Em caso de alergias ou intolerâncias alimentares graves, por favor informe o nosso pessoal antes de encomendar.
              </p>
            </Reveal>

            <Reveal className="mt-10 rounded-2xl bg-secondary p-10 text-center shadow-soft">
              <h2 className="font-serif text-3xl text-espresso md:text-4xl">
                {field("CTA — Título", "Pronto para uma mesa cheia?")}
              </h2>
              <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                {field("CTA — Subtítulo", "Reserve a sua mesa e deixe a noite acontecer entre pratos, vinho e boa conversa.")}
              </p>
              <a
                href="/#reservar"
                className="mt-8 inline-block rounded-full bg-wine px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-cream shadow-soft transition-transform hover:scale-[1.03]"
              >
                {field("CTA — Botão", "Reservar Mesa")}
              </a>
              <p className="mt-6 text-xs text-muted-foreground">
                Organiza um evento?{" "}
                <Link to="/catering" className="font-semibold text-wine underline">
                  Conheça o nosso serviço de catering
                </Link>
              </p>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}