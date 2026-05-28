import { useAdmin } from "@/lib/admin-store";
import { Switch } from "@/components/ui/switch";

export function BlocksSection() {
  const { state, setState } = useAdmin();

  const toggle = (key: string, visible: boolean) =>
    setState((s) => ({
      ...s,
      blocks: s.blocks.map((b) => (b.key === key ? { ...b, visible } : b)),
    }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-charcoal">Visibilidade dos Blocos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ative ou desative secções da página inicial.
        </p>
      </header>

      <div className="divide-y divide-border rounded-xl border border-border bg-card">
        {state.blocks.map((b) => (
          <div key={b.key} className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="font-medium text-charcoal">{b.label}</p>
              <p className="text-sm text-muted-foreground">{b.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-semibold ${
                  b.visible ? "text-green-600" : "text-muted-foreground"
                }`}
              >
                {b.visible ? "Visível" : "Oculto"}
              </span>
              <Switch checked={b.visible} onCheckedChange={(v) => toggle(b.key, v)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}