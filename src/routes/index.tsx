import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Specialties } from "@/components/Specialties";
import { SpaceGallery } from "@/components/SpaceGallery";
import { Testimonials } from "@/components/Testimonials";
import { Reservation } from "@/components/Reservation";
import { Footer } from "@/components/Footer";
import { useSiteBlocks } from "@/hooks/useSiteConfig";
import { getPageSeo, getRestauranteSeo } from "@/lib/seo";

const FALLBACK_SEO = {
  title: "Manjar do Ramos · Taberna Moderna Portuguesa em Lisboa",
  description:
    "Sabores portugueses com alma de taberna. Carnes maturadas, petiscos e tábuas de partilha num ambiente acolhedor. Reserve a sua mesa.",
  ogTitle: "Manjar do Ramos · Taberna Moderna Portuguesa",
  ogDescription:
    "Uma experiência gastronómica feita para partilhar, saborear e voltar. Reserve a sua mesa no Manjar do Ramos.",
};

export const Route = createFileRoute("/")({
  loader: async () => {
    const [seo, restaurante] = await Promise.all([
      getPageSeo("index", FALLBACK_SEO),
      getRestauranteSeo(),
    ]);
    return { seo, restaurante };
  },
  head: ({ loaderData }) => {
    const { seo, restaurante } = loaderData ?? { seo: FALLBACK_SEO, restaurante: undefined };
    const [streetAddress, ...localityParts] = (restaurante?.morada || "Rua da Taberna 12, Lisboa").split(",");
    const addressLocality = localityParts.join(",").trim() || "Lisboa";

    return {
      meta: [
        { title: seo.title },
        { name: "description", content: seo.description },
        { property: "og:title", content: seo.ogTitle },
        { property: "og:description", content: seo.ogDescription },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "/" },
      ],
      links: [{ rel: "canonical", href: "/" }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            name: "Manjar do Ramos",
            servesCuisine: "Portuguese",
            address: {
              "@type": "PostalAddress",
              streetAddress: streetAddress?.trim() || "Rua da Taberna 12",
              addressLocality,
              addressCountry: "PT",
            },
            telephone: restaurante?.telefone || "+351 210 000 000",
            openingHours: ["Tu-Su 12:00-15:00", "Tu-Su 19:00-23:30"],
          }),
        },
      ],
    };
  },
  component: Index,
});

function Index() {
  const { isVisible } = useSiteBlocks();

  return (
    <div className="bg-background">
      <Navbar />
      <main>
        {isVisible("hero") && <Hero />}
        {isVisible("about") && <About />}
        {isVisible("specialties") && <Specialties />}
        {isVisible("gallery") && <SpaceGallery />}
        {isVisible("testimonials") && <Testimonials />}
        {isVisible("reservation") && <Reservation />}
      </main>
      <Footer />
    </div>
  );
}
