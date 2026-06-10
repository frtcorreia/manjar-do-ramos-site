import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { formatEUR, ORDER_STATUS_LABEL, type OrderStatus } from "@/lib/cart";
import { ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/minhas-encomendas")({
  head: () => ({
    meta: [
      { title: "As minhas encomendas · Manjar do Ramos" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: MinhasEncomendasPage,
});

type OrderRow = {
  id: string;
  status: OrderStatus;
  total: number;
  customer_name: string;
  address: string;
  created_at: string;
  order_items: { id: string; name: string; price: number; quantity: number }[];
};

const statusColor: Record<OrderStatus, string> = {
  pendente: "bg-amber-100 text-amber-900",
  em_preparacao: "bg-blue-100 text-blue-900",
  pronto: "bg-emerald-100 text-emerald-900",
  entregue: "bg-stone-200 text-stone-700",
};

function MinhasEncomendasPage() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRow[] | null>(null);

  useEffect(() => {
    if (!loading && !user)
      navigate({ to: "/auth", search: { redirect: "/minhas-encomendas" } as never });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select(
        "id, status, total, customer_name, address, created_at, order_items(id,name,price,quantity)",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data as OrderRow[]) ?? []));
  }, [user]);

  return (
    <div className="bg-background">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-5 md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl text-espresso md:text-5xl">
                As minhas encomendas
              </h1>
              <p className="mt-2 text-muted-foreground">{user?.email}</p>
            </div>
            {isAdmin && (
              <Button asChild variant="outline">
                <Link to="/admin">Ir para backoffice</Link>
              </Button>
            )}
          </div>

          {orders === null ? (
            <p className="mt-10 text-muted-foreground">A carregar…</p>
          ) : orders.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-border bg-card p-10 text-center">
              <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">Ainda não tem encomendas.</p>
              <Button asChild className="mt-6 bg-wine text-cream hover:bg-wine/90">
                <Link to="/encomendas">Ver pratos disponíveis</Link>
              </Button>
            </div>
          ) : (
            <ul className="mt-10 space-y-5">
              {orders.map((o) => (
                <li key={o.id} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        #{o.id.slice(0, 8)} · {new Date(o.created_at).toLocaleString("pt-PT")}
                      </p>
                      <p className="mt-1 font-serif text-xl text-espresso">{o.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{o.address}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={`${statusColor[o.status]} border-none`}>
                        {ORDER_STATUS_LABEL[o.status]}
                      </Badge>
                      <p className="mt-2 font-serif text-2xl text-wine">
                        {formatEUR(Number(o.total))}
                      </p>
                    </div>
                  </div>
                  <ul className="mt-4 divide-y divide-border border-t border-border pt-2 text-sm">
                    {o.order_items.map((i) => (
                      <li key={i.id} className="flex justify-between py-2">
                        <span>
                          {i.quantity}× {i.name}
                        </span>
                        <span className="text-muted-foreground">
                          {formatEUR(Number(i.price) * i.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
