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
    <section className="section relative overflow-hidden">
      <Image
        src="https://picsum.photos/seed/hm-stats/2400/1200"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-[var(--color-bg)]/80" />
      <div className="container-x relative grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 text-center">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`px-2 ${i > 0 ? "md:border-l md:border-white/10" : ""}`}
          >
            <div className="font-display text-[var(--color-primary)] leading-none text-[clamp(2.75rem,6vw,5.5rem)]">
              <span data-counter data-target={s.value}>0</span>
              <span>{s.suffix}</span>
            </div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/60 mt-4 leading-snug">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
