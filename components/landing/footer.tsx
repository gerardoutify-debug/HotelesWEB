import Link from "next/link";
import { Instagram, Facebook, MessageCircle, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[var(--color-surface)] border-t border-white/5 pt-20 pb-10">
      <div className="container-x grid md:grid-cols-3 gap-12 lg:gap-16">
        <div>
          <div className="font-display text-3xl text-[var(--color-primary)] tracking-[0.18em] leading-none">
            HoneyMoon
          </div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/50 mt-2">Hotel &amp; Spa</p>
          <p className="text-white/65 text-sm mt-6 leading-relaxed max-w-xs">
            Hotel boutique frente al Pacífico. Cinco categorías de habitaciones, una sola promesa: que cada noche valga ser recordada.
          </p>
          <div className="flex items-center gap-5 mt-6 text-white/60">
            <a aria-label="Instagram" href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[var(--color-primary)]">
              <Instagram size={18} />
            </a>
            <a aria-label="Facebook" href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[var(--color-primary)]">
              <Facebook size={18} />
            </a>
            <a aria-label="WhatsApp" href="https://wa.me/51999888777" target="_blank" rel="noreferrer" className="hover:text-[var(--color-primary)]">
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">Navegar</p>
          <ul className="mt-6 space-y-3 text-sm text-white/80">
            <li><Link href="/" className="hover:text-[var(--color-primary)]">Inicio</Link></li>
            <li><Link href="/rooms" className="hover:text-[var(--color-primary)]">Habitaciones</Link></li>
            <li><Link href="/book" className="hover:text-[var(--color-primary)]">Reservar</Link></li>
            <li><Link href="/reservations" className="hover:text-[var(--color-primary)]">Mis reservas</Link></li>
            <li><Link href="/login" className="hover:text-[var(--color-primary)]">Acceder</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">Contacto</p>
          <ul className="mt-6 space-y-4 text-sm text-white/80">
            <li className="flex items-start gap-3">
              <Phone size={16} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
              <span>+51 1 234-5678</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={16} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
              <a href="mailto:reservas@honeymoonhotel.pe" className="hover:text-[var(--color-primary)]">
                reservas@honeymoonhotel.pe
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
              <span>Malecón Cisneros 1420, Miraflores, Lima</span>
            </li>
          </ul>
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/40 mt-8">Horarios</p>
          <ul className="mt-4 text-sm text-white/70 space-y-1.5 leading-relaxed">
            <li>Recepción · 24/7</li>
            <li>Restaurante · 06:30 – 23:00</li>
            <li>Spa · 09:00 – 21:00</li>
            <li>Bar · 16:00 – 02:00</li>
          </ul>
        </div>
      </div>
      <div className="container-x mt-16 border-t border-white/5 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[11px] uppercase tracking-[0.25em] text-white/40">
        <p>© {new Date().getFullYear()} HoneyMoon Hotel — Todos los derechos reservados</p>
        <p>Política de privacidad · Términos</p>
      </div>
    </footer>
  );
}
