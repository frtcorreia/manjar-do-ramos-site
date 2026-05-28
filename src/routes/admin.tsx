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
} from "lucide-react";
import logo from "@/assets/logo-cream.png";
import { AdminProvider, useAdmin } from "@/lib/admin-store";
import { OverviewSection } from "@/components/admin/sections/OverviewSection";
import { BlocksSection } from "@/components/admin/sections/BlocksSection";
import { PagesSection } from "@/components/admin/sections/PagesSection";
import { MenuSection } from "@/components/admin/sections/MenuSection";
import { TestimonialsSection } from "@/components/admin/sections/TestimonialsSection";
import { GallerySection } from "@/components/admin/sections/GallerySection";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Backoffice · Manjar do Ramos" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type SectionId = "overview" | "blocks" | "pages" | "menu" | "testimonials" | "gallery";

const nav: { id: SectionId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
  { id: "blocks", label: "Blocos", icon: ToggleLeft },
  { id: "pages", label: "Páginas", icon: FileText },
  { id: "menu", label: "Ementa", icon: UtensilsCrossed },
  { id: "testimonials", label: "Testemunhos", icon: MessageSquareQuote },
  { id: "gallery", label: "Imagens", icon: Images },
];

function AdminPage() {
  return (
    <AdminProvider>
      <AdminShell />
    </AdminProvider>
  );
}

function AdminShell() {
  const [active, setActive] = useState<SectionId>("overview");
  const { reset } = useAdmin();

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-col bg-charcoal px-4 py-6 md:flex">
        <Link to="/" className="px-2">
          <img src={logo} alt="Manjar do Ramos" className="h-12 w-auto" />
        </Link>
        <p className="mt-1 px-2 text-xs uppercase tracking-[0.3em] text-cream/40">Backoffice</p>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => setActive(n.id)}
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
      </aside>

      {/* Mobile top nav */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2 overflow-x-auto bg-charcoal px-4 py-3 md:hidden">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => setActive(n.id)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs ${
                active === n.id ? "bg-gold text-charcoal font-semibold" : "text-cream/70"
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>

        <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 md:px-10">
          {active === "overview" && <OverviewSection />}
          {active === "blocks" && <BlocksSection />}
          {active === "pages" && <PagesSection />}
          {active === "menu" && <MenuSection />}
          {active === "testimonials" && <TestimonialsSection />}
          {active === "gallery" && <GallerySection />}
        </main>
      </div>
    </div>
  );
}