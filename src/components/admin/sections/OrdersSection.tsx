import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatEUR, ORDER_STATUS_LABEL, ORDER_STATUS_ORDER, type OrderStatus } from "@/lib/cart";

type OrderRow = {
  id: string;
  user_id: string;
  status: OrderStatus;
  total: number;
  customer_name: string;
  phone: string;
  address: string;
  nif: string;
  notes: string;
  created_at: string;
  order_items: { id: string; name: string; price: number; quantity: number }[];
};

const statusColor: Record<OrderStatus, string> = {
  pendente: "bg-amber-100 text-amber-900",
  em_preparacao: "bg-blue-100 text-blue-900",
  pronto: "bg-emerald-100 text-emerald-900",
  entregue: "bg-stone-200 text-stone-700",
};

export function OrdersSection() {
  const { user, isAdmin, loading } = useAuth();
  const [orders, setOrders] = useState<OrderRow[] | null>(null);

  const load = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id, user_id, status, total, customer_name, phone, address, nif, notes, created_at, order_items(id,name,price,quantity)",
      )
      .order("created_at", { ascending: false });
    if (error) {
      toast.error(error.message);
      setOrders([]);
      return;
    }
    setOrders((data as OrderRow[]) ?? []);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setOrders((prev) => prev?.map((o) => (o.id === id ? { ...o, status } : o)) ?? null);
    toast.success("Estado atualizado.");
  };

  if (loading) return <p className="text-muted-foreground">A carregar…</p>;

  if (!user) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl text-espresso">Encomendas</h2>
        <p className="mt-2 text-muted-foreground">
          Inicie sessão como administrador para gerir as encomendas.{" "}
          <a className="text-wine underline" href="/auth?redirect=/admin">
            Entrar
          </a>
        </p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl text-espresso">Encomendas</h2>
        <p className="mt-2 text-muted-foreground">
          A sua conta ({user.email}) não tem permissões de administrador.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Para conceder permissões a esta conta, adicione uma linha na tabela{" "}
          <code>user_roles</code> com <code>user_id = {user.id}</code> e <code>role = 'admin'</code>{" "}
          através da Lovable Cloud.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-3xl text-espresso">Encomendas</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Acompanhe e atualize o estado das encomendas recebidas.
        </p>
      </div>

      {orders === null ? (
        <p className="text-muted-foreground">A carregar…</p>
      ) : orders.length === 0 ? (
        <p className="text-muted-foreground">Sem encomendas até ao momento.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li key={o.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    #{o.id.slice(0, 8)} · {new Date(o.created_at).toLocaleString("pt-PT")}
                  </p>
                  <p className="mt-1 font-serif text-xl text-espresso">{o.customer_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {o.phone} · {o.address}
                  </p>
                  {o.nif && <p className="text-sm text-muted-foreground">NIF: {o.nif}</p>}
                  {o.notes && (
                    <p className="mt-2 text-sm italic text-muted-foreground">“{o.notes}”</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={`${statusColor[o.status]} border-none`}>
                    {ORDER_STATUS_LABEL[o.status]}
                  </Badge>
                  <p className="font-serif text-xl text-wine">{formatEUR(Number(o.total))}</p>
                  <Select
                    value={o.status}
                    onValueChange={(v) => updateStatus(o.id, v as OrderStatus)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUS_ORDER.map((s) => (
                        <SelectItem key={s} value={s}>
                          {ORDER_STATUS_LABEL[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <ul className="mt-3 divide-y divide-border border-t border-border pt-2 text-sm">
                {o.order_items.map((i) => (
                  <li key={i.id} className="flex justify-between py-1.5">
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
  );
}
