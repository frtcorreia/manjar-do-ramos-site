import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LayoutDashboard,
  ToggleLeft,
  FileText,
  UtensilsCrossed,
  MessageSquareQuote,
  Images,
  RotateCcw,
  ExternalLink,
  Menu,
  Wine,
  ShoppingBag,
  Store,
  Navigation,
} from "lucide-react";
import logo from "@/assets/logo-cream.png";
import { AdminProvider, useAdmin } from "@/lib/admin-store";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { OverviewSection } from "@/components/admin/sections/OverviewSection";
import { BlocksSection } from "@/components/admin/sections/BlocksSection";
import { PagesSection } from "@/components/admin/sections/PagesSection";
import { MenuSection } from "@/components/admin/sections/MenuSection";
import { TestimonialsSection } from "@/components/admin/sections/TestimonialsSection";
import { ContentSection } from "@/components/admin/sections/ContentSection";
import { WinesSection } from "@/components/admin/sections/WinesSection";
import { OrdersSection } from "@/components/admin/sections/OrdersSection";
import { RestauranteSection } from "@/components/admin/sections/RestauranteSection";
import { NavegacaoSection } from "@/components/admin/sections/NavegacaoSection";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Backoffice · Manjar do Ramos" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type SectionId =
  | "overview"
  | "blocks"
  | "pages"
  | "menu"
  | "wines"
  | "orders"
  | "testimonials"
  | "content"
  | "restaurante"
  | "navegacao";

const nav: { id: SectionId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
  { id: "restaurante", label: "Restaurante", icon: Store },
  { id: "navegacao", label: "Navegação & Site", icon: Navigation },
  { id: "blocks", label: "Blocos", icon: ToggleLeft },
  { id: "pages", label: "Páginas", icon: FileText },
  { id: "menu", label: "Ementa", icon: UtensilsCrossed },
  { id: "wines", label: "Carta de Vinhos", icon: Wine },
  { id: "orders", label: "Encomendas", icon: ShoppingBag },
  { id: "testimonials", label: "Testemunhos", icon: MessageSquareQuote },
  { id: "content", label: "Conteúdo & Imagens", icon: Images },
];

const emailSchema = z.string().trim().email("Email inválido");
const passwordSchema = z.string().min(1, "Introduza a palavra-passe");

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ep = emailSchema.safeParse(email);
    const pp = passwordSchema.safeParse(password);
    if (!ep.success) return toast.error(ep.error.issues[0].message);
    if (!pp.success) return toast.error(pp.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: ep.data, password: pp.data });
    setBusy(false);
    if (error) toast.error("Credenciais inválidas.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <img src={logo} alt="Manjar do Ramos" className="mx-auto h-16 w-auto" />
          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-cream/40">Backoffice</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email" className="text-cream/80">Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="border-cream/20 bg-cream/5 text-cream placeholder:text-cream/30 focus-visible:ring-gold"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password" className="text-cream/80">Palavra-passe</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="border-cream/20 bg-cream/5 text-cream placeholder:text-cream/30 focus-visible:ring-gold"
            />
          </div>
          <Button type="submit" disabled={busy} className="w-full bg-gold text-charcoal hover:bg-gold/90 font-semibold">
            {busy ? "A entrar…" : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function AdminPage() {
  const { user, isAdmin, loading, signOut } = useAuth();
  if (loading) return null;
  if (!user) return <AdminLoginPage />;
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-charcoal text-cream">
        <img src={logo} alt="Manjar do Ramos" className="h-14 w-auto" />
        <p className="text-sm text-cream/60">Sem permissões de acesso.</p>
        <button onClick={() => signOut()} className="text-xs text-gold underline">
          Sair
        </button>
      </div>
    );
  }
  return (
    <AdminProvider>
      <AdminShell />
    </AdminProvider>
  );
}

function NavMenu({
  active,
  onSelect,
}: {
  active: SectionId;
  onSelect: (id: SectionId) => void;
}) {
  const { reset } = useAdmin();
  return (
    <div className="flex h-full flex-col px-4 py-6">
      <Link to="/" className="px-2">
        <img src={logo} alt="Manjar do Ramos" className="h-12 w-auto" />
      </Link>
      <p className="mt-1 px-2 text-xs uppercase tracking-[0.3em] text-cream/40">Backoffice</p>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {nav.map((n) => (
          <button
            key={n.id}
            onClick={() => onSelect(n.id)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              active === n.id
                ? "bg-gold text-charcoal font-semibold"
                : "text-cream/75 hover:bg-cream/10 hover:text-cream"
            }`}
          >
            <n.icon className="h-4 w-4" />
            {n.label}
          </button>
        ))}
      </nav>

      <div className="mt-4 flex flex-col gap-1 border-t border-cream/10 pt-4">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cream/75 transition-colors hover:bg-cream/10 hover:text-cream"
        >
          <ExternalLink className="h-4 w-4" /> Ver site
        </a>
        <button
          onClick={reset}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cream/75 transition-colors hover:bg-cream/10 hover:text-cream"
        >
          <RotateCcw className="h-4 w-4" /> Repor dados
        </button>
      </div>
    </div>
  );
}

function AdminShell() {
  const [active, setActive] = useState<SectionId>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  const select = (id: SectionId) => {
    setActive(id);
    setMobileOpen(false);
  };

  const activeLabel = nav.find((n) => n.id === active)?.label ?? "";

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar vertical (desktop) */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 bg-charcoal md:block">
        <NavMenu active={active} onSelect={select} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Barra superior mobile com menu vertical em drawer */}
        <div className="sticky top-0 z-20 flex items-center gap-3 bg-charcoal px-4 py-3 md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-lg text-cream hover:bg-cream/10"
                aria-label="Abrir menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-none bg-charcoal p-0 text-cream">
              <NavMenu active={active} onSelect={select} />
            </SheetContent>
          </Sheet>
          <span className="font-serif text-lg text-cream">{activeLabel}</span>
        </div>

        <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 md:px-10">
          {active === "overview" && <OverviewSection />}
          {active === "restaurante" && <RestauranteSection />}
          {active === "navegacao" && <NavegacaoSection />}
          {active === "blocks" && <BlocksSection />}
          {active === "pages" && <PagesSection />}
          {active === "menu" && <MenuSection />}
          {active === "wines" && <WinesSection />}
          {active === "orders" && <OrdersSection />}
          {active === "testimonials" && <TestimonialsSection />}
          {active === "content" && <ContentSection />}
        </main>
      </div>
    </div>
  );
}
