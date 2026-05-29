import { useState } from "react";
import { useAdmin, type MenuItem } from "@/lib/admin-store";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, FolderPlus, ArrowUp, ArrowDown } from "lucide-react";

export function MenuSection() {
  const { state, setState, newId } = useAdmin();
  const [newCat, setNewCat] = useState("");

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

  const renameCategory = (id: string, name: string) =>
    setState((s) => ({ ...s, menu: s.menu.map((c) => (c.id === id ? { ...c, name } : c)) }));

  const addItem = (catId: string) =>
    setState((s) => ({
      ...s,
      menu: s.menu.map((c) =>
        c.id === catId
          ? { ...c, items: [...c.items, { id: newId(), name: "Novo prato", description: "", price: "0,00€", visible: true }] }
          : c,
      ),
    }));

  const updateItem = (catId: string, itemId: string, patch: Partial<MenuItem>) =>
    setState((s) => ({
      ...s,
      menu: s.menu.map((c) =>
        c.id === catId
          ? { ...c, items: c.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)) }
          : c,
      ),
    }));

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
        {state.menu.map((cat) => (
          <div key={cat.id} className="rounded-xl border border-border bg-card">
            <div className="flex items-center gap-3 border-b border-border p-4">
              <Input
                value={cat.name}
                onChange={(e) => renameCategory(cat.id, e.target.value)}
                className="max-w-xs border-transparent bg-transparent px-1 font-serif text-lg text-charcoal focus-visible:border-input"
              />
              <div className="ml-auto flex gap-2">
                <Button variant="outline" size="sm" onClick={() => addItem(cat.id)} className="gap-2">
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
                <div key={item.id} className="grid grid-cols-1 gap-3 p-4 md:grid-cols-[1.2fr_2fr_auto_auto_auto] md:items-center">
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(cat.id, item.id, { name: e.target.value })}
                    placeholder="Nome do prato"
                  />
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(cat.id, item.id, { description: e.target.value })}
                    placeholder="Descrição"
                  />
                  <Input
                    value={item.price}
                    onChange={(e) => updateItem(cat.id, item.id, { price: e.target.value })}
                    placeholder="Preço"
                    className="w-24"
                  />
                  <Switch
                    checked={item.visible}
                    onCheckedChange={(v) => updateItem(cat.id, item.id, { visible: v })}
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeItem(cat.id, item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}