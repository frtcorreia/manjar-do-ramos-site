import { useRef, useState } from "react";
import { useAdmin, WINE_REGIONS, type WineItem } from "@/lib/admin-store";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Trash2, FolderPlus, ArrowUp, ArrowDown, ExternalLink, ImagePlus, Pencil } from "lucide-react";

export function WinesSection() {
  const { state, setState, newId } = useAdmin();
  const [newCat, setNewCat] = useState("");
  const [editing, setEditing] = useState<{ catId: string; item: WineItem; isNew: boolean } | null>(null);

  const updateHero = (patch: Partial<typeof state.wines>) =>
    setState((s) => ({ ...s, wines: { ...s.wines, ...patch } }));

  const addCategory = () => {
    if (!newCat.trim()) return;
    setState((s) => ({
      ...s,
      wines: {
        ...s.wines,
        categories: [...s.wines.categories, { id: newId(), name: newCat.trim(), items: [] }],
      },
    }));
    setNewCat("");
  };

  const removeCategory = (id: string) =>
    setState((s) => ({
      ...s,
      wines: { ...s.wines, categories: s.wines.categories.filter((c) => c.id !== id) },
    }));

  const moveCategory = (id: string, dir: -1 | 1) =>
    setState((s) => {
      const idx = s.wines.categories.findIndex((c) => c.id === id);
      if (idx === -1) return s;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= s.wines.categories.length) return s;
      const next = [...s.wines.categories];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return { ...s, wines: { ...s.wines, categories: next } };
    });

  const renameCategory = (id: string, name: string) =>
    setState((s) => ({
      ...s,
      wines: {
        ...s.wines,
        categories: s.wines.categories.map((c) => (c.id === id ? { ...c, name } : c)),
      },
    }));

  const openNew = (catId: string) =>
    setEditing({
      catId,
      isNew: true,
      item: {
        id: newId(),
        name: "",
        producer: "",
        region: WINE_REGIONS[0],
        year: "",
        price: "0,00€",
        image: "",
        notes: "",
        visible: true,
      },
    });

  const openEdit = (catId: string, item: WineItem) =>
    setEditing({ catId, isNew: false, item: { ...item } });

  const patchEditing = (patch: Partial<WineItem>) =>
    setEditing((e) => (e ? { ...e, item: { ...e.item, ...patch } } : e));

  const saveEditing = () => {
    if (!editing) return;
    const { catId, item, isNew } = editing;
    setState((s) => ({
      ...s,
      wines: {
        ...s.wines,
        categories: s.wines.categories.map((c) =>
          c.id === catId
            ? {
                ...c,
                items: isNew
                  ? [...c.items, item]
                  : c.items.map((i) => (i.id === item.id ? item : i)),
              }
            : c,
        ),
      },
    }));
    setEditing(null);
  };

  const removeItem = (catId: string, itemId: string) =>
    setState((s) => ({
      ...s,
      wines: {
        ...s.wines,
        categories: s.wines.categories.map((c) =>
          c.id === catId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c,
        ),
      },
    }));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Carta de Vinhos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Página oculta do menu — acessível apenas via URL direta.
          </p>
        </div>
        <a
          href="/carta-de-vinhos"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-charcoal hover:bg-secondary"
        >
          <ExternalLink className="h-4 w-4" /> Ver página
        </a>
      </header>

      <div className="space-y-3 rounded-xl border border-border bg-card p-5">
        <h2 className="font-serif text-lg text-charcoal">Cabeçalho</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Etiqueta</label>
            <Input value={state.wines.eyebrow} onChange={(e) => updateHero({ eyebrow: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Título</label>
            <Input value={state.wines.title} onChange={(e) => updateHero({ title: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Subtítulo</label>
          <Textarea
            value={state.wines.subtitle}
            onChange={(e) => updateHero({ subtitle: e.target.value })}
            rows={2}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
        <div className="min-w-[200px] flex-1">
          <label className="text-xs font-medium text-muted-foreground">Nova categoria</label>
          <Input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="Ex.: Rosés" />
        </div>
        <Button onClick={addCategory} className="gap-2">
          <FolderPlus className="h-4 w-4" /> Criar categoria
        </Button>
      </div>

      <div className="space-y-5">
        {state.wines.categories.map((cat, catIdx) => (
          <div key={cat.id} className="rounded-xl border border-border bg-card">
            <div className="flex items-center gap-3 border-b border-border p-4">
              <div className="flex flex-col gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={catIdx === 0}
                  onClick={() => moveCategory(cat.id, -1)}
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={catIdx === state.wines.categories.length - 1}
                  onClick={() => moveCategory(cat.id, 1)}
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
              </div>
              <Input
                value={cat.name}
                onChange={(e) => renameCategory(cat.id, e.target.value)}
                className="max-w-xs border-transparent bg-transparent px-1 font-serif text-lg text-charcoal focus-visible:border-input"
              />
              <div className="ml-auto flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openNew(cat.id)} className="gap-2">
                  <Plus className="h-4 w-4" /> Vinho
                </Button>
                <Button variant="ghost" size="icon" onClick={() => removeCategory(cat.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>

            <div className="divide-y divide-border">
              {cat.items.length === 0 && (
                <p className="p-4 text-sm text-muted-foreground">Sem vinhos nesta categoria.</p>
              )}
              {cat.items.map((wine) => (
                <div key={wine.id} className="flex items-center gap-3 p-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-secondary/40">
                    {wine.image ? (
                      <img src={wine.image} alt={wine.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <ImagePlus className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <p className="truncate font-serif text-base text-charcoal">
                        {wine.name || <span className="italic text-muted-foreground">Sem nome</span>}
                      </p>
                      {wine.year && <span className="text-xs text-muted-foreground">{wine.year}</span>}
                      <span className="ml-auto shrink-0 text-sm text-muted-foreground">{wine.price}</span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {[wine.producer, wine.region].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  {!wine.visible && (
                    <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                      Oculto
                    </span>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => openEdit(cat.id, wine)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(cat.id, wine.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing?.isNew ? "Adicionar vinho" : "Editar vinho"}</DialogTitle>
            <DialogDescription>
              Preencha os dados do vinho e guarde para aplicar.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="sm:w-40">
                  <label className="text-xs font-medium text-muted-foreground">Imagem</label>
                  <WineImageUpload
                    url={editing.item.image}
                    alt={editing.item.name}
                    onChange={(url) => patchEditing({ image: url })}
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Nome</label>
                    <Input
                      value={editing.item.name}
                      onChange={(e) => patchEditing({ name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Produtor</label>
                    <Input
                      value={editing.item.producer}
                      onChange={(e) => patchEditing({ producer: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Ano</label>
                      <Input
                        value={editing.item.year}
                        onChange={(e) => patchEditing({ year: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Preço</label>
                      <Input
                        value={editing.item.price}
                        onChange={(e) => patchEditing({ price: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Região</label>
                <Select
                  value={editing.item.region}
                  onValueChange={(v) => patchEditing({ region: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar região" />
                  </SelectTrigger>
                  <SelectContent>
                    {WINE_REGIONS.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Notas de prova</label>
                <Textarea
                  value={editing.item.notes}
                  rows={3}
                  onChange={(e) => patchEditing({ notes: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={editing.item.visible}
                  onCheckedChange={(v) => patchEditing({ visible: v })}
                />
                <label className="text-sm text-charcoal">Visível na carta</label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
            <Button onClick={saveEditing}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function WineImageUpload({
  url,
  alt,
  onChange,
}: {
  url: string;
  alt: string;
  onChange: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    onChange(URL.createObjectURL(file));
  };

  return (
    <div className="mt-1 space-y-2">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border border-dashed border-border bg-secondary/40"
      >
        {url ? (
          <img src={url} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <ImagePlus className="h-6 w-6 text-muted-foreground" />
        )}
        <span className="absolute inset-0 flex items-center justify-center gap-2 bg-charcoal/0 text-xs font-medium text-cream opacity-0 transition-all group-hover:bg-charcoal/55 group-hover:opacity-100">
          <ImagePlus className="h-4 w-4" /> Substituir
        </span>
      </button>
      <Button
        type="button"
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