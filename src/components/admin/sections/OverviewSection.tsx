import { useAdmin } from "@/lib/admin-store";
import { LayoutGrid, FileText, UtensilsCrossed, MessageSquareQuote, Images } from "lucide-react";

export function OverviewSection() {
  const { state } = useAdmin();

  const dishes = state.menu.reduce((acc, c) => acc + c.items.length, 0);
  const images = state.content.reduce((acc, b) => acc + b.images.length, 0);
  const stats = [
    { label: "Blocos visíveis", value: `${state.blocks.filter((b) => b.visible).length}/${state.blocks.length}`, icon: LayoutGrid },
    { label: "Páginas publicadas", value: `${state.pages.filter((p) => p.published).length}/${state.pages.length}`, icon: FileText },
    { label: "Pratos na ementa", value: dishes, icon: UtensilsCrossed },
    { label: "Testemunhos ativos", value: state.testimonials.filter((t) => t.visible).length, icon: MessageSquareQuote },
    { label: "Imagens", value: images, icon: Images },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-charcoal">Visão Geral</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumo dos conteúdos do Manjar do Ramos.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/15 text-gold">
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-serif text-2xl text-charcoal">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-dashed border-border bg-card/60 p-5 text-sm text-muted-foreground">
        Protótipo de validação — as alterações ficam guardadas apenas neste navegador
        (localStorage). Ainda não estão ligadas a um backend.
      </div>
    </div>
  );
}