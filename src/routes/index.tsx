import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Specialties } from "@/components/Specialties";
import { SpaceGallery } from "@/components/SpaceGallery";
import { Testimonials } from "@/components/Testimonials";
import { Reservation } from "@/components/Reservation";
import { Footer } from "@/components/Footer";

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
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="bg-background">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Specialties />
        <SpaceGallery />
        <Testimonials />
        <Reservation />
      </main>
      <Footer />
    </div>
  );
}
