import logo from "@/assets/logo-cream.png";
import type { MaintenanceConfig } from "@/lib/admin-store";

export function MaintenancePage({ config }: { config: MaintenanceConfig }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-charcoal px-5 text-center">
      <img src={logo} alt="Manjar do Ramos" className="h-20 w-auto opacity-80" />
      <h1 className="font-serif text-4xl font-medium text-cream md:text-5xl">
        {config.titulo}
      </h1>
      <p className="max-w-md text-lg text-cream/70">{config.mensagem}</p>
      <span className="mt-4 h-0.5 w-16 bg-gold" />
    </div>
  );
}
