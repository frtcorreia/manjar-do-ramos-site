import { useState } from "react";
import { useAdmin, type PageContent, type PageKey } from "@/lib/admin-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const SEO_LABELS = ["Título (SEO)", "Descrição (SEO)", "OG Título", "OG Descrição"] as const;

const LIMITS: Record<string, number> = {
  "Título (SEO)": 60,
  "Descrição (SEO)": 160,
  "OG Título": 60,
  "OG Descrição": 160,
};

const PAGE_ROUTES: Record<PageKey, string> = {
  index: "/",
  ementa: "/ementa",
  encomendas: "/encomendas",
  catering: "/catering",
};

export function SEOSection() {
  const { state, setState } = useAdmin();
  const seoPages = state.pages.filter((p) => SEO_LABELS.every((l) => p.fields.some((f) => f.label === l)));
  const [activeKey, setActiveKey] = useState<PageKey>(seoPages[0]?.key ?? "index");
  const active = seoPages.find((p) => p.key === activeKey) ?? seoPages[0];

  const updateField = (pageKey: PageKey, fieldId: string, value: string) =>
    setState((s) => ({
      ...s,
      pages: s.pages.map((p) =>
        p.key === pageKey
          ? { ...p, fields: p.fields.map((f) => (f.id === fieldId ? { ...f, value } : f)) }
          : p,
      ),
    }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-charcoal">SEO</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Título, descrição e partilha nas redes sociais de cada página pública. Estas são as
          únicas otimizações de SEO que pode fazer diretamente no site.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {seoPages.map((p) => (
          <button
            key={p.key}
            onClick={() => setActiveKey(p.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              p.key === active?.key
                ? "bg-charcoal text-cream"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {active && <PageSeoEditor page={active} onField={updateField} />}
    </div>
  );
}

function PageSeoEditor({
  page,
  onField,
}: {
  page: PageContent;
  onField: (pageKey: PageKey, fieldId: string, value: string) => void;
}) {
  const titleField = page.fields.find((f) => f.label === "Título (SEO)");
  const descField = page.fields.find((f) => f.label === "Descrição (SEO)");
  const ogTitleField = page.fields.find((f) => f.label === "OG Título");
  const ogDescField = page.fields.find((f) => f.label === "OG Descrição");

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="space-y-4 rounded-xl border border-border bg-card p-5">
        <h2 className="font-serif text-lg text-charcoal">Motores de Pesquisa</h2>
        <p className="text-xs text-muted-foreground">
          Título e descrição mostrados no Google e outros motores de pesquisa.
        </p>
        {titleField && (
          <SeoField field={titleField} pageKey={page.key} onField={onField} />
        )}
        {descField && (
          <SeoField field={descField} pageKey={page.key} onField={onField} multiline />
        )}
        {(titleField || descField) && (
          <SerpPreview
            url={`manjardoramos.pt${PAGE_ROUTES[page.key] === "/" ? "" : PAGE_ROUTES[page.key]}`}
            title={titleField?.value ?? ""}
            description={descField?.value ?? ""}
          />
        )}
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-5">
        <h2 className="font-serif text-lg text-charcoal">Redes Sociais (Open Graph)</h2>
        <p className="text-xs text-muted-foreground">
          Título e descrição mostrados ao partilhar a página no Facebook, WhatsApp, LinkedIn, etc.
        </p>
        {ogTitleField && (
          <SeoField field={ogTitleField} pageKey={page.key} onField={onField} />
        )}
        {ogDescField && (
          <SeoField field={ogDescField} pageKey={page.key} onField={onField} multiline />
        )}
      </section>
    </div>
  );
}

function SeoField({
  field,
  pageKey,
  onField,
  multiline,
}: {
  field: { id: string; label: string; value: string };
  pageKey: PageKey;
  onField: (pageKey: PageKey, fieldId: string, value: string) => void;
  multiline?: boolean;
}) {
  const limit = LIMITS[field.label];
  const over = limit != null && field.value.length > limit;

  return (
    <label className="block space-y-1.5">
      <span className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        {field.label}
        {limit != null && (
          <span className={over ? "text-destructive" : ""}>
            {field.value.length}/{limit}
          </span>
        )}
      </span>
      {multiline ? (
        <Textarea
          value={field.value}
          rows={3}
          onChange={(e) => onField(pageKey, field.id, e.target.value)}
        />
      ) : (
        <Input value={field.value} onChange={(e) => onField(pageKey, field.id, e.target.value)} />
      )}
    </label>
  );
}

function SerpPreview({ url, title, description }: { url: string; description: string; title: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="truncate text-xs text-muted-foreground">{url}</p>
      <p className="mt-0.5 truncate text-base text-[#1a0dab]">{title}</p>
      <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
