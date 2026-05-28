import { useRef } from "react";
import { useAdmin, type GalleryImage } from "@/lib/admin-store";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, ImagePlus } from "lucide-react";

export function GallerySection() {
  const { state, setState, newId } = useAdmin();
  const fileRef = useRef<HTMLInputElement>(null);

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const additions: GalleryImage[] = Array.from(files).map((f) => ({
      id: newId(),
      url: URL.createObjectURL(f),
      caption: f.name.replace(/\.[^.]+$/, ""),
      visible: true,
    }));
    setState((s) => ({ ...s, gallery: [...s.gallery, ...additions] }));
  };

  const update = (id: string, patch: Partial<GalleryImage>) =>
    setState((s) => ({
      ...s,
      gallery: s.gallery.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    }));

  const remove = (id: string) =>
    setState((s) => ({ ...s, gallery: s.gallery.filter((g) => g.id !== id) }));

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Imagens</h1>
          <p className="mt-1 text-sm text-muted-foreground">Carregue e gira as imagens do site.</p>
        </div>
        <Button onClick={() => fileRef.current?.click()} className="gap-2">
          <Upload className="h-4 w-4" /> Carregar imagens
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
      </header>

      {state.gallery.length === 0 ? (
        <button
          onClick={() => fileRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-card py-16 text-muted-foreground transition-colors hover:border-gold hover:text-charcoal"
        >
          <ImagePlus className="h-10 w-10" />
          <span className="text-sm">Clique para carregar as suas imagens</span>
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {state.gallery.map((g) => (
            <div key={g.id} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="relative aspect-[4/3] bg-muted">
                <img src={g.url} alt={g.caption} className="h-full w-full object-cover" />
                {!g.visible && (
                  <div className="absolute inset-0 flex items-center justify-center bg-charcoal/60 text-xs font-semibold uppercase tracking-wide text-cream">
                    Oculto
                  </div>
                )}
              </div>
              <div className="space-y-2 p-3">
                <Input
                  value={g.caption}
                  onChange={(e) => update(g.id, { caption: e.target.value })}
                  className="h-8"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch checked={g.visible} onCheckedChange={(v) => update(g.id, { visible: v })} />
                    <span className="text-xs text-muted-foreground">{g.visible ? "Visível" : "Oculto"}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => remove(g.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}