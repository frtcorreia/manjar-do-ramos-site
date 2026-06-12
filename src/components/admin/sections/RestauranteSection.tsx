import { useAdmin } from "@/lib/admin-store";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, Facebook, Star } from "lucide-react";

export function RestauranteSection() {
  const { state, setState } = useAdmin();
  const r = state.restaurante;

  const set = (patch: Partial<typeof r>) =>
    setState((s) => ({ ...s, restaurante: { ...s.restaurante, ...patch } }));

  const setSocial = (
    key: keyof typeof r.social,
    patch: Partial<(typeof r.social)[keyof typeof r.social]>,
  ) =>
    setState((s) => ({
      ...s,
      restaurante: {
        ...s.restaurante,
        social: {
          ...s.restaurante.social,
          [key]: { ...s.restaurante.social[key], ...patch },
        },
      },
    }));

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-serif text-3xl text-charcoal">Restaurante</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Dados de contacto, localização e redes sociais.
        </p>
      </header>

      {/* Proprietário */}
      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold text-charcoal">Proprietário</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome do proprietário" value={r.nomeProprietario ?? ""} onChange={(v) => set({ nomeProprietario: v })} />
          <Field label="NIF" value={r.nif ?? ""} onChange={(v) => set({ nif: v })} />
        </div>
      </section>

      {/* Contactos */}
      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold text-charcoal">Contactos</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Morada" value={r.morada} onChange={(v) => set({ morada: v })} />
          <Field label="Telefone" value={r.telefone} onChange={(v) => set({ telefone: v })} />
          <Field label="Email" value={r.email} onChange={(v) => set({ email: v })} />
          <Field label="Horário" value={r.horario} onChange={(v) => set({ horario: v })} />
        </div>
      </section>

      {/* Localização */}
      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold text-charcoal">Localização</h2>
        <Field
          label="Link Google Maps"
          value={r.googleMapsUrl}
          onChange={(v) => set({ googleMapsUrl: v })}
          placeholder="https://maps.google.com/..."
        />
        <Field
          label="Embed Google Maps (URL do iframe)"
          value={r.googleMapsEmbed}
          onChange={(v) => set({ googleMapsEmbed: v })}
          placeholder="https://www.google.com/maps/embed?pb=..."
        />
        {r.googleMapsEmbed && (
          <div className="overflow-hidden rounded-lg border border-border">
            <iframe
              src={r.googleMapsEmbed}
              className="h-48 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </section>

      {/* Redes Sociais */}
      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold text-charcoal">Redes Sociais</h2>
        <div className="space-y-4">
          <SocialRow
            icon={<Instagram className="h-5 w-5" />}
            label="Instagram"
            url={r.social.instagram.url}
            visible={r.social.instagram.visible}
            onUrl={(v) => setSocial("instagram", { url: v })}
            onVisible={(v) => setSocial("instagram", { visible: v })}
          />
          <SocialRow
            icon={<Facebook className="h-5 w-5" />}
            label="Facebook"
            url={r.social.facebook.url}
            visible={r.social.facebook.visible}
            onUrl={(v) => setSocial("facebook", { url: v })}
            onVisible={(v) => setSocial("facebook", { visible: v })}
          />
          <SocialRow
            icon={<Star className="h-5 w-5" />}
            label="TripAdvisor"
            url={r.social.tripadvisor.url}
            visible={r.social.tripadvisor.visible}
            onUrl={(v) => setSocial("tripadvisor", { url: v })}
            onVisible={(v) => setSocial("tripadvisor", { visible: v })}
          />
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-charcoal">{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-border"
      />
    </div>
  );
}

function SocialRow({
  icon,
  label,
  url,
  visible,
  onUrl,
  onVisible,
}: {
  icon: React.ReactNode;
  label: string;
  url: string;
  visible: boolean;
  onUrl: (v: string) => void;
  onVisible: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-charcoal">
        {icon}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium text-charcoal">{label}</p>
        <Input
          value={url}
          onChange={(e) => onUrl(e.target.value)}
          placeholder={`URL ${label}`}
          className="h-8 border-border text-xs"
        />
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-semibold ${visible ? "text-green-600" : "text-muted-foreground"}`}
        >
          {visible ? "Visível" : "Oculto"}
        </span>
        <Switch checked={visible} onCheckedChange={onVisible} />
      </div>
    </div>
  );
}
