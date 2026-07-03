import { MapPin, Clock, Phone, Instagram, Facebook, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo-cream.png";
import { useRestaurante, useNavPages } from "@/hooks/useSiteConfig";

export function Footer() {
  const r = useRestaurante();
  const navPages = useNavPages();
  const footerLinks = navPages.filter(
    (p) => p.visible && p.key !== "a-minha-conta" && p.key !== "auth",
  );
  const logoSrc = r.logo || logo;

  return (
    <footer className="bg-charcoal pt-20 text-cream/80">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <img src={logoSrc} alt="Manjar do Ramos" className="h-24 max-w-[240px] object-contain" />
            <p className="mt-5 text-sm leading-relaxed">
              Sabores portugueses com alma de taberna. Feitos para partilhar, saborear e voltar.
            </p>
            <div className="mt-5 flex gap-3">
              {r.social.instagram.visible && (
                <a
                  href={r.social.instagram.url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="rounded-full border border-cream/20 p-2.5 transition-colors hover:border-gold hover:text-gold"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {r.social.facebook.visible && (
                <a
                  href={r.social.facebook.url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="rounded-full border border-cream/20 p-2.5 transition-colors hover:border-gold hover:text-gold"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {r.social.tripadvisor.visible && (
                <a
                  href={r.social.tripadvisor.url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TripAdvisor"
                  className="rounded-full border border-cream/20 p-2.5 transition-colors hover:border-gold hover:text-gold"
                >
                  <Star className="h-4 w-4" />
                </a>
              )}
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {footerLinks.map((l) => (
                <li key={l.key}>
                  {l.route ? (
                    <Link to={l.href} className="transition-colors hover:text-gold">
                      {l.label}
                    </Link>
                  ) : (
                    <a href={l.href} className="transition-colors hover:text-gold">
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-xl text-cream">Contactos</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gold" />
                <a
                  href={`tel:${r.telefone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-gold"
                >
                  {r.telefone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-gold" /> {r.morada}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-xl text-cream">Horário</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 text-gold" />
                <div>
                  <p className="font-medium text-cream">Restaurante</p>
                  <span>{r.horarioRestaurante || r.horario}</span>
                </div>
              </li>
              {r.horarioPatio && (
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 text-gold" />
                  <div>
                    <p className="font-medium text-cream">Pátio</p>
                    <span>{r.horarioPatio}</span>
                  </div>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-xl text-cream">Localização</h3>
            {r.googleMapsEmbed ? (
              <div className="mt-4 overflow-hidden rounded-xl border border-cream/15">
                <iframe
                  src={r.googleMapsEmbed}
                  className="h-32 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <a
                href={r.googleMapsUrl || "#"}
                target="_blank"
                rel="noreferrer"
                aria-label="Ver localização no mapa"
                className="mt-4 block overflow-hidden rounded-xl border border-cream/15"
              >
                <div className="relative h-32 w-full bg-[radial-gradient(circle_at_30%_40%,oklch(0.3_0.04_50),oklch(0.19_0.012_60))]">
                  <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(oklch(0.76_0.1_80/.4)_1px,transparent_1px),linear-gradient(90deg,oklch(0.76_0.1_80/.4)_1px,transparent_1px)] [background-size:22px_22px]" />
                  <MapPin className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 text-gold drop-shadow" />
                </div>
              </a>
            )}
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
