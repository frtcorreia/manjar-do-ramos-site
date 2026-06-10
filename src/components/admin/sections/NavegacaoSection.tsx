import { useAdmin, type BlockKey, type NavPageKey } from "@/lib/admin-store";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";

/* Áreas da página inicial: bloco da homepage + link de nav opcional */
const HOMEPAGE_SECTIONS: {
  label: string;
  description: string;
  blockKey: BlockKey;
  navKey: NavPageKey | null;
}[] = [
  {
    label: "Conceito",
    description: "Secção 'O Nosso Conceito' na homepage.",
    blockKey: "about",
    navKey: "conceito",
  },
  {
    label: "Pratos & Especialidades",
    description: "Secção com os pratos em destaque.",
    blockKey: "specialties",
    navKey: null,
  },
  {
    label: "Espaço",
    description: "Galeria de fotos do espaço.",
    blockKey: "gallery",
    navKey: "espaco",
  },
  {
    label: "Testemunhos",
    description: "Avaliações e comentários de clientes.",
    blockKey: "testimonials",
    navKey: "testemunhos",
  },
  {
    label: "Reservas",
    description: "Formulário de reserva de mesa.",
    blockKey: "reservation",
    navKey: null,
  },
];

/* Páginas: só link de nav */
const PAGE_KEYS: NavPageKey[] = ["ementa", "catering", "carta-de-vinhos", "a-minha-conta"];

export function NavegacaoSection() {
  const { state, setState } = useAdmin();
  const { navPages, blocks, maintenance } = state;

  /* Toggle homepage section: atualiza bloco + navPage (se existir) */
  const toggleSection = (blockKey: BlockKey, navKey: NavPageKey | null, visible: boolean) =>
    setState((s) => ({
      ...s,
      blocks: s.blocks.map((b) => (b.key === blockKey ? { ...b, visible } : b)),
      navPages: navKey
        ? s.navPages.map((p) => (p.key === navKey ? { ...p, visible } : p))
        : s.navPages,
    }));

  /* Toggle página: só navPage */
  const togglePage = (key: NavPageKey, visible: boolean) =>
    setState((s) => ({
      ...s,
      navPages: s.navPages.map((p) => (p.key === key ? { ...p, visible } : p)),
    }));

  const setMaintenance = (patch: Partial<typeof maintenance>) =>
    setState((s) => ({ ...s, maintenance: { ...s.maintenance, ...patch } }));

  const blockVisible = (key: BlockKey) => blocks.find((b) => b.key === key)?.visible ?? true;
  const pageVisible = (key: NavPageKey) => navPages.find((p) => p.key === key)?.visible ?? true;

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-serif text-3xl text-charcoal">Navegação & Site</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Controla a visibilidade das secções e páginas do site.
        </p>
      </header>

      {/* Áreas da página inicial */}
      <section className="space-y-4">
        <div>
          <h2 className="font-semibold text-charcoal">Áreas da página inicial</h2>
          <p className="text-sm text-muted-foreground">
            Ocultar uma área remove-a da homepage e do menu de navegação.
          </p>
        </div>
        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          {HOMEPAGE_SECTIONS.map(({ label, description, blockKey, navKey }) => {
            const visible = blockVisible(blockKey);
            return (
              <div key={blockKey} className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-medium text-charcoal">{label}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-xs font-semibold ${visible ? "text-green-600" : "text-muted-foreground"}`}
                  >
                    {visible ? "Visível" : "Oculto"}
                  </span>
                  <Switch
                    checked={visible}
                    onCheckedChange={(v) => toggleSection(blockKey, navKey, v)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Páginas */}
      <section className="space-y-4">
        <div>
          <h2 className="font-semibold text-charcoal">Páginas</h2>
          <p className="text-sm text-muted-foreground">
            Ocultar uma página remove-a do menu de navegação. A URL continua acessível.
          </p>
        </div>
        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          {PAGE_KEYS.map((key) => {
            const page = navPages.find((p) => p.key === key);
            if (!page) return null;
            const visible = pageVisible(key);
            return (
              <div key={key} className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-medium text-charcoal">{page.label}</p>
                  <p className="text-xs text-muted-foreground">{page.href}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-xs font-semibold ${visible ? "text-green-600" : "text-muted-foreground"}`}
                  >
                    {visible ? "Visível" : "Oculto"}
                  </span>
                  <Switch checked={visible} onCheckedChange={(v) => togglePage(key, v)} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modo manutenção */}
      <section
        className={`space-y-5 rounded-xl border p-6 ${maintenance.enabled ? "border-amber-400 bg-amber-50" : "border-border bg-card"}`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle
              className={`h-5 w-5 ${maintenance.enabled ? "text-amber-500" : "text-muted-foreground"}`}
            />
            <div>
              <p className="font-semibold text-charcoal">Modo Manutenção</p>
              <p className="text-sm text-muted-foreground">
                Quando ativo, os visitantes veem a página de manutenção. Admins continuam a ver o
                site normalmente.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`text-xs font-semibold ${maintenance.enabled ? "text-amber-600" : "text-muted-foreground"}`}
            >
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
            <Label className="text-sm font-medium text-charcoal">
              Título da página de manutenção
            </Label>
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
    </div>
  );
}
