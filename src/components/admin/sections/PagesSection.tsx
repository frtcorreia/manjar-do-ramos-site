import { useState } from "react";
import { useAdmin, type Page } from "@/lib/admin-store";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export function PagesSection() {
  const { state, setState, newId } = useAdmin();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  const update = (id: string, patch: Partial<Page>) =>
    setState((s) => ({
      ...s,
      pages: s.pages.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));

  const remove = (id: string) =>
    setState((s) => ({ ...s, pages: s.pages.filter((p) => p.id !== id) }));

  const add = () => {
    if (!title.trim()) return;
    const cleanSlug = slug.trim() || "/" + title.trim().toLowerCase().replace(/\s+/g, "-");
    setState((s) => ({
      ...s,
      pages: [...s.pages, { id: newId(), title: title.trim(), slug: cleanSlug, published: false, inNav: true }],
    }));
    setTitle("");
    setSlug("");
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-charcoal">Páginas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gira as páginas do site, a sua publicação e presença no menu.
        </p>
      </header>

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
        <div className="flex-1 min-w-[160px]">
          <label className="text-xs font-medium text-muted-foreground">Título</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Sobre Nós" />
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="text-xs font-medium text-muted-foreground">Slug</label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="/sobre-nos" />
        </div>
        <Button onClick={add} className="gap-2">
          <Plus className="h-4 w-4" /> Adicionar
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3 text-center">Publicada</th>
              <th className="px-4 py-3 text-center">No menu</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {state.pages.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <Input
                    value={p.title}
                    onChange={(e) => update(p.id, { title: e.target.value })}
                    className="h-8 border-transparent bg-transparent px-1 focus-visible:border-input"
                  />
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.slug}</td>
                <td className="px-4 py-3 text-center">
                  <Switch checked={p.published} onCheckedChange={(v) => update(p.id, { published: v })} />
                </td>
                <td className="px-4 py-3 text-center">
                  <Switch checked={p.inNav} onCheckedChange={(v) => update(p.id, { inNav: v })} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => remove(p.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}