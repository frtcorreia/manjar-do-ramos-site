import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { AdminProvider, useAdmin } from "@/lib/admin-store";
import heroImg from "@/assets/dish-cocktails.jpg";

export const Route = createFileRoute("/carta-de-vinhos")({
  head: () => ({
    meta: [
      { title: "Carta de Vinhos · Manjar do Ramos" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content:
          "Garrafeira do Manjar do Ramos: tintos, brancos e espumantes portugueses.",
      },
    ],
  }),
  component: WinesPage,
});

function WinesPage() {
  return (
    <AdminProvider>
      <WinesPageInner />
    </AdminProvider>
  );
}

function WinesPageInner() {
  const { state } = useAdmin();
  const { wines } = state;

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
            <span className="eyebrow text-gold">{wines.eyebrow}</span>
            <h1 className="mt-5 font-serif text-5xl font-medium leading-tight text-cream md:text-7xl">
              {wines.title}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-cream/85 md:text-lg">
              {wines.subtitle}
            </p>
          </Reveal>
        </section>

        <section className="bg-background py-24 md:py-32">
          <div className="mx-auto max-w-4xl px-5 md:px-10">
            <div className="mb-12 hidden grid-cols-[1fr_auto_auto] gap-6 border-b border-border pb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground md:grid">
              <span>Vinho</span>
              <span className="w-20 text-right">Copo</span>
              <span className="w-24 text-right">Garrafa</span>
            </div>

            <div className="space-y-16">
              {wines.categories.map((cat) => {
                const visible = cat.items.filter((i) => i.visible);
                if (visible.length === 0) return null;
                return (
                  <Reveal key={cat.id}>
                    <div className="mb-8 text-center">
                      <h2 className="font-serif text-3xl text-espresso md:text-4xl">
                        {cat.name}
                      </h2>
                      <span className="mx-auto mt-4 block h-0.5 w-12 bg-gold" />
                    </div>
                    <ul className="divide-y divide-border">
                      {visible.map((wine) => (
                        <li
                          key={wine.id}
                          className="grid grid-cols-1 gap-2 py-5 md:grid-cols-[1fr_auto_auto] md:items-baseline md:gap-6"
                        >
                          <div>
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
                          <span className="w-20 text-left font-serif text-base text-wine md:text-right">
                            {wine.glassPrice || "—"}
                          </span>
                          <span className="w-24 text-left font-serif text-lg font-medium text-wine md:text-right">
                            {wine.bottlePrice || "—"}
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