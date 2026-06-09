import { useState, useRef } from "react";
import { useAdmin, type PageContent, type ContentField, type ContentImage } from "@/lib/admin-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ImagePlus } from "lucide-react";

export function PagesSection() {
  const { state, setState } = useAdmin();
  const [activeKey, setActiveKey] = useState<PageContent["key"]>(state.pages[0]?.key ?? "index");
  const active = state.pages.find((p) => p.key === activeKey) ?? state.pages[0];

  const updateField = (pageKey: PageContent["key"], fieldId: string, value: string) =>
    setState((s) => ({
      ...s,
      pages: s.pages.map((p) =>
        p.key === pageKey
          ? { ...p, fields: p.fields.map((f) => (f.id === fieldId ? { ...f, value } : f)) }
          : p,
      ),
    }));

  const updateImage = (pageKey: PageContent["key"], imageId: string, url: string) =>
    setState((s) => ({
      ...s,
      pages: s.pages.map((p) =>
        p.key === pageKey
          ? { ...p, images: p.images.map((i) => (i.id === imageId ? { ...i, url } : i)) }
          : p,
      ),
    }));

  const toggleBlock = (key: string, visible: boolean) =>
    setState((s) => ({
      ...s,
      blocks: s.blocks.map((b) => (b.key === key ? { ...b, visible } : b)),
    }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-charcoal">Páginas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edite os conteúdos e imagens das páginas existentes do site.
        </p>
      </header>

      {/* Seletor de página */}
      <div className="flex flex-wrap gap-2">
        {state.pages.map((p) => (
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

      {active && <PageEditor page={active} onField={updateField} onImage={updateImage} />}

      {active?.key === "index" && (
        <section className="space-y-4">
          <div>
            <h2 className="font-serif text-xl text-charcoal">Visibilidade dos Blocos</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ative ou desative secções da página inicial.
            </p>
          </div>
          <div className="divide-y divide-border rounded-xl border border-border bg-card">
            {state.blocks.map((b) => (
              <div key={b.key} className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-medium text-charcoal">{b.label}</p>
                  <p className="text-sm text-muted-foreground">{b.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold ${b.visible ? "text-green-600" : "text-muted-foreground"}`}>
                    {b.visible ? "Visível" : "Oculto"}
                  </span>
                  <Switch checked={b.visible} onCheckedChange={(v) => toggleBlock(b.key, v)} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function PageEditor({
  page,
  onField,
  onImage,
}: {
  page: PageContent;
  onField: (pageKey: PageContent["key"], fieldId: string, value: string) => void;
  onImage: (pageKey: PageContent["key"], imageId: string, url: string) => void;
}) {
  // Separar SEO, textos e imagens para organização visual
  const seoFields = page.fields.filter((f) =>
    f.label.includes("SEO") || f.label.includes("OG")
  );
  const otherFields = page.fields.filter(
    (f) => !f.label.includes("SEO") && !f.label.includes("OG"),
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* SEO */}
      {seoFields.length > 0 && (
        <section className="space-y-4 rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <h2 className="font-serif text-lg text-charcoal">SEO & Redes Sociais</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {seoFields.map((f) => (
              <FieldEditor key={f.id} field={f} pageKey={page.key} onField={onField} />
            ))}
          </div>
        </section>
      )}

      {/* Textos */}
      {otherFields.length > 0 && (
        <section className="space-y-4 rounded-xl border border-border bg-card p-5">
          <h2 className="font-serif text-lg text-charcoal">Textos</h2>
          <div className="space-y-4">
            {otherFields.map((f) => (
              <FieldEditor key={f.id} field={f} pageKey={page.key} onField={onField} />
            ))}
          </div>
        </section>
      )}

      {/* Imagens */}
      {page.images.length > 0 && (
        <section className="space-y-4 rounded-xl border border-border bg-card p-5">
          <h2 className="font-serif text-lg text-charcoal">Imagens</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {page.images.map((img) => (
              <ImageEditor key={img.id} image={img} pageKey={page.key} onImage={onImage} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function FieldEditor({
  field,
  pageKey,
  onField,
}: {
  field: ContentField;
  pageKey: PageContent["key"];
  onField: (pageKey: PageContent["key"], fieldId: string, value: string) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{field.label}</span>
      {field.multiline ? (
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

function ImageEditor({
  image,
  pageKey,
  onImage,
}: {
  image: ContentImage;
  pageKey: PageContent["key"];
  onImage: (pageKey: PageContent["key"], imageId: string, url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    onImage(pageKey, image.id, URL.createObjectURL(file));
  };

  return (
    <div className="space-y-2">
      <span className="text-xs font-medium text-muted-foreground">{image.label}</span>
      <button
        onClick={() => fileRef.current?.click()}
        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-muted"
      >
        {image.url ? (
          <img src={image.url} alt={image.label} className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full items-center justify-center text-xs text-muted-foreground">
            Sem imagem
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center gap-2 bg-charcoal/0 text-sm font-medium text-cream opacity-0 transition-all group-hover:bg-charcoal/55 group-hover:opacity-100">
          <ImagePlus className="h-4 w-4" /> Substituir
        </span>
      </button>
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => fileRef.current?.click()}
      >
        Carregar imagem
      </Button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
    </div>
  );
}
