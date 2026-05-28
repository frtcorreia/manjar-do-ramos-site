import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ */
/*  Tipos                                                              */
/* ------------------------------------------------------------------ */

export type BlockKey =
  | "hero"
  | "about"
  | "specialties"
  | "gallery"
  | "testimonials"
  | "reservation";

export type Block = {
  key: BlockKey;
  label: string;
  description: string;
  visible: boolean;
};

export type Page = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  inNav: boolean;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  visible: boolean;
};

export type MenuCategory = {
  id: string;
  name: string;
  items: MenuItem[];
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  context: string;
  visible: boolean;
};

export type GalleryImage = {
  id: string;
  url: string;
  caption: string;
  visible: boolean;
};

export type AdminState = {
  blocks: Block[];
  pages: Page[];
  menu: MenuCategory[];
  testimonials: Testimonial[];
  gallery: GalleryImage[];
};

/* ------------------------------------------------------------------ */
/*  Dados iniciais (mock)                                              */
/* ------------------------------------------------------------------ */

const uid = () => Math.random().toString(36).slice(2, 10);

const initialState: AdminState = {
  blocks: [
    { key: "hero", label: "Hero", description: "Imagem principal e chamada de ação.", visible: true },
    { key: "about", label: "Conceito", description: "Secção sobre a taberna.", visible: true },
    { key: "specialties", label: "Especialidades", description: "Cards dos pratos da casa.", visible: true },
    { key: "gallery", label: "Espaço", description: "Galeria do ambiente.", visible: true },
    { key: "testimonials", label: "Testemunhos", description: "Avaliações de clientes.", visible: true },
    { key: "reservation", label: "Reservas", description: "Formulário de reserva de mesa.", visible: true },
  ],
  pages: [
    { id: uid(), title: "Início", slug: "/", published: true, inNav: true },
    { id: uid(), title: "Ementa", slug: "/ementa", published: true, inNav: true },
    { id: uid(), title: "Catering", slug: "/catering", published: true, inNav: true },
  ],
  menu: [
    {
      id: uid(),
      name: "Petiscos",
      items: [
        { id: uid(), name: "Gambas à Guilho", description: "Alho, malagueta e coentros.", price: "12,50€", visible: true },
        { id: uid(), name: "Croquetes de Vitela", description: "Estaladiços, com mostarda da casa.", price: "8,00€", visible: true },
      ],
    },
    {
      id: uid(),
      name: "Carnes Maturadas",
      items: [
        { id: uid(), name: "Bife do Lombo (300g)", description: "Maturado 30 dias, na brasa.", price: "24,00€", visible: true },
        { id: uid(), name: "Picanha à Taberna", description: "Sal grosso e legumes assados.", price: "21,00€", visible: true },
      ],
    },
  ],
  testimonials: [
    {
      id: uid(),
      quote: "Fomos jantar a dois e saímos a planear a próxima visita. A carne na brasa é das melhores que provei em Lisboa.",
      name: "Inês Carvalho",
      context: "Jantar romântico",
      visible: true,
    },
    {
      id: uid(),
      quote: "Levei o grupo todo do trabalho. As tábuas de partilha foram um sucesso e o ambiente é acolhedor.",
      name: "Tiago Mendes",
      context: "Jantar de grupo",
      visible: true,
    },
  ],
  gallery: [],
};

/* ------------------------------------------------------------------ */
/*  Contexto                                                           */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "manjar-admin-state-v1";

type AdminContextValue = {
  state: AdminState;
  setState: React.Dispatch<React.SetStateAction<AdminState>>;
  reset: () => void;
  newId: () => string;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminState>(initialState);

  // hidratar do localStorage no cliente
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const reset = useCallback(() => {
    setState(initialState);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <AdminContext.Provider value={{ state, setState, reset, newId: uid }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin deve ser usado dentro de <AdminProvider>");
  return ctx;
}