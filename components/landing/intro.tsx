"use client";
import { useWordReveal } from "@/lib/hooks/useScrollAnimation";

const PHRASE = "No es solo un hotel. Es la versión más refinada de un instante perfecto.";

export function Intro() {
  useWordReveal("#hm-intro");
  const words = PHRASE.split(" ");
  return (
    <section
      id="intro"
      className="section bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-surface)] to-[var(--color-bg)]"
    >
      <div className="container-narrow text-center">
        <p className="eyebrow mb-8">Bienvenido a HoneyMoon</p>
        <p
          id="hm-intro"
          className="font-display text-white/90 text-balance text-[clamp(1.625rem,4vw,3.25rem)] leading-[1.25]"
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
