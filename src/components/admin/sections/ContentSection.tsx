import { useRef, useState } from "react";
import {
  useAdmin,
  type BlockContent,
  type ContentField,
  type ContentImage,
} from "@/lib/admin-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";

export function ContentSection() {
  const { state, setState } = useAdmin();
  const [activeKey, setActiveKey] = useState(state.content[0]?.key ?? "hero");
  const active = state.content.find((b) => b.key === activeKey) ?? state.content[0];

  const updateBackgroundColor = (blockKey: string, color: string) =>
    setState((s) => ({
      ...s,
      content: s.content.map((b) =>
        b.key === blockKey ? { ...b, backgroundColor: color } : b,
      ),
    }));

  const updateField = (blockKey: string, fieldId: string, value: string) =>
    setState((s) => ({
      ...s,
      content: s.content.map((b) =>
        b.key === blockKey
          ? { ...b, fields: b.fields.map((f) => (f.id === fieldId ? { ...f, value } : f)) }
          : b,
      ),
    }));

  const updateImage = (blockKey: string, imageId: string, url: string) =>
    patchImage(blockKey, imageId, { url });

  const patchImage = (blockKey: string, imageId: string, patch: Partial<ContentImage>) =>
    setState((s) => ({
      ...s,
      content: s.content.map((b) =>
        b.key === blockKey
          ? { ...b, images: b.images.map((i) => (i.id === imageId ? { ...i, ...patch } : i)) }
          : b,
      ),
    }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-charcoal">Conteúdo &amp; Imagens</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edite os textos e as imagens de cada bloco do site.
        </p>
      </header>

      {/* Seletor de bloco */}
      <div className="flex flex-wrap gap-2">
        {state.content.map((b) => (
          <button
            key={b.key}
            onClick={() => setActiveKey(b.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              b.key === active?.key
                ? "bg-charcoal text-cream"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      {active && (
        <BlockEditor
          block={active}
          onField={updateField}
          onImage={updateImage}
          onImageMeta={patchImage}
          onBackgroundColor={updateBackgroundColor}
        />
      )}
    </div>
  );
}

function BlockEditor({
  block,
  onField,
  onImage,
  onImageMeta,
  onBackgroundColor,
}: {
  block: BlockContent;
  onField: (blockKey: string, fieldId: string, value: string) => void;
  onImage: (blockKey: string, imageId: string, url: string) => void;
  onImageMeta: (blockKey: string, imageId: string, patch: Partial<ContentImage>) => void;
  onBackgroundColor: (blockKey: string, color: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Cor de fundo */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-serif text-lg text-charcoal mb-4">Cor de fundo</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="color"
              value={block.backgroundColor || "#ffffff"}
              onChange={(e) => onBackgroundColor(block.key, e.target.value)}
              className="h-10 w-20 cursor-pointer rounded-lg border border-border bg-transparent p-1"
              title="Escolher cor de fundo"
            />
          </div>
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-md border border-border shadow-sm"
              style={{ backgroundColor: block.backgroundColor || "#ffffff" }}
            />
            <span className="text-sm text-muted-foreground font-mono">
              {block.backgroundColor || "#ffffff"}
            </span>
          </div>
          {block.backgroundColor && (
            <button
              onClick={() => onBackgroundColor(block.key, "")}
              className="text-xs text-muted-foreground underline hover:text-charcoal"
            >
              Repor padrão
            </button>
          )}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Textos */}
        {block.fields.length > 0 && (
          <section className="space-y-4 rounded-xl border border-border bg-card p-5">
            <h2 className="font-serif text-lg text-charcoal">Textos</h2>
            {block.fields.map((f) => (
              <FieldEditor key={f.id} field={f} blockKey={block.key} onField={onField} />
            ))}
          </section>
        )}

        {/* Imagens */}
        {block.images.length > 0 && (
          <section className="space-y-4 rounded-xl border border-border bg-card p-5">
            <h2 className="font-serif text-lg text-charcoal">Imagens</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {block.images.map((img) => (
                <ImageEditor
                  key={img.id}
                  image={img}
                  blockKey={block.key}
                  onImage={onImage}
                  onImageMeta={onImageMeta}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function FieldEditor({
  field,
  blockKey,
  onField,
}: {
  field: ContentField;
  blockKey: string;
  onField: (blockKey: string, fieldId: string, value: string) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{field.label}</span>
      {field.multiline ? (
        <Textarea
          value={field.value}
          rows={3}
          onChange={(e) => onField(blockKey, field.id, e.target.value)}
        />
      ) : (
        <Input value={field.value} onChange={(e) => onField(blockKey, field.id, e.target.value)} />
      )}
    </label>
  );
}

function ImageEditor({
  image,
  blockKey,
  onImage,
  onImageMeta,
}: {
  image: ContentImage;
  blockKey: string;
  onImage: (blockKey: string, imageId: string, url: string) => void;
  onImageMeta: (blockKey: string, imageId: string, patch: Partial<ContentImage>) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    onImage(blockKey, image.id, URL.createObjectURL(file));
  };

  const hasMeta = image.title !== undefined || image.description !== undefined;

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
      {hasMeta && (
        <div className="space-y-2 pt-1">
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Título</span>
            <Input
              value={image.title ?? ""}
              onChange={(e) => onImageMeta(blockKey, image.id, { title: e.target.value })}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Descrição</span>
            <Textarea
              rows={2}
              value={image.description ?? ""}
              onChange={(e) => onImageMeta(blockKey, image.id, { description: e.target.value })}
            />
          </label>
        </div>
      )}
    </div>
  );
}
