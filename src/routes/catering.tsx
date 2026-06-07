import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { UtensilsCrossed, Users, PartyPopper, Truck, ChefHat, Wine } from "lucide-react";
import heroImgDefault from "@/assets/dish-tabua.jpg";
import about1Default from "@/assets/about-2.jpg";
import { usePageContent } from "@/hooks/useSiteConfig";

export const Route = createFileRoute("/catering")({
  head: () => ({
    meta: [
      { title: "Catering · Manjar do Ramos · Eventos & Celebrações" },
      {
        name: "description",
        content:
          "Serviço de catering do Manjar do Ramos para casamentos, eventos de empresa e festas privadas. Sabores portugueses de taberna levados até si.",
      },
      { property: "og:title", content: "Catering · Manjar do Ramos" },
      {
        property: "og:description",
        content:
          "Leve a alma da taberna ao seu evento: petiscos, tábuas, carnes na brasa e doçaria portuguesa.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: CateringPage,
});

const services = [
  {
    icon: PartyPopper,
    title: "Festas Privadas",
    desc: "Aniversários, batizados e celebrações em família, com a abundância da taberna.",
  },
  {
    icon: Users,
    title: "Eventos de Empresa",
    desc: "Almoços, jantares e cocktails corporativos que ficam na memória da equipa.",
  },
  {
    icon: Wine,
    title: "Casamentos",
    desc: "Mesas de partilha, carnes na brasa e doçaria portuguesa para o seu grande dia.",
  },
  {
    icon: Truck,
    title: "Entrega & Montagem",
    desc: "Levamos tudo até si — montamos, servimos e tratamos de cada detalhe.",
  },
  {
    icon: ChefHat,
    title: "Chef no Local",
    desc: "Show-cooking e brasa ao vivo para uma experiência gastronómica completa.",
  },
  {
    icon: UtensilsCrossed,
    title: "Menus à Medida",
    desc: "Adaptamos a ementa ao seu evento, número de convidados e orçamento.",
  },
];

const steps = [
  { n: "01", title: "Conte-nos a sua ideia", desc: "Data, número de convidados e tipo de evento." },
  { n: "02", title: "Desenhamos a ementa", desc: "Uma proposta à medida do seu gosto e orçamento." },
  { n: "03", title: "Tratamos de tudo", desc: "Logística, montagem e serviço no dia." },
  { n: "04", title: "Celebrem juntos", desc: "Vocês aproveitam, nós cuidamos da mesa." },
];

function CateringPage() {
  const { field, image } = usePageContent("catering");
  const heroImg = image("Hero — Imagem de fundo", heroImgDefault);
  const introImg = image("Intro — Imagem", about1Default);

  return (
    <div className="bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative flex h-[64svh] min-h-[440px] items-center justify-center overflow-hidden bg-charcoal">
          <img
            src={heroImg}
            alt="Tábua de partilha do Manjar do Ramos para eventos"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <Reveal className="relative z-10 px-5 text-center">
            <span className="eyebrow text-gold">{field("Hero — Etiqueta", "Catering & Eventos")}</span>
            <h1 className="mt-5 font-serif text-5xl font-medium leading-tight text-cream md:text-7xl">
              {field("Hero — Título", "A taberna vai até si")}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-cream/85 md:text-lg">
              {field("Hero — Subtítulo", "Levamos a abundância, o convívio e os sabores do Manjar do Ramos ao seu evento.")}
            </p>
            <a
              href="#pedido"
              className="mt-9 inline-block rounded-full bg-wine px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-cream shadow-soft transition-transform hover:scale-[1.03]"
            >
              {field("Hero — Botão", "Pedir Orçamento")}
            </a>
          </Reveal>
        </section>

        {/* Intro */}
        <section className="bg-background py-24 md:py-32">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2 md:gap-16 md:px-10">
            <Reveal>
              <div className="overflow-hidden rounded-2xl shadow-card">
                <img
                  src={introImg}
                  alt="Mesa farta de petiscos portugueses para partilhar"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <span className="eyebrow text-wine">{field("Intro — Etiqueta", "O Nosso Catering")}</span>
              <h2 className="mt-4 font-serif text-3xl text-espresso md:text-4xl">
                {field("Intro — Título", "Mesas que reúnem, sabores que ficam")}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                {field("Intro — Parágrafo 1", "Quer seja um jantar íntimo ou uma grande celebração, levamos a alma da taberna portuguesa onde quiser. Petiscos generosos, carnes na brasa, tábuas de partilha e doçaria de sempre — servidos com o calor e o cuidado que nos definem.")}
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {field("Intro — Parágrafo 2", "Cada evento é único, por isso desenhamos cada ementa a pensar em si e nos seus convidados.")}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Services */}
        <section className="bg-charcoal py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="eyebrow text-gold">{field("Serviços — Etiqueta", "O Que Oferecemos")}</span>
              <h2 className="mt-5 font-serif text-4xl font-medium leading-tight text-cream md:text-5xl">
                {field("Serviços — Título", "Um serviço pensado ao detalhe")}
              </h2>
            </Reveal>
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <Reveal key={s.title} delay={(i % 3) * 0.1}>
                  <article className="h-full rounded-2xl border border-cream/10 bg-cream/[0.04] p-8 transition-colors hover:border-gold/50">
                    <s.icon className="h-8 w-8 text-gold" />
                    <h3 className="mt-5 font-serif text-2xl text-cream">{s.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-cream/75">{s.desc}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-background py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="eyebrow text-wine">{field("Como Funciona — Etiqueta", "Como Funciona")}</span>
              <h2 className="mt-5 font-serif text-4xl font-medium leading-tight text-espresso md:text-5xl">
                {field("Como Funciona — Título", "Simples, do primeiro contacto ao brinde")}
              </h2>
            </Reveal>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <Reveal key={step.n} delay={(i % 4) * 0.1}>
                  <div>
                    <span className="font-serif text-5xl text-gold">{step.n}</span>
                    <h3 className="mt-3 font-serif text-2xl text-espresso">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="pedido" className="bg-secondary py-24 md:py-32">
          <div className="mx-auto max-w-2xl px-5 text-center md:px-10">
            <Reveal>
              <span className="eyebrow text-wine">Pedir Orçamento</span>
              <h2 className="mt-5 font-serif text-4xl font-medium leading-tight text-espresso md:text-5xl">
                {field("CTA — Título", "Vamos planear o seu evento")}
              </h2>
              <p className="mx-auto mt-5 max-w-md text-muted-foreground">
                {field("CTA — Subtítulo", "Conte-nos os detalhes e enviamos-lhe uma proposta à medida. Resposta em até 48 horas.")}
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href={`mailto:${field("CTA — Email", "eventos@manjardoramos.pt")}`}
                  className="rounded-full bg-wine px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-cream shadow-soft transition-transform hover:scale-[1.03]"
                >
                  {field("CTA — Email", "eventos@manjardoramos.pt")}
                </a>
                <a
                  href={`tel:${field("CTA — Telefone", "+351210000000").replace(/\s/g, "")}`}
                  className="rounded-full border border-wine/40 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-wine transition-colors hover:bg-wine hover:text-cream"
                >
                  {field("CTA — Telefone", "+351 210 000 000")}
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}