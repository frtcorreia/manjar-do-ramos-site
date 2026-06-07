import { Reveal } from "./Reveal";
import about1Default from "@/assets/about-1.jpg";
import about2Default from "@/assets/about-2.jpg";
import { useBlockContent } from "@/hooks/useSiteConfig";

export function About() {
  const { field, image } = useBlockContent("about");
  const img1 = image("Imagem 1", about1Default);
  const img2 = image("Imagem 2", about2Default);

  return (
    <section id="conceito" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-wine">{field("Etiqueta", "O Nosso Conceito")}</span>
          <h2 className="mt-5 font-serif text-4xl font-medium leading-tight text-espresso md:text-5xl">
            {field("Título", "Tradição portuguesa reinterpretada, à volta da mesa")}
          </h2>
        </Reveal>

        {/* Row 1 */}
        <div className="mt-20 grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <div className="overflow-hidden rounded-2xl shadow-card">
              <img
                src={img1}
                alt="Interior acolhedor da taberna com madeira escura e luz quente"
                width={1200}
                height={1400}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <span className="eyebrow text-gold">Acolhedor</span>
            <h3 className="mt-4 font-serif text-3xl text-espresso md:text-4xl">
              {field("Parágrafo 1", "Uma casa feita de madeira, vinho e boa conversa")}
            </h3>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {field("Parágrafo 2", "No Manjar do Ramos, cada noite começa com o aroma da grelha e termina com risos à volta de uma mesa cheia.")}
            </p>
          </Reveal>
        </div>

        {/* Row 2 */}
        <div className="mt-16 grid items-center gap-12 md:mt-24 md:grid-cols-2 md:gap-16">
          <Reveal delay={0.15} className="md:order-2">
            <div className="overflow-hidden rounded-2xl shadow-card">
              <img
                src={img2}
                alt="Tábuas de partilha com petiscos portugueses generosos"
                width={1200}
                height={1400}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </Reveal>
          <Reveal className="md:order-1">
            <span className="eyebrow text-gold">Abundância</span>
            <h3 className="mt-4 font-serif text-3xl text-espresso md:text-4xl">
              Pratos generosos, pensados para partilhar
            </h3>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Produtos honestos, fogo lento e receitas que atravessam gerações. Das
              carnes maturadas ao bacalhau, das tábuas aos petiscos — tudo chega à
              mesa para ser dividido, provado e celebrado.
            </p>
            <div className="mt-8 flex gap-10">
              <div>
                <p className="font-serif text-4xl text-wine">+40</p>
                <p className="mt-1 text-sm text-muted-foreground">Petiscos & pratos</p>
              </div>
              <div>
                <p className="font-serif text-4xl text-wine">120</p>
                <p className="mt-1 text-sm text-muted-foreground">Referências de vinho</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
