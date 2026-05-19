"use client";
import Image from "next/image";
import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="section-lg relative overflow-hidden">
      <Image
        src="https://picsum.photos/seed/hm-sunset/2400/1400"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/70 to-[var(--color-bg)]/40" />
      <div className="container-narrow relative text-center">
        <p className="eyebrow">Reserva</p>
        <h2 className="font-display text-white text-balance text-[clamp(2.5rem,6vw,5rem)] mt-5 leading-[1.05]">
          Tu próxima historia comienza aquí.
        </h2>
        <p className="mt-7 text-white/75 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
          Disponibilidad en tiempo real para los próximos 12 meses. Sin filas, sin esperas: una experiencia diseñada para sentirse íntima desde el primer clic.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/book"
            className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-text-inverse)] px-10 py-4 text-xs md:text-sm uppercase tracking-[0.22em] hover:bg-[var(--color-primary-hover)] transition-all shadow-[0_18px_60px_rgba(201,169,110,0.35)]"
          >
            Reservar ahora
          </Link>
          <Link
            href="/rooms"
            className="inline-flex items-center justify-center rounded-full border border-white/30 text-white px-10 py-4 text-xs md:text-sm uppercase tracking-[0.22em] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition"
          >
            Explorar habitaciones
          </Link>
        </div>
      </div>
    </section>
  );
}
