export type CartLine = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const KEY = "manjar-cart-v1";

export const cartStorage = {
  read(): CartLine[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  write(lines: CartLine[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify(lines));
  },
  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(KEY);
  },
};

export const formatEUR = (n: number) =>
  new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n);

export const parsePrice = (p: string) => {
  const n = parseFloat(p.replace(/[^\d,.-]/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pendente: "Pendente",
  em_preparacao: "Em preparação",
  pronto: "Pronto",
  entregue: "Entregue",
};

export const ORDER_STATUS_ORDER = ["pendente", "em_preparacao", "pronto", "entregue"] as const;
export type OrderStatus = (typeof ORDER_STATUS_ORDER)[number];
