import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { AdminProvider, useAdmin, type MenuItem } from "@/lib/admin-store";
import { Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import heroImg from "@/assets/dish-petiscos.jpg";
import { cartStorage, formatEUR, parsePrice } from "@/lib/cart";

export const Route = createFileRoute("/encomendas")({
  head: () => ({
    meta: [
      { title: "Encomendas · Manjar do Ramos · Delivery" },
      {
        name: "description",
        content:
          "Encomende os pratos do Manjar do Ramos para delivery. Petiscos, carnes na brasa e tábuas de partilha entregues em sua casa.",
      },
      { property: "og:title", content: "Encomendas · Manjar do Ramos" },
      {
        property: "og:description",
        content: "Os sabores da taberna entregues em sua casa. Encomende online.",
      },
    ],
  }),
  component: EncomendasPage,
});

function EncomendasPage() {
  return (
    <AdminProvider>
      <EncomendasInner />
    </AdminProvider>
  );
}

function EncomendasInner() {
  const { state } = useAdmin();
  const navigate = useNavigate();
  const [cart, setCart] = useState<Record<string, number>>(() => {
    const lines = cartStorage.read();
    return Object.fromEntries(lines.map((l) => [l.id, l.quantity]));
  });

  const categories = useMemo(
    () =>
      state.menu
        .map((c) => ({
          ...c,
          items: c.items.filter((i) => i.visible && i.delivery),
        }))
        .filter((c) => c.items.length > 0),
    [state.menu],
  );

  const allItems = useMemo(() => {
    const map: Record<string, MenuItem> = {};
    for (const c of categories) for (const i of c.items) map[i.id] = i;
    return map;
  }, [categories]);

  const inc = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const dec = (id: string) =>
    setCart((c) => {
      const n = (c[id] ?? 0) - 1;
      const next = { ...c };
      if (n <= 0) delete next[id];
      else next[id] = n;
      return next;
    });

  const cartEntries = Object.entries(cart)
    .map(([id, qty]) => ({ item: allItems[id], qty }))
    .filter((e) => e.item);

  const total = cartEntries.reduce((acc, { item, qty }) => acc + parsePrice(item.price) * qty, 0);

  useEffect(() => {
    const lines = cartEntries.map(({ item, qty }) => ({
      id: item.id,
      name: item.name,
      price: parsePrice(item.price),
      quantity: qty,
    }));
    cartStorage.write(lines);
  }, [cartEntries]);

  return (
    <div className="bg-background">
      <Navbar />
      <main>
        <section className="relative flex h-[55svh] min-h-[380px] items-center justify-center overflow-hidden bg-charcoal">
          <img
            src={heroImg}
            alt="Encomendas do Manjar do Ramos"
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <Reveal className="relative z-10 px-5 text-center">
            <span className="eyebrow text-gold">Delivery & Take-away</span>
            <h1 className="mt-5 font-serif text-5xl font-medium leading-tight text-cream md:text-7xl">
              Encomendas
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-cream/85 md:text-lg">
              Os sabores da taberna, agora entregues em sua casa.
            </p>
          </Reveal>
        </section>

        <section className="bg-background py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 md:px-10 lg:grid-cols-[1fr_360px]">
            <div className="space-y-14">
              {categories.length === 0 && (
                <p className="text-center text-muted-foreground">
                  Sem pratos disponíveis para entrega de momento.
                </p>
              )}
              {categories.map((cat) => (
                <Reveal key={cat.id}>
                  <h2 className="font-serif text-3xl text-espresso md:text-4xl">{cat.name}</h2>
                  <span className="mt-3 block h-0.5 w-12 bg-gold" />
                  <ul className="mt-8 space-y-5">
                    {cat.items.map((item) => {
                      const qty = cart[item.id] ?? 0;
                      return (
                        <li
                          key={item.id}
                          className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft sm:flex-row sm:items-center"
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-28 w-full flex-shrink-0 rounded-lg object-cover sm:h-24 sm:w-24"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-serif text-xl text-espresso">{item.name}</h3>
                            {item.description && (
                              <p className="mt-1 text-sm text-muted-foreground">
                                {item.description}
                              </p>
                            )}
                            <p className="mt-2 font-serif text-lg font-medium text-wine">
                              {item.price}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                            {qty === 0 ? (
                              <Button
                                onClick={() => inc(item.id)}
                                className="gap-2 bg-wine text-cream hover:bg-wine/90"
                              >
                                <Plus className="h-4 w-4" /> Adicionar
                              </Button>
                            ) : (
                              <div className="flex items-center gap-1 rounded-full border border-border bg-background p-1">
                                <button
                                  type="button"
                                  onClick={() => dec(item.id)}
                                  className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal hover:bg-secondary"
                                  aria-label="Remover um"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-6 text-center text-sm font-semibold text-charcoal">
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => inc(item.id)}
                                  className="flex h-8 w-8 items-center justify-center rounded-full bg-wine text-cream hover:bg-wine/90"
                                  aria-label="Adicionar um"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </Reveal>
              ))}
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-2 text-espresso">
                  <ShoppingBag className="h-5 w-5 text-wine" />
                  <h2 className="font-serif text-xl">A sua encomenda</h2>
                </div>

                {cartEntries.length === 0 ? (
                  <p className="mt-4 text-sm text-muted-foreground">
                    O seu carrinho está vazio. Adicione pratos para começar.
                  </p>
                ) : (
                  <ul className="mt-4 divide-y divide-border">
                    {cartEntries.map(({ item, qty }) => (
                      <li key={item.id} className="flex items-center gap-3 py-3 text-sm">
                        <span className="w-6 text-center font-semibold text-wine">{qty}×</span>
                        <span className="flex-1 text-charcoal">{item.name}</span>
                        <span className="font-medium text-charcoal">
                          {formatEUR(parsePrice(item.price) * qty)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="font-serif text-2xl text-wine">{formatEUR(total)}</span>
                </div>

                <Button
                  disabled={cartEntries.length === 0}
                  className="mt-5 w-full gap-2 bg-wine text-cream hover:bg-wine/90"
                  onClick={() => navigate({ to: "/checkout" })}
                >
                  <Truck className="h-4 w-4" /> Ir para checkout
                </Button>

                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Entrega na Grande Lisboa · 30 a 45 min
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
