import { useAdmin, type Testimonial } from "@/lib/admin-store";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export function TestimonialsSection() {
  const { state, setState, newId } = useAdmin();

  const update = (id: string, patch: Partial<Testimonial>) =>
    setState((s) => ({
      ...s,
      testimonials: s.testimonials.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));

  const remove = (id: string) =>
    setState((s) => ({ ...s, testimonials: s.testimonials.filter((t) => t.id !== id) }));

  const add = () =>
    setState((s) => ({
      ...s,
      testimonials: [
        ...s.testimonials,
        { id: newId(), quote: "", name: "Novo cliente", context: "", visible: true },
      ],
    }));

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Testemunhos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Avaliações de clientes mostradas no site.
          </p>
        </div>
        <Button onClick={add} className="gap-2">
          <Plus className="h-4 w-4" /> Adicionar
        </Button>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {state.testimonials.map((t) => (
          <div key={t.id} className="space-y-3 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch checked={t.visible} onCheckedChange={(v) => update(t.id, { visible: v })} />
                <span className="text-xs text-muted-foreground">
                  {t.visible ? "Visível" : "Oculto"}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => remove(t.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <Textarea
              value={t.quote}
              onChange={(e) => update(t.id, { quote: e.target.value })}
              placeholder="Citação do cliente"
              rows={3}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                value={t.name}
                onChange={(e) => update(t.id, { name: e.target.value })}
                placeholder="Nome"
              />
              <Input
                value={t.context}
                onChange={(e) => update(t.id, { context: e.target.value })}
                placeholder="Contexto"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
