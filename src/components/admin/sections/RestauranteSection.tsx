import { useRef, useState } from "react";
import { useAdmin } from "@/lib/admin-store";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Instagram, Facebook, Star, ImagePlus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

      {/* Logo */}
      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <div>
          <h2 className="font-semibold text-charcoal">Logo do restaurante</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Imagem usada no cabeçalho e em zonas escuras do site.
          </p>
        </div>
        <LogoUpload url={r.logo} onChange={(v) => set({ logo: v })} />
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

function LogoUpload({ url, onChange }: { url: string; onChange: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "png";
      const path = `logo/restaurant-logo.${ext}`;
      const { error } = await (supabase.storage as any)
        .from("site-assets")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      const { data: urlData } = (supabase.storage as any)
        .from("site-assets")
        .getPublicUrl(path);
      onChange(urlData.publicUrl);
    } catch (err) {
      console.error("Logo upload failed:", err);
      alert("Erro ao carregar logo. Verifique que o bucket 'site-assets' existe e é público.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="group relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-md border border-dashed border-border bg-charcoal"
      >
        {uploading ? (
          <Loader2 className="h-6 w-6 animate-spin text-cream/60" />
        ) : url ? (
          <img src={url} alt="Logo" className="h-full w-full object-contain p-2" />
        ) : (
          <ImagePlus className="h-6 w-6 text-cream/60" />
        )}
        {!uploading && (
          <span className="absolute inset-0 flex items-center justify-center gap-2 bg-charcoal/0 text-xs font-medium text-cream opacity-0 transition-all group-hover:bg-charcoal/55 group-hover:opacity-100">
            <ImagePlus className="h-4 w-4" /> Substituir
          </span>
        )}
      </button>
      <div className="flex flex-col gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? "A carregar…" : "Carregar logo"}
        </Button>
        {url && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
            className="text-muted-foreground"
          >
            Remover
          </Button>
        )}
      </div>
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
