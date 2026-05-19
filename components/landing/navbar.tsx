"use client";
import Link from "next/link";
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "glass-strong py-3"
          : "py-6 bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        <Link
          href="/"
          className={cn(
            "font-display text-2xl tracking-[0.18em] transition-colors duration-500",
            scrolled ? "text-[var(--color-primary)]" : "text-white"
          )}
        >
          HoneyMoon
        </Link>
        <nav className="hidden md:flex items-center gap-10">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[12px] uppercase tracking-[0.2em] text-white/80 hover:text-[var(--color-primary)] transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="text-[12px] uppercase tracking-[0.2em] text-white/60 hover:text-[var(--color-primary)] transition-colors"
          >
            Acceder
          </Link>
          <Link
            href="/book"
            className="rounded-full border border-[var(--color-primary)] px-5 py-2 text-[11px] uppercase tracking-[0.22em] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-text-inverse)] transition-colors"
          >
            Reservar
          </Link>
        </nav>
        <button
          aria-label="Menú"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-white p-2"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden glass-strong border-t border-white/5 px-6 py-6 flex flex-col gap-4">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm uppercase tracking-[0.18em] text-white/80"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="text-sm uppercase tracking-[0.18em] text-white/60"
          >
            Acceder
          </Link>
          <Link
            href="/book"
            onClick={() => setOpen(false)}
            className="text-center rounded-full border border-[var(--color-primary)] px-5 py-3 text-sm uppercase tracking-[0.18em] text-[var(--color-primary)]"
          >
            Reservar
          </Link>
        </div>
      )}
    </header>
  );
}
