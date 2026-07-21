import { useState, useRef } from "react";
import { uploadImage } from "@/lib/upload-image";
import {
  useAdmin,
  type PageContent,
  type ContentField,
  type ContentImage,
} from "@/lib/admin-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-charcoal">Páginas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edite os conteúdos e imagens das páginas existentes do site. Para título, descrição e
          partilha nas redes sociais, veja a secção "SEO".
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
  // Os campos de SEO/OG têm secção própria em "SEO" — aqui só se editam os restantes textos.
  const otherFields = page.fields.filter(
    (f) => !f.label.includes("SEO") && !f.label.includes("OG"),
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
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

  const [uploading, setUploading] = useState(false);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "pages");
      onImage(pageKey, image.id, url);
    } catch {
      alert("Erro ao carregar imagem. Verifique que o bucket 'site-assets' existe e é público.");
    } finally {
      setUploading(false);
    }
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
