"use client";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const ITEMS = [
  {
    quote:
      "Una experiencia que no se olvida. Cada detalle, desde la cena privada hasta los pétalos en la cama, fue impecable.",
    name: "Camila & Diego",
    origin: "Buenos Aires, Argentina",
  },
  {
    quote:
      "Llegamos esperando un hotel y encontramos un refugio. El equipo se anticipó a cada deseo antes de que lo pidiéramos.",
    name: "Sophie Laurent",
    origin: "París, Francia",
  },
  {
    quote:
      "La suite HoneyMoon es lo más cercano a flotar sobre el océano. Volveremos cada aniversario.",
    name: "Marco & Elena",
    origin: "Milán, Italia",
  },
  {
    quote:
      "Diseño, gastronomía y servicio al nivel de los mejores boutique del mundo. Una joya en la costa peruana.",
    name: "Andrew Kim",
    origin: "Seúl, Corea del Sur",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % ITEMS.length), 5500);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="relative py-32 px-6 bg-[var(--color-surface)] overflow-hidden">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--color-primary)]/80">
          Reseñas
        </p>
        <div className="mt-10 min-h-[260px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1] }}
            >
              <span className="font-display text-7xl text-[var(--color-primary)]/60 block leading-none">”</span>
              <blockquote className="font-display italic text-2xl md:text-4xl text-white/90 leading-snug mt-4 text-balance">
                {ITEMS[i].quote}
              </blockquote>
              <div className="mt-8">
                <p className="text-white text-sm tracking-[0.2em] uppercase">{ITEMS[i].name}</p>
                <p className="text-white/50 text-xs mt-1">{ITEMS[i].origin}</p>
                <div className="flex items-center justify-center gap-1 mt-3 text-[var(--color-primary)]">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-10 flex justify-center gap-2">
          {ITEMS.map((_, k) => (
            <button
              key={k}
              onClick={() => setI(k)}
              aria-label={`Testimonio ${k + 1}`}
              className={`h-1 rounded-full transition-all ${k === i ? "bg-[var(--color-primary)] w-10" : "bg-white/20 w-4"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
