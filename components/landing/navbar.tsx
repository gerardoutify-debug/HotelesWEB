"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/#habitaciones", label: "Habitaciones" },
  { href: "/#amenidades", label: "Hotel" },
  { href: "/rooms", label: "Catálogo" },
  { href: "/#contacto", label: "Contacto" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled ? "glass-strong py-2 md:py-3" : "py-2 md:py-5 bg-transparent"
      )}
    >
      <div className="container-x flex items-center justify-between gap-6">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 shrink-0 transition-colors duration-500",
            scrolled ? "text-[var(--color-primary)]" : "text-white"
          )}
        >
          <Image
            src="/images/logo.png"
            alt="HoneyMoon Hotel logo"
            width={76}
            height={76}
            style={{ width: "clamp(46px, 8vw, 76px)", height: "clamp(46px, 8vw, 76px)" }}
            priority
            className={cn(
              "shrink-0 object-contain transition-all duration-500 translate-y-[7px] translate-x-[15px]",
              scrolled ? "" : "brightness-0 invert"
            )}
          />
          <span className="font-display text-2xl md:text-[1.6rem] tracking-[0.18em] leading-none">
            HoneyMoon
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[11px] uppercase tracking-[0.22em] text-white/80 hover:text-[var(--color-primary)] transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="text-[11px] uppercase tracking-[0.22em] text-white/60 hover:text-[var(--color-primary)] transition-colors"
          >
            Acceder
          </Link>
          <Link
            href="/book"
            className="rounded-full border border-[var(--color-primary)] px-5 py-2.5 text-[10px] uppercase tracking-[0.24em] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-text-inverse)] transition-colors"
          >
            Reservar
          </Link>
        </nav>
        <button
          aria-label="Menú"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-white p-2 -mr-2"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden glass-strong border-t border-white/5 mt-3">
          <div className="container-x flex flex-col gap-3 py-6">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-[0.2em] text-white/80 py-1"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="text-sm uppercase tracking-[0.2em] text-white/60 py-1"
            >
              Acceder
            </Link>
            <Link
              href="/book"
              onClick={() => setOpen(false)}
              className="mt-3 text-center rounded-full border border-[var(--color-primary)] px-5 py-3 text-sm uppercase tracking-[0.2em] text-[var(--color-primary)]"
            >
              Reservar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
