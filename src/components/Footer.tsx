import { MapPin, Clock, Phone, Instagram, Facebook } from "lucide-react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo-cream.png";

export function Footer() {
  return (
    <footer className="bg-charcoal pt-20 text-cream/80">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <img
              src={logo}
              alt="Manjar do Ramos"
              className="h-24 w-auto"
            />
            <p className="mt-5 text-sm leading-relaxed">
              Sabores portugueses com alma de taberna. Feitos para partilhar,
              saborear e voltar.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="#" aria-label="Instagram" className="rounded-full border border-cream/20 p-2.5 transition-colors hover:border-gold hover:text-gold">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Facebook" className="rounded-full border border-cream/20 p-2.5 transition-colors hover:border-gold hover:text-gold">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <li>
                <Link to="/ementa" className="transition-colors hover:text-gold">
                  Ementa
                </Link>
              </li>
              <li>
                <Link to="/catering" className="transition-colors hover:text-gold">
                  Catering
                </Link>
              </li>
              <li>
                <a href="/#reservar" className="transition-colors hover:text-gold">
                  Reservar
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-xl text-cream">Contactos</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gold" /> +351 210 000 000
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-gold" /> Rua da Taberna 12, Lisboa
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-xl text-cream">Horário</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 text-gold" />
                <span>
                  Terça a Domingo
                  <br />
                  12h00 – 15h00 · 19h00 – 23h30
                </span>
              </li>
              <li className="pl-7 text-cream/55">Segunda — Encerrado</li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-xl text-cream">Localização</h3>
            <a
              href="#"
              className="mt-4 block overflow-hidden rounded-xl border border-cream/15"
            >
              <div className="relative h-32 w-full bg-[radial-gradient(circle_at_30%_40%,oklch(0.3_0.04_50),oklch(0.19_0.012_60))]">
                <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(oklch(0.76_0.1_80/.4)_1px,transparent_1px),linear-gradient(90deg,oklch(0.76_0.1_80/.4)_1px,transparent_1px)] [background-size:22px_22px]" />
                <MapPin className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 text-gold drop-shadow" />
              </div>
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-cream/10 py-6 text-xs text-cream/50 md:flex-row">
          <p>© {new Date().getFullYear()} Manjar do Ramos. Todos os direitos reservados.</p>
          <p>Feito com alma em Portugal.</p>
        </div>
      </div>
    </footer>
  );
}