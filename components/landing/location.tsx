"use client";
import Image from "next/image";
import { MapPin, ExternalLink } from "lucide-react";

export function Location() {
  return (
    <section id="contacto" className="relative py-32 px-6">
      <div className="absolute inset-0">
        <Image
          src="https://picsum.photos/seed/hm-map/2400/1200"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg)] via-[var(--color-bg)]/85 to-transparent" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--color-primary)]/80">
          Ubicación
        </p>
        <h2 className="font-display text-4xl md:text-6xl mt-3 text-white max-w-2xl">
          Donde el malecón abraza el océano.
        </h2>
        <div className="mt-12 max-w-xl space-y-6">
          <div className="flex items-start gap-3 text-white/80">
            <MapPin className="mt-1 text-[var(--color-primary)]" size={18} />
            <p className="text-lg">Malecón Cisneros 1420, Miraflores, Lima, Perú</p>
          </div>
          <ul className="grid grid-cols-3 gap-6 text-white/80">
            <li>
              <p className="text-[var(--color-primary)] font-display text-3xl">15&apos;</p>
              <p className="text-xs uppercase tracking-[0.18em] mt-1">Aeropuerto</p>
            </li>
            <li>
              <p className="text-[var(--color-primary)] font-display text-3xl">5&apos;</p>
              <p className="text-xs uppercase tracking-[0.18em] mt-1">Larcomar</p>
            </li>
            <li>
              <p className="text-[var(--color-primary)] font-display text-3xl">3&apos;</p>
              <p className="text-xs uppercase tracking-[0.18em] mt-1">Mar</p>
            </li>
          </ul>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Mal%C3%A9con+Cisneros+1420+Miraflores+Lima"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[var(--color-primary)] text-sm uppercase tracking-[0.22em] hover:text-[var(--color-primary-hover)]"
          >
            Ver en Google Maps <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
