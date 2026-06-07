import { useAdmin } from "@/lib/admin-store";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";

export function NavegacaoSection() {
  const { state, setState } = useAdmin();
  const { navPages, maintenance } = state;

  const togglePage = (key: string, visible: boolean) =>
    setState((s) => ({
      ...s,
      navPages: s.navPages.map((p) => (p.key === key ? { ...p, visible } : p)),
    }));

  const setMaintenance = (patch: Partial<typeof maintenance>) =>
    setState((s) => ({ ...s, maintenance: { ...s.maintenance, ...patch } }));

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-serif text-3xl text-charcoal">Navegação & Modo Manutenção</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Controla a visibilidade das páginas no menu e o estado do site.
        </p>
      </header>

      {/* Modo manutenção */}
      <section className={`space-y-5 rounded-xl border p-6 ${maintenance.enabled ? "border-amber-400 bg-amber-50" : "border-border bg-card"}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className={`h-5 w-5 ${maintenance.enabled ? "text-amber-500" : "text-muted-foreground"}`} />
            <div>
              <p className="font-semibold text-charcoal">Modo Manutenção</p>
              <p className="text-sm text-muted-foreground">
                Quando ativo, os visitantes veem a página de manutenção. Admins continuam a ver o site normalmente.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs font-semibold ${maintenance.enabled ? "text-amber-600" : "text-muted-foreground"}`}>
              {maintenance.enabled ? "Ativo" : "Inativo"}
            </span>
            <Switch
              checked={maintenance.enabled}
              onCheckedChange={(v) => setMaintenance({ enabled: v })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-charcoal">Título da página de manutenção</Label>
            <Input
              value={maintenance.titulo}
              onChange={(e) => setMaintenance({ titulo: e.target.value })}
              className="border-border"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-charcoal">Mensagem para os visitantes</Label>
            <Textarea
              value={maintenance.mensagem}
              onChange={(e) => setMaintenance({ mensagem: e.target.value })}
              rows={3}
              className="border-border"
            />
          </div>
        </div>
      </section>

      {/* Visibilidade das páginas no menu */}
      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold text-charcoal">Páginas no Menu de Navegação</h2>
        <p className="text-sm text-muted-foreground">
          Ocultar uma página remove-a do menu mas a URL continua acessível.
        </p>
        <div className="divide-y divide-border">
          {navPages.map((page) => (
            <div key={page.key} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="font-medium text-charcoal">{page.label}</p>
                <p className="text-xs text-muted-foreground">{page.href}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold ${page.visible ? "text-green-600" : "text-muted-foreground"}`}>
                  {page.visible ? "Visível" : "Oculto"}
                </span>
                <Switch
                  checked={page.visible}
                  onCheckedChange={(v) => togglePage(page.key, v)}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
