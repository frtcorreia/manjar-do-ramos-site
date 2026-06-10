import { useRef, useState } from "react";
import { useAdmin, type MenuItem, type Allergen } from "@/lib/admin-store";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Trash2, FolderPlus, ArrowUp, ArrowDown, Pencil, ImagePlus } from "lucide-react";

const ALLERGENS: { id: Allergen; label: string; emoji: string }[] = [
  { id: "gluten", label: "Glúten", emoji: "🌾" },
  { id: "crustaceans", label: "Crustáceos", emoji: "🦐" },
  { id: "eggs", label: "Ovos", emoji: "🥚" },
  { id: "fish", label: "Peixes", emoji: "🐟" },
  { id: "peanuts", label: "Amendoins", emoji: "🥜" },
  { id: "soy", label: "Soja", emoji: "🫘" },
  { id: "milk", label: "Leite", emoji: "🥛" },
  { id: "nuts", label: "Frutos de casca rija", emoji: "🌰" },
  { id: "celery", label: "Aipo", emoji: "🌿" },
  { id: "mustard", label: "Mostarda", emoji: "🟡" },
  { id: "sesame", label: "Sementes de sésamo", emoji: "⚪" },
  { id: "sulphites", label: "Dióxido de enxofre e sulfitos", emoji: "🍷" },
  { id: "lupin", label: "Tremoço", emoji: "🟠" },
  { id: "molluscs", label: "Moluscos", emoji: "🦑" },
];

export function MenuSection() {
  const { state, setState, newId } = useAdmin();
  const [newCat, setNewCat] = useState("");
  const [editing, setEditing] = useState<{ catId: string; item: MenuItem; isNew: boolean } | null>(
    null,
  );

  const addCategory = () => {
    if (!newCat.trim()) return;
    setState((s) => ({
      ...s,
      menu: [...s.menu, { id: newId(), name: newCat.trim(), items: [] }],
    }));
    setNewCat("");
  };

  const removeCategory = (id: string) =>
    setState((s) => ({ ...s, menu: s.menu.filter((c) => c.id !== id) }));

  const moveCategory = (id: string, dir: -1 | 1) => {
    setState((s) => {
      const idx = s.menu.findIndex((c) => c.id === id);
      if (idx === -1) return s;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= s.menu.length) return s;
      const next = [...s.menu];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return { ...s, menu: next };
    });
  };

  const renameCategory = (id: string, name: string) =>
    setState((s) => ({ ...s, menu: s.menu.map((c) => (c.id === id ? { ...c, name } : c)) }));

  const openNew = (catId: string) =>
    setEditing({
      catId,
      isNew: true,
      item: {
        id: newId(),
        name: "",
        description: "",
        price: "0,00€",
        image: "",
        delivery: true,
        takeaway: true,
        restaurant: true,
        visible: true,
        allergens: [],
      },
    });

  const openEdit = (catId: string, item: MenuItem) =>
    setEditing({ catId, isNew: false, item: { ...item } });

  const saveEditing = () => {
    if (!editing) return;
    const { catId, item, isNew } = editing;
    setState((s) => ({
      ...s,
      menu: s.menu.map((c) =>
        c.id === catId
          ? {
              ...c,
              items: isNew ? [...c.items, item] : c.items.map((i) => (i.id === item.id ? item : i)),
            }
          : c,
      ),
    }));
    setEditing(null);
  };

  const patchEditing = (patch: Partial<MenuItem>) =>
    setEditing((e) => (e ? { ...e, item: { ...e.item, ...patch } } : e));

  const removeItem = (catId: string, itemId: string) =>
    setState((s) => ({
      ...s,
      menu: s.menu.map((c) =>
        c.id === catId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c,
      ),
    }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-charcoal">Ementa</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Organize categorias e pratos, preços e visibilidade.
        </p>
      </header>

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-medium text-muted-foreground">Nova categoria</label>
          <Input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="Ex.: Sobremesas"
          />
        </div>
        <Button onClick={addCategory} className="gap-2">
          <FolderPlus className="h-4 w-4" /> Criar categoria
        </Button>
      </div>

      <div className="space-y-5">
        {state.menu.map((cat, catIdx) => (
          <div key={cat.id} className="rounded-xl border border-border bg-card">
            <div className="flex items-center gap-3 border-b border-border p-4">
              <div className="flex items-center gap-2">
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
                    disabled={catIdx === state.menu.length - 1}
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
              </div>
              <div className="ml-auto flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openNew(cat.id)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" /> Prato
                </Button>
                <Button variant="ghost" size="icon" onClick={() => removeCategory(cat.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>

            <div className="divide-y divide-border">
              {cat.items.length === 0 && (
                <p className="p-4 text-sm text-muted-foreground">Sem pratos nesta categoria.</p>
              )}
              {cat.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-secondary/40">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <ImagePlus className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <p className="truncate font-serif text-base text-charcoal">
                        {item.name || (
                          <span className="text-muted-foreground italic">Sem nome</span>
                        )}
                      </p>
                      <span className="shrink-0 text-sm text-muted-foreground">{item.price}</span>
                    </div>
                    {item.description && (
                      <p className="truncate text-sm text-muted-foreground">{item.description}</p>
                    )}
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {item.restaurant && (
                        <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                          Restaurante
                        </span>
                      )}
                      {item.takeaway && (
                        <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                          Take-away
                        </span>
                      )}
                      {item.delivery && (
                        <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                          Delivery
                        </span>
                      )}
                      {(item.allergens ?? []).map((a) => {
                        const info = ALLERGENS.find((x) => x.id === a);
                        return info ? (
                          <span
                            key={a}
                            title={info.label}
                            className="rounded bg-amber-50 px-1.5 py-0.5 text-sm leading-none"
                          >
                            {info.emoji}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                  {!item.visible && (
                    <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                      Oculto
                    </span>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => openEdit(cat.id, item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(cat.id, item.id)}>
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
            <DialogTitle>{editing?.isNew ? "Adicionar prato" : "Editar prato"}</DialogTitle>
            <DialogDescription>Preencha os dados do prato e guarde para aplicar.</DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="sm:w-40">
                  <label className="text-xs font-medium text-muted-foreground">Imagem</label>
                  <DishImageUpload
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
                      placeholder="Nome do prato"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Descrição</label>
                    <Textarea
                      value={editing.item.description}
                      onChange={(e) => patchEditing({ description: e.target.value })}
                      rows={3}
                      placeholder="Descrição"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Preço</label>
                  <Input
                    value={editing.item.price}
                    onChange={(e) => patchEditing({ price: e.target.value })}
                    placeholder="0,00€"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-muted-foreground">Visível</label>
                  <div className="flex h-9 items-center">
                    <Switch
                      checked={editing.item.visible}
                      onCheckedChange={(v) => patchEditing({ visible: v })}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Disponível em</label>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <label className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-charcoal">
                    <Checkbox
                      checked={editing.item.restaurant}
                      onCheckedChange={(v) => patchEditing({ restaurant: v === true })}
                    />
                    Restaurante
                  </label>
                  <label className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-charcoal">
                    <Checkbox
                      checked={editing.item.takeaway}
                      onCheckedChange={(v) => patchEditing({ takeaway: v === true })}
                    />
                    Take-away
                  </label>
                  <label className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-charcoal">
                    <Checkbox
                      checked={editing.item.delivery}
                      onCheckedChange={(v) => patchEditing({ delivery: v === true })}
                    />
                    Delivery
                  </label>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Alergénicos</label>
                <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                  {ALLERGENS.map((a) => {
                    const checked = (editing.item.allergens ?? []).includes(a.id);
                    return (
                      <label
                        key={a.id}
                        className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                          checked
                            ? "border-primary/40 bg-primary/5 text-charcoal"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(v) => {
                            const current = editing.item.allergens ?? [];
                            patchEditing({
                              allergens:
                                v === true ? [...current, a.id] : current.filter((x) => x !== a.id),
                            });
                          }}
                        />
                        <span className="text-base leading-none">{a.emoji}</span>
                        <span className="truncate">{a.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
            <Button onClick={saveEditing}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DishImageUpload({
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
