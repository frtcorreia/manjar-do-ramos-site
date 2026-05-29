import { useState } from "react";
import { useAdmin, WINE_REGIONS, type WineItem } from "@/lib/admin-store";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, FolderPlus, ArrowUp, ArrowDown, ExternalLink, ImagePlus } from "lucide-react";

export function WinesSection() {
  const { state, setState, newId } = useAdmin();
  const [newCat, setNewCat] = useState("");

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

  const addItem = (catId: string) =>
    setState((s) => ({
      ...s,
      wines: {
        ...s.wines,
        categories: s.wines.categories.map((c) =>
          c.id === catId
            ? {
                ...c,
                items: [
                  ...c.items,
                  {
                    id: newId(),
                    name: "Novo vinho",
                    producer: "",
                    region: WINE_REGIONS[0],
                    year: "",
                    price: "0,00€",
                    image: "",
                    notes: "",
                    visible: true,
                  },
                ],
              }
            : c,
        ),
      },
    }));

  const updateItem = (catId: string, itemId: string, patch: Partial<WineItem>) =>
    setState((s) => ({
      ...s,
      wines: {
        ...s.wines,
        categories: s.wines.categories.map((c) =>
          c.id === catId
            ? { ...c, items: c.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)) }
            : c,
        ),
      },
    }));

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
                <Button variant="outline" size="sm" onClick={() => addItem(cat.id)} className="gap-2">
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
                <div key={wine.id} className="space-y-3 p-4">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_2fr_1fr_auto_auto]">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Nome</label>
                      <Input
                        value={wine.name}
                        onChange={(e) => updateItem(cat.id, wine.id, { name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Produtor</label>
                      <Input
                        value={wine.producer}
                        onChange={(e) => updateItem(cat.id, wine.id, { producer: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Ano</label>
                      <Input
                        value={wine.year}
                        onChange={(e) => updateItem(cat.id, wine.id, { year: e.target.value })}
                      />
                    </div>
                    <div className="flex items-end gap-2 pb-1">
                      <div className="flex flex-col items-center">
                        <label className="text-xs font-medium text-muted-foreground">Visível</label>
                        <Switch
                          checked={wine.visible}
                          onCheckedChange={(v) => updateItem(cat.id, wine.id, { visible: v })}
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(cat.id, wine.id)}
                      className="self-end"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr_1fr]">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Região</label>
                      <Input
                        value={wine.region}
                        onChange={(e) => updateItem(cat.id, wine.id, { region: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Preço copo</label>
                      <Input
                        value={wine.glassPrice}
                        onChange={(e) => updateItem(cat.id, wine.id, { glassPrice: e.target.value })}
                        placeholder="—"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Preço garrafa</label>
                      <Input
                        value={wine.bottlePrice}
                        onChange={(e) => updateItem(cat.id, wine.id, { bottlePrice: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Notas de prova</label>
                    <Textarea
                      value={wine.notes}
                      rows={2}
                      onChange={(e) => updateItem(cat.id, wine.id, { notes: e.target.value })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}