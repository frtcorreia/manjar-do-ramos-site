import { useState, type FormEvent } from "react";
import { Reveal } from "./Reveal";

export function Reservation() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="reservar" className="relative bg-espresso py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-5 md:px-10">
        <Reveal className="text-center">
          <span className="eyebrow text-gold">Reservas</span>
          <h2 className="mt-5 font-serif text-4xl font-medium leading-tight text-cream md:text-5xl">
            Reserve a sua mesa e viva a experiência
          </h2>
          <p className="mt-5 text-lg text-cream/75">
            Para jantares a dois ou grandes mesas de convívio. Confirmamos a sua
            reserva com a maior brevidade.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-12">
          {sent ? (
            <div className="rounded-2xl bg-cream/8 p-10 text-center ring-1 ring-gold/40">
              <p className="font-serif text-2xl text-gold">Obrigado!</p>
              <p className="mt-2 text-cream/80">
                Recebemos o seu pedido de reserva. Entraremos em contacto em breve
                para confirmar a sua mesa.
              </p>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="rounded-2xl bg-cream/[0.04] p-7 ring-1 ring-cream/15 backdrop-blur-sm md:p-10"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Nome" name="nome" type="text" placeholder="O seu nome" />
                <Field label="Telefone" name="telefone" type="tel" placeholder="+351 ___ ___ ___" />
                <Field label="Data" name="data" type="date" />
                <Field label="Hora" name="hora" type="time" />
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-cream/80">
                    Nº de pessoas
                  </label>
                  <select
                    name="pessoas"
                    className="w-full rounded-lg border border-cream/20 bg-charcoal/40 px-4 py-3 text-cream outline-none transition-colors focus:border-gold"
                    defaultValue="2"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n} className="bg-charcoal text-cream">
                        {n} {n === 1 ? "pessoa" : "pessoas"}
                      </option>
                    ))}
                    <option value="9+" className="bg-charcoal text-cream">9+ pessoas (grupo)</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="mt-7 w-full rounded-full bg-gold px-8 py-4 text-sm font-semibold uppercase tracking-wider text-charcoal shadow-gold transition-transform hover:scale-[1.02]"
              >
                Confirmar Reserva
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type,
  placeholder,
}: {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-cream/80">{label}</label>
      <input
        required
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg border border-cream/20 bg-charcoal/40 px-4 py-3 text-cream placeholder:text-cream/40 outline-none transition-colors focus:border-gold"
      />
    </div>
  );
}