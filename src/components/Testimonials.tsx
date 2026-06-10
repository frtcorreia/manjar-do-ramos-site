import { Reveal } from "./Reveal";
import { useSiteTestimonials } from "@/hooks/useSiteConfig";

const DEFAULT_REVIEWS = [
  {
    id: "1",
    quote:
      "Fomos jantar a dois e saímos a planear a próxima visita. A carne na brasa é das melhores que provei em Lisboa.",
    name: "Inês Carvalho",
    context: "Jantar romântico",
    visible: true,
  },
  {
    id: "2",
    quote:
      "Levei o grupo todo do trabalho. As tábuas de partilha foram um sucesso e o ambiente é simplesmente acolhedor.",
    name: "Tiago Mendes",
    context: "Jantar de grupo",
    visible: true,
  },
  {
    id: "3",
    quote:
      "Comida portuguesa com alma e um serviço impecável. Sente-se que cada prato é feito com carinho.",
    name: "Sofia Almeida",
    context: "Cliente habitual",
    visible: true,
  },
];

function Stars() {
  return (
    <div className="flex gap-1 text-gold" aria-label="5 estrelas">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-4 w-4 fill-current">
          <path d="M12 2l2.9 6.2 6.8.8-5 4.7 1.3 6.8L12 17.8 5.9 21l1.3-6.8-5-4.7 6.8-.8z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  const testimonials = useSiteTestimonials();
  const reviews = testimonials ? testimonials.filter((t) => t.visible) : DEFAULT_REVIEWS;

  return (
    <section id="testemunhos" className="bg-wine py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-gold">Quem Já Se Sentou À Mesa</span>
          <h2 className="mt-5 font-serif text-4xl font-medium leading-tight text-cream md:text-5xl">
            Histórias que se contam ao jantar
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.id ?? r.name} delay={i * 0.12}>
              <figure className="flex h-full flex-col rounded-2xl bg-cream/8 p-8 ring-1 ring-cream/15 backdrop-blur-sm">
                <Stars />
                <blockquote className="mt-5 flex-1 font-serif text-xl italic leading-relaxed text-cream">
                  "{r.quote}"
                </blockquote>
                <figcaption className="mt-6 border-t border-cream/15 pt-4">
                  <p className="font-semibold text-cream">{r.name}</p>
                  <p className="text-sm text-gold">{r.context}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
