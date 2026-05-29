import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
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

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Backoffice · Manjar do Ramos" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type SectionId = "overview" | "blocks" | "pages" | "menu" | "wines" | "testimonials" | "content";

const nav: { id: SectionId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
  { id: "blocks", label: "Blocos", icon: ToggleLeft },
  { id: "pages", label: "Páginas", icon: FileText },
  { id: "menu", label: "Ementa", icon: UtensilsCrossed },
  { id: "wines", label: "Carta de Vinhos", icon: Wine },
  { id: "testimonials", label: "Testemunhos", icon: MessageSquareQuote },
  { id: "content", label: "Conteúdo & Imagens", icon: Images },
];

function AdminPage() {
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
          {active === "blocks" && <BlocksSection />}
          {active === "pages" && <PagesSection />}
          {active === "menu" && <MenuSection />}
          {active === "wines" && <WinesSection />}
          {active === "testimonials" && <TestimonialsSection />}
          {active === "content" && <ContentSection />}
        </main>
      </div>
    </div>
  );
}
