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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Manjar do Ramos · Taberna Moderna Portuguesa em Lisboa" },
      {
        name: "description",
        content:
          "Sabores portugueses com alma de taberna. Carnes maturadas, petiscos e tábuas de partilha num ambiente acolhedor. Reserve a sua mesa.",
      },
      { property: "og:title", content: "Manjar do Ramos · Taberna Moderna Portuguesa" },
      {
        property: "og:description",
        content:
          "Uma experiência gastronómica feita para partilhar, saborear e voltar. Reserve a sua mesa no Manjar do Ramos.",
      },
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
            streetAddress: "Rua da Taberna 12",
            addressLocality: "Lisboa",
            addressCountry: "PT",
          },
          telephone: "+351 210 000 000",
          openingHours: [
            "Tu-Su 12:00-15:00",
            "Tu-Su 19:00-23:30",
          ],
        }),
      },
    ],
  }),
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
