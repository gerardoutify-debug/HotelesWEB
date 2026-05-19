"use client";
import Image from "next/image";
import { MapPin, ExternalLink } from "lucide-react";

export function Location() {
  return (
    <section id="contacto" className="section relative">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="https://picsum.photos/seed/hm-map/2400/1200"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg)] via-[var(--color-bg)]/85 to-transparent" />
      </div>
      <div className="container-x relative">
        <p className="eyebrow">Ubicación</p>
        <h2 className="font-display text-white text-[clamp(2.25rem,5vw,4.5rem)] max-w-2xl mt-5 leading-[1.05]">
          Donde el malecón abraza el océano.
        </h2>
        <div className="mt-10 max-w-xl space-y-8">
          <div className="flex items-start gap-3 text-white/85">
            <MapPin className="mt-1 shrink-0 text-[var(--color-primary)]" size={18} />
            <p className="text-base md:text-lg leading-relaxed">
              Malecón Cisneros 1420, Miraflores, Lima, Perú
            </p>
          </div>
          <ul className="grid grid-cols-3 gap-6 text-white/80">
            <li>
              <p className="text-[var(--color-primary)] font-display text-3xl md:text-4xl leading-none">15&apos;</p>
              <p className="text-[11px] uppercase tracking-[0.2em] mt-2 text-white/60">Aeropuerto</p>
            </li>
            <li>
              <p className="text-[var(--color-primary)] font-display text-3xl md:text-4xl leading-none">5&apos;</p>
              <p className="text-[11px] uppercase tracking-[0.2em] mt-2 text-white/60">Larcomar</p>
            </li>
            <li>
              <p className="text-[var(--color-primary)] font-display text-3xl md:text-4xl leading-none">3&apos;</p>
              <p className="text-[11px] uppercase tracking-[0.2em] mt-2 text-white/60">Mar</p>
            </li>
          </ul>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Mal%C3%A9con+Cisneros+1420+Miraflores+Lima"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[var(--color-primary)] text-xs uppercase tracking-[0.24em] hover:text-[var(--color-primary-hover)]"
          >
            Ver en Google Maps <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
