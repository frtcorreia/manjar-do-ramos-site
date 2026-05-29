import { useState } from "react";
import { useAdmin, type MenuItem } from "@/lib/admin-store";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Trash2, FolderPlus, ArrowUp, ArrowDown, Pencil } from "lucide-react";

export function MenuSection() {
  const { state, setState, newId } = useAdmin();
  const [newCat, setNewCat] = useState("");
  const [editing, setEditing] = useState<{ catId: string; item: MenuItem; isNew: boolean } | null>(null);

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
      item: { id: newId(), name: "", description: "", price: "0,00€", visible: true },
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
              items: isNew
                ? [...c.items, item]
                : c.items.map((i) => (i.id === item.id ? item : i)),
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
          <Input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="Ex.: Sobremesas" />
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
                <Button variant="outline" size="sm" onClick={() => openNew(cat.id)} className="gap-2">
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
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <p className="truncate font-serif text-base text-charcoal">
                        {item.name || <span className="text-muted-foreground italic">Sem nome</span>}
                      </p>
                      <span className="shrink-0 text-sm text-muted-foreground">{item.price}</span>
                    </div>
                    {item.description && (
                      <p className="truncate text-sm text-muted-foreground">{item.description}</p>
                    )}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing?.isNew ? "Adicionar prato" : "Editar prato"}</DialogTitle>
            <DialogDescription>
              Preencha os dados do prato e guarde para aplicar.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
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