import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cartStorage, formatEUR, type CartLine } from "@/lib/cart";
import { ShoppingBag, Truck } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout · Manjar do Ramos" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CheckoutPage,
});

const schema = z.object({
  customer_name: z.string().trim().min(1, "Indique o nome").max(120),
  phone: z.string().trim().min(6, "Telefone inválido").max(30),
  address: z.string().trim().min(5, "Indique a morada").max(300),
  nif: z.string().trim().max(20).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

function CheckoutPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    address: "",
    nif: "",
    notes: "",
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setCart(cartStorage.read());
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("name, phone, nif, address, notes")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setForm((f) => ({
            customer_name: data.name || f.customer_name,
            phone: data.phone || f.phone,
            address: data.address || f.address,
            nif: data.nif || f.nif,
            notes: f.notes,
          }));
        }
      });
  }, [user]);

  const total = cart.reduce((acc, l) => acc + l.price * l.quantity, 0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate({ to: "/auth", search: { redirect: "/checkout" } as never });
      return;
    }
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    if (cart.length === 0) return toast.error("Carrinho vazio.");

    setBusy(true);
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total,
        customer_name: parsed.data.customer_name,
        phone: parsed.data.phone,
        address: parsed.data.address,
        nif: parsed.data.nif || "",
        notes: parsed.data.notes || "",
      })
      .select("id")
      .single();

    if (error || !order) {
      setBusy(false);
      toast.error(error?.message || "Não foi possível criar a encomenda.");
      return;
    }

    const { error: itemsErr } = await supabase.from("order_items").insert(
      cart.map((l) => ({
        order_id: order.id,
        name: l.name,
        price: l.price,
        quantity: l.quantity,
      })),
    );
    // Also persist preferences back to profile
    await supabase.from("profiles").upsert({
      id: user.id,
      name: parsed.data.customer_name,
      phone: parsed.data.phone,
      address: parsed.data.address,
      nif: parsed.data.nif || "",
    });

    setBusy(false);
    if (itemsErr) {
      toast.error(itemsErr.message);
      return;
    }
    cartStorage.clear();
    toast.success("Encomenda enviada!");
    navigate({ to: "/minhas-encomendas" });
  };

  return (
    <div className="bg-background">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-6xl px-5 md:px-10">
          <h1 className="font-serif text-4xl text-espresso md:text-5xl">Checkout</h1>
          <p className="mt-2 text-muted-foreground">
            Confirme os dados para finalizar a encomenda.
          </p>

          {cart.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-border bg-card p-10 text-center">
              <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">O seu carrinho está vazio.</p>
              <Button asChild className="mt-6 bg-wine text-cream hover:bg-wine/90">
                <Link to="/encomendas">Ver pratos</Link>
              </Button>
            </div>
          ) : !loading && !user ? (
            <div className="mt-10 rounded-2xl border border-border bg-card p-8 text-center">
              <h2 className="font-serif text-2xl text-espresso">É necessário ter conta</h2>
              <p className="mt-2 text-muted-foreground">
                Crie conta ou inicie sessão para finalizar a encomenda.
              </p>
              <Button asChild className="mt-5 bg-wine text-cream hover:bg-wine/90">
                <Link to="/auth" search={{ redirect: "/checkout" } as never}>
                  Entrar / Criar conta
                </Link>
              </Button>
            </div>
          ) : (
            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
              <form onSubmit={submit} className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Nome" id="co-name" value={form.customer_name} onChange={(v) => setForm({ ...form, customer_name: v })} required />
                  <Field label="Telefone" id="co-phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required type="tel" />
                </div>
                <Field label="Morada de entrega" id="co-address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} required />
                <Field label="NIF (opcional)" id="co-nif" value={form.nif} onChange={(v) => setForm({ ...form, nif: v })} />
                <div className="space-y-2">
                  <Label htmlFor="co-notes">Observações (opcional)</Label>
                  <Textarea
                    id="co-notes"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Ex.: campainha avariada, sem coentros, etc."
                    rows={4}
                  />
                </div>
                <Button type="submit" disabled={busy} className="w-full gap-2 bg-wine text-cream hover:bg-wine/90">
                  <Truck className="h-4 w-4" />
                  {busy ? "A enviar…" : `Confirmar encomenda · ${formatEUR(total)}`}
                </Button>
              </form>

              <aside className="lg:sticky lg:top-28 lg:self-start">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <h2 className="font-serif text-xl text-espresso">Resumo</h2>
                  <ul className="mt-4 divide-y divide-border">
                    {cart.map((l) => (
                      <li key={l.id} className="flex items-center gap-3 py-3 text-sm">
                        <span className="w-6 text-center font-semibold text-wine">{l.quantity}×</span>
                        <span className="flex-1 text-charcoal">{l.name}</span>
                        <span className="font-medium text-charcoal">{formatEUR(l.price * l.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-serif text-2xl text-wine">{formatEUR(total)}</span>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({
  label, id, value, onChange, required, type = "text",
}: {
  label: string; id: string; value: string; onChange: (v: string) => void;
  required?: boolean; type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} />
    </div>
  );
}