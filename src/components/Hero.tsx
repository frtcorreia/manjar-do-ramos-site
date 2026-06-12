import { motion } from "framer-motion";
import heroImgDefault from "@/assets/hero.jpg";
import { useBlockContent } from "@/hooks/useSiteConfig";

export function Hero() {
  const { field, image, backgroundColor } = useBlockContent("hero");
  const heroImg = image("Imagem de fundo", heroImgDefault);

  return (
    <section
      id="top"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-charcoal"
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <img
        src={heroImg}
        alt="Mesa de taberna portuguesa com bife grelhado, queijo derretido e vinho a ser servido"
        width={1920}
        height={1280}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover animate-kenburns"
      />
      <div className="absolute inset-0 bg-gradient-hero" />

      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-5 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="eyebrow text-gold"
        >
          {field("Etiqueta", "Taberna Moderna Portuguesa")}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-4xl font-serif text-5xl font-medium leading-[1.05] text-cream md:text-7xl lg:text-[5.5rem]"
        >
          {field("Título", "Sabores portugueses com alma de taberna.")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8 }}
          className="mt-6 max-w-xl text-base text-cream/85 md:text-lg"
        >
          {field(
            "Subtítulo",
            "Uma experiência gastronómica feita para partilhar, saborear e voltar.",
          )}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <a
            href="#reservar"
            className="rounded-full bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-charcoal shadow-soft transition-transform hover:scale-[1.03]"
          >
            {field("Botão principal", "Reservar Mesa")}
          </a>
          <a
            href="#especialidades"
            className="rounded-full border border-cream/40 bg-cream/5 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-cream backdrop-blur-sm transition-colors hover:border-gold hover:text-gold"
          >
            {field("Botão secundário", "Ver Menu")}
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-cream/40 p-1.5">
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            className="h-2 w-1 rounded-full bg-gold"
          />
        </div>
      </motion.div>
    </section>
  );
}
