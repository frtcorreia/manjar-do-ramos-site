import { Reveal } from "./Reveal";
import { useSiteTestimonials, useSiteGoogleReviews, useBlockContent } from "@/hooks/useSiteConfig";

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

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-1 text-gold" aria-label={`${count} estrelas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`h-4 w-4 ${i < count ? "fill-current" : "fill-current opacity-20"}`}
        >
          <path d="M12 2l2.9 6.2 6.8.8-5 4.7 1.3 6.8L12 17.8 5.9 21l1.3-6.8-5-4.7 6.8-.8z" />
        </svg>
      ))}
    </div>
  );
}

function GoogleBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-charcoal/10 px-2 py-0.5 text-[10px] font-medium text-charcoal">
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Google
    </span>
  );
}

type ReviewItem = {
  id: string;
  quote: string;
  name: string;
  context: string;
  rating: number;
  isGoogle: boolean;
};

export function Testimonials() {
  const testimonials = useSiteTestimonials();
  const googleReviews = useSiteGoogleReviews();
  const { backgroundColor } = useBlockContent("testimonials");

  const manualReviews: ReviewItem[] = (
    testimonials ? testimonials.filter((t) => t.visible) : DEFAULT_REVIEWS
  ).map((t) => ({
    id: t.id,
    quote: t.quote,
    name: t.name,
    context: t.context,
    rating: 5,
    isGoogle: false,
  }));

  const googleItems: ReviewItem[] = googleReviews.map((r) => ({
    id: r.id,
    quote: r.text,
    name: r.author_name,
    context: r.relative_time_description,
    rating: r.rating,
    isGoogle: true,
  }));

  const allReviews = [...googleItems, ...manualReviews];

  return (
    <section id="testemunhos" className="bg-gold py-24 md:py-32" style={backgroundColor ? { backgroundColor } : undefined}>
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-charcoal">Quem Já Se Sentou À Mesa</span>
          <h2 className="mt-5 font-serif text-4xl font-medium leading-tight text-charcoal md:text-5xl">
            Histórias que se contam ao jantar
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {allReviews.map((r, i) => (
            <Reveal key={r.id} delay={i * 0.12}>
              <figure className="flex h-full flex-col rounded-2xl bg-charcoal/8 p-8 ring-1 ring-charcoal/15 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <Stars count={r.rating} />
                  {r.isGoogle && <GoogleBadge />}
                </div>
                <blockquote className="mt-5 flex-1 font-serif text-xl italic leading-relaxed text-charcoal">
                  "{r.quote}"
                </blockquote>
                <figcaption className="mt-6 border-t border-charcoal/15 pt-4">
                  <p className="font-semibold text-charcoal">{r.name}</p>
                  <p className="text-sm text-charcoal">{r.context}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
