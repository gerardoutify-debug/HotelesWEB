"use client";
import Image from "next/image";
import { useCounter } from "@/lib/hooks/useScrollAnimation";

const STATS = [
  { value: 25, suffix: "+", label: "Años de experiencia" },
  { value: 400, suffix: "+", label: "Huéspedes mensuales" },
  { value: 5, suffix: "★", label: "Rating promedio" },
  { value: 29, suffix: "", label: "Habitaciones exclusivas" },
];

export function Stats() {
  useCounter("[data-counter]");
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <Image
        src="https://picsum.photos/seed/hm-stats/2400/1200"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-[var(--color-bg)]/80" />
      <div className="relative mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6 text-center">
        {STATS.map((s) => (
          <div key={s.label} className="border-l border-white/10 first:border-l-0 md:border-l px-4">
            <div className="font-display text-5xl md:text-7xl text-[var(--color-primary)]">
              <span data-counter data-target={s.value}>0</span>
              <span>{s.suffix}</span>
            </div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/60 mt-3">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
