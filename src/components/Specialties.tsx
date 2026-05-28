import { Reveal } from "./Reveal";
import carne from "@/assets/dish-carne.jpg";
import bacalhau from "@/assets/dish-bacalhau.jpg";
import petiscos from "@/assets/dish-petiscos.jpg";
import tabua from "@/assets/dish-tabua.jpg";
import sobremesa from "@/assets/dish-sobremesa.jpg";
import cocktails from "@/assets/dish-cocktails.jpg";

const dishes = [
  {
    img: carne,
    name: "Carnes Maturadas",
    desc: "Cortes nobres na brasa, crosta estaladiça e o ponto certo de sal grosso.",
  },
  {
    img: bacalhau,
    name: "Bacalhau à Lagareiro",
    desc: "Lombo alourado, batata a murro e o azeite a perfumar a mesa.",
  },
  {
    img: petiscos,
    name: "Petiscos Portugueses",
    desc: "Gambas, chouriço e croquetes — para começar e nunca mais parar.",
  },
  {
    img: tabua,
    name: "Tábuas de Partilha",
    desc: "Enchidos, queijos regionais e mel, servidos para toda a mesa.",
  },
  {
    img: sobremesa,
    name: "Sobremesas de Sempre",
    desc: "Doçaria tradicional reinterpretada, com canela e açúcar caramelizado.",
  },
  {
    img: cocktails,
    name: "Cocktails & Sangrias",
    desc: "Sangrias de fruta e criações de autor para acompanhar a noite.",
  },
];

export function Specialties() {
  return (
    <section id="especialidades" className="bg-charcoal py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-gold">Especialidades da Casa</span>
          <h2 className="mt-5 font-serif text-4xl font-medium leading-tight text-cream md:text-5xl">
            Cada prato, uma razão para voltar
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((d, i) => (
            <Reveal key={d.name} delay={(i % 3) * 0.1}>
              <article className="group relative h-[24rem] overflow-hidden rounded-2xl shadow-card">
                <img
                  src={d.img}
                  alt={d.name}
                  width={1100}
                  height={1100}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-serif text-2xl text-cream">{d.name}</h3>
                  <p className="mt-2 max-h-0 overflow-hidden text-sm leading-relaxed text-cream/80 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
                    {d.desc}
                  </p>
                  <span className="mt-3 inline-block h-0.5 w-10 origin-left scale-x-100 bg-gold transition-transform duration-500 group-hover:w-16" />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}