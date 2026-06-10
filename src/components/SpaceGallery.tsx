import { Reveal } from "./Reveal";
import g1Default from "@/assets/gallery-1.jpg";
import g2Default from "@/assets/gallery-2.jpg";
import g3Default from "@/assets/gallery-3.jpg";
import g4Default from "@/assets/gallery-4.jpg";
import { useBlockContent } from "@/hooks/useSiteConfig";

export function SpaceGallery() {
  const { field, image } = useBlockContent("gallery");
  const g1 = image("Imagem 1", g1Default);
  const g2 = image("Imagem 2", g2Default);
  const g3 = image("Imagem 3", g3Default);
  const g4 = image("Imagem 4", g4Default);

  return (
    <section id="espaco" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-wine">{field("Etiqueta", "A Experiência do Espaço")}</span>
          <h2 className="mt-5 font-serif text-4xl font-medium leading-tight text-espresso md:text-5xl">
            {field("Título", "Madeira, luz quente e mesas cheias")}
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            {field(
              "Subtítulo",
              "Um ambiente rústico e contemporâneo, onde cada detalhe convida a ficar.",
            )}
          </p>
        </Reveal>

        <div className="mt-14 grid auto-rows-[170px] grid-cols-2 gap-4 md:auto-rows-[220px] md:grid-cols-4 md:gap-5">
          <Reveal className="col-span-1 row-span-2">
            <img
              src={g1}
              alt="Canto íntimo da taberna com cadeiras de couro e luz de Edison"
              width={1000}
              height={1400}
              loading="lazy"
              className="h-full w-full rounded-2xl object-cover shadow-soft transition-transform duration-700 hover:scale-[1.03]"
            />
          </Reveal>
          <Reveal delay={0.1} className="col-span-1 md:col-span-2">
            <img
              src={g2}
              alt="Brinde com vinho tinto sobre mesa cheia de comida"
              width={1300}
              height={900}
              loading="lazy"
              className="h-full w-full rounded-2xl object-cover shadow-soft transition-transform duration-700 hover:scale-[1.03]"
            />
          </Reveal>
          <Reveal delay={0.2} className="col-span-1 row-span-2">
            <img
              src={g4}
              alt="Chefe a grelhar carne sobre o fogo na cozinha aberta"
              width={1000}
              height={1400}
              loading="lazy"
              className="h-full w-full rounded-2xl object-cover shadow-soft transition-transform duration-700 hover:scale-[1.03]"
            />
          </Reveal>
          <Reveal delay={0.15} className="col-span-2 md:col-span-2">
            <img
              src={g3}
              alt="Garrafeira de pedra e madeira iluminada na taberna"
              width={1300}
              height={900}
              loading="lazy"
              className="h-full w-full rounded-2xl object-cover shadow-soft transition-transform duration-700 hover:scale-[1.03]"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
