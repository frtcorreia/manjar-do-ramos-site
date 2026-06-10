import { Phone } from "lucide-react";
import { Reveal } from "./Reveal";
import { useBlockContent } from "@/hooks/useSiteConfig";

export function Reservation() {
  const { field } = useBlockContent("reservation");
  const telefone = field("Telefone", "+351 210 000 000");
  const labelTelefone = field("Label Telefone", "Chamada para a rede móvel nacional");

  return (
    <section id="reservar" className="relative bg-espresso py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-5 md:px-10">
        <Reveal className="text-center">
          <span className="eyebrow text-gold">{field("Etiqueta", "Reservas")}</span>
          <h2 className="mt-5 font-serif text-4xl font-medium leading-tight text-cream md:text-5xl">
            {field("Título", "Reserve a sua mesa e viva a experiência")}
          </h2>
          <p className="mt-5 text-lg text-cream/75">
            {field(
              "Subtítulo",
              "Para jantares a dois ou grandes mesas de convívio. Confirmamos a sua reserva com a maior brevidade.",
            )}
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-12 flex flex-col items-center gap-3">
          <a
            href={`tel:${telefone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-4 rounded-2xl bg-cream/[0.04] px-10 py-8 ring-1 ring-cream/15 backdrop-blur-sm transition-colors hover:bg-cream/10"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 ring-1 ring-gold/40">
              <Phone className="h-6 w-6 text-gold" />
            </span>
            <span className="font-serif text-3xl font-medium tracking-wide text-cream md:text-4xl">
              {telefone}
            </span>
          </a>
          {labelTelefone && (
            <p className="text-xs text-cream/50">{labelTelefone}</p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
