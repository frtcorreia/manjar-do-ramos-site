import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import heroImgDefault from "@/assets/dish-carne.jpg";
import { usePageContent } from "@/hooks/useSiteConfig";

export const Route = createFileRoute("/ementa")({
  head: () => ({
    meta: [
      { title: "Ementa · Manjar do Ramos · Taberna Moderna Portuguesa" },
      {
        name: "description",
        content:
          "Descubra a ementa do Manjar do Ramos: petiscos, carnes maturadas, bacalhau, tábuas de partilha, sobremesas e cocktails. Sabores portugueses para partilhar.",
      },
      { property: "og:title", content: "Ementa · Manjar do Ramos" },
      {
        property: "og:description",
        content:
          "Petiscos, carnes maturadas, bacalhau e tábuas de partilha numa taberna portuguesa contemporânea.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: EmentaPage,
});

type MenuItem = { name: string; desc: string; price: string };
type MenuSection = { title: string; eyebrow: string; items: MenuItem[] };

const sections: MenuSection[] = [
  {
    eyebrow: "Para Começar",
    title: "Petiscos & Entradas",
    items: [
      { name: "Gambas ao alho", desc: "Salteadas em azeite, alho e malagueta, com pão torrado.", price: "12,50" },
      { name: "Chouriço assado", desc: "Flamejado à mesa, com broa de milho.", price: "8,50" },
      { name: "Croquetes de novilho", desc: "Estaladiços por fora, cremosos por dentro, com mostarda antiga.", price: "7,00" },
      { name: "Peixinhos da horta", desc: "Feijão-verde em tempura leve, com maionese de coentros.", price: "6,50" },
      { name: "Pataniscas de bacalhau", desc: "Douradas, com arroz de feijão malandrinho.", price: "9,00" },
    ],
  },
  {
    eyebrow: "Para Partilhar",
    title: "Tábuas da Casa",
    items: [
      { name: "Tábua de enchidos", desc: "Seleção de enchidos regionais e azeitonas.", price: "16,00" },
      { name: "Tábua de queijos", desc: "Queijos portugueses com mel, doce de abóbora e frutos secos.", price: "17,50" },
      { name: "Tábua Manjar", desc: "Enchidos, queijos, presunto e acompanhamentos. Para a mesa toda.", price: "28,00" },
    ],
  },
  {
    eyebrow: "Da Brasa",
    title: "Carnes Maturadas",
    items: [
      { name: "Bife do lombo (300g)", desc: "Maturado, na brasa, com flor de sal e legumes assados.", price: "26,00" },
      { name: "Costela de novilho", desc: "Lentamente assada, desfaz-se à garfada, com puré rústico.", price: "23,00" },
      { name: "Picanha na pedra", desc: "Servida a escaldar, para fatiar ao ponto de cada um.", price: "24,50" },
      { name: "Secretos de porco preto", desc: "Grelhados, com migas de espargos.", price: "19,00" },
    ],
  },
  {
    eyebrow: "Do Mar",
    title: "Peixe & Bacalhau",
    items: [
      { name: "Bacalhau à lagareiro", desc: "Lombo alourado, batata a murro e azeite generoso.", price: "21,00" },
      { name: "Polvo à lagareiro", desc: "Tenro, com batatas ao murro e alho dourado.", price: "22,50" },
      { name: "Arroz de marisco", desc: "Malandrinho, rico de sabor, para duas pessoas.", price: "38,00" },
    ],
  },
  {
    eyebrow: "Para Adoçar",
    title: "Sobremesas",
    items: [
      { name: "Pão de ló húmido", desc: "Com gelado de baunilha de Madagáscar.", price: "6,50" },
      { name: "Arroz doce queimado", desc: "Canela e açúcar caramelizado a maçarico.", price: "5,50" },
      { name: "Mousse de chocolate", desc: "Intensa, com flor de sal e azeite.", price: "6,00" },
    ],
  },
  {
    eyebrow: "Para Acompanhar",
    title: "Cocktails & Vinhos",
    items: [
      { name: "Sangria da casa", desc: "De vinho tinto ou espumante, com fruta da época. (jarro)", price: "14,00" },
      { name: "Gin tónico de autor", desc: "Botânicos portugueses e citrinos.", price: "9,00" },
      { name: "Copo de vinho", desc: "Seleção rotativa de produtores nacionais.", price: "4,50" },
    ],
  },
];

function EmentaPage() {
  const { field, image } = usePageContent("ementa");
  const heroImg = image("Hero — Imagem de fundo", heroImgDefault);

  return (
    <div className="bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative flex h-[60svh] min-h-[420px] items-center justify-center overflow-hidden bg-charcoal">
          <img
            src={heroImg}
            alt="Carnes maturadas na brasa do Manjar do Ramos"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <Reveal className="relative z-10 px-5 text-center">
            <span className="eyebrow text-gold">{field("Hero — Etiqueta", "Ementa da Casa")}</span>
            <h1 className="mt-5 font-serif text-5xl font-medium leading-tight text-cream md:text-7xl">
              {field("Hero — Título", "A nossa ementa")}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-cream/85 md:text-lg">
              {field("Hero — Subtítulo", "Sabores portugueses pensados para partilhar à volta da mesa.")}
            </p>
          </Reveal>
        </section>

        {/* Menu */}
        <section className="bg-background py-24 md:py-32">
          <div className="mx-auto max-w-4xl px-5 md:px-10">
            <div className="space-y-20">
              {sections.map((section) => (
                <Reveal key={section.title}>
                  <div className="mb-8 text-center">
                    <span className="eyebrow text-wine">{section.eyebrow}</span>
                    <h2 className="mt-3 font-serif text-3xl text-espresso md:text-4xl">
                      {section.title}
                    </h2>
                    <span className="mx-auto mt-5 block h-0.5 w-12 bg-gold" />
                  </div>
                  <ul className="space-y-6">
                    {section.items.map((item) => (
                      <li key={item.name} className="flex items-baseline gap-4">
                        <div className="flex-1">
                          <div className="flex items-baseline gap-3">
                            <h3 className="font-serif text-xl text-espresso">{item.name}</h3>
                            <span className="h-px flex-1 translate-y-[-2px] border-b border-dashed border-border" />
                            <span className="font-serif text-lg font-medium text-wine">
                              {item.price}€
                            </span>
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {item.desc}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-20 rounded-2xl bg-secondary p-10 text-center shadow-soft">
              <h2 className="font-serif text-3xl text-espresso md:text-4xl">
                {field("CTA — Título", "Pronto para uma mesa cheia?")}
              </h2>
              <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                {field("CTA — Subtítulo", "Reserve a sua mesa e deixe a noite acontecer entre pratos, vinho e boa conversa.")}
              </p>
              <a
                href="/#reservar"
                className="mt-8 inline-block rounded-full bg-wine px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-cream shadow-soft transition-transform hover:scale-[1.03]"
              >
                {field("CTA — Botão", "Reservar Mesa")}
              </a>
              <p className="mt-6 text-xs text-muted-foreground">
                Organiza um evento?{" "}
                <Link to="/catering" className="font-semibold text-wine underline">
                  Conheça o nosso serviço de catering
                </Link>
              </p>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}