"use client";
import { useWordReveal } from "@/lib/hooks/useScrollAnimation";

const PHRASE = "No es solo un hotel. Es la versión más refinada de un instante perfecto.";

export function Intro() {
  useWordReveal("#hm-intro");
  const words = PHRASE.split(" ");
  return (
    <section
      id="intro"
      className="relative py-32 md:py-48 px-6 bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-surface)] to-[var(--color-bg)]"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-[11px] uppercase tracking-[0.45em] text-[var(--color-primary)]/80 mb-8">
          Bienvenido a HoneyMoon
        </p>
        <p
          id="hm-intro"
          className="font-display text-[clamp(1.75rem,4.5vw,3.5rem)] leading-[1.18] text-white/90 text-balance"
        >
          {words.map((w, i) => (
            <span key={i} data-w className="inline-block opacity-25 mr-[0.22em]">
              {w}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
