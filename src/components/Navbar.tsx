import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo-cream.png";
import { useAuth } from "@/hooks/useAuth";
import { User as UserIcon, LogOut } from "lucide-react";

type NavLink = { label: string; href: string; route?: boolean };

const links: NavLink[] = [
  { label: "Conceito", href: "/#conceito" },
  { label: "Ementa", href: "/ementa", route: true },
  { label: "Encomendas", href: "/encomendas", route: true },
  { label: "Catering", href: "/catering", route: true },
  { label: "Espaço", href: "/#espaco" },
  { label: "Testemunhos", href: "/#testemunhos" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "bg-charcoal/95 backdrop-blur-md shadow-soft"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10 md:py-5">
        <Link to="/" className="flex items-center gap-3 leading-none text-cream">
          <img
            src={logo}
            alt="Manjar do Ramos"
            className="h-14 w-auto md:h-16"
          />
          <span className="sr-only">Manjar do Ramos · Taberna Portuguesa</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) =>
            l.route ? (
              <Link
                key={l.href}
                to={l.href}
                className="text-sm font-medium text-cream/85 transition-colors hover:text-gold"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-cream/85 transition-colors hover:text-gold"
              >
                {l.label}
              </a>
            ),
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/minhas-encomendas"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-cream/85 transition-colors hover:text-gold"
              >
                <UserIcon className="h-4 w-4" /> A minha conta
              </Link>
              <button
                onClick={() => signOut()}
                className="text-cream/60 transition-colors hover:text-gold"
                aria-label="Sair"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-cream/85 transition-colors hover:text-gold"
            >
              <UserIcon className="h-4 w-4" /> Entrar
            </Link>
          )}
          <a
            href="/#reservar"
            className="rounded-full border border-gold/70 px-5 py-2 text-sm font-semibold text-gold transition-all hover:bg-gold hover:text-charcoal"
          >
            Reservar Mesa
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Menu"
        >
          <span className={`h-0.5 w-6 bg-cream transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-cream transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-cream transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="overflow-hidden bg-charcoal/98 px-5 pb-6 md:hidden"
        >
          <div className="flex flex-col gap-4 pt-2">
            {links.map((l) =>
              l.route ? (
                <Link
                  key={l.href}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-cream/90"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-cream/90"
                >
                  {l.label}
                </a>
              ),
            )}
            {user ? (
              <>
                <Link
                  to="/minhas-encomendas"
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-cream/90"
                >
                  A minha conta
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                  className="text-left text-base font-medium text-cream/70"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="text-base font-medium text-cream/90"
              >
                Entrar / Criar conta
              </Link>
            )}
            <a
              href="/#reservar"
              onClick={() => setOpen(false)}
              className="text-base font-medium text-gold"
            >
              Reservar Mesa
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}