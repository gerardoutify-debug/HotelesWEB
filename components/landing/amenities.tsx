"use client";
import { useState } from "react";
import Image from "next/image";
import { Waves, Sparkles, UtensilsCrossed, Dumbbell, Car } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const ITEMS = [
  { id: "pool", icon: Waves, title: "Piscina Infinity", desc: "Fusiona el horizonte con el océano real.", img: "https://picsum.photos/seed/hm-pool/1400/1800" },
  { id: "spa", icon: Sparkles, title: "Spa & Wellness", desc: "Rituales de bienestar inspirados en tradiciones andinas.", img: "https://picsum.photos/seed/hm-spa/1400/1800" },
  { id: "dining", icon: UtensilsCrossed, title: "Restaurante Mariscos", desc: "Ingredientes del mar a tu mesa, capturados cada mañana.", img: "https://picsum.photos/seed/hm-dining/1400/1800" },
  { id: "gym", icon: Dumbbell, title: "Fitness 24h", desc: "Equipos de última generación con vista al mar.", img: "https://picsum.photos/seed/hm-gym/1400/1800" },
  { id: "concierge", icon: Car, title: "Concierge & Transfer", desc: "Tu tiempo es lo más valioso. Nosotros nos encargamos del resto.", img: "https://picsum.photos/seed/hm-concierge/1400/1800" },
];

export function Amenities() {
  const [active, setActive] = useState(0);
  return (
    <section id="amenidades" className="relative py-32 md:py-40 px-6 bg-[var(--color-bg)]">
      <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--color-primary)]/80">
            Experiencia HoneyMoon
          </p>
          <h2 className="font-display text-4xl md:text-6xl mt-3 text-white max-w-md">
            El hotel como destino.
          </h2>
          <ul className="mt-12 space-y-2">
            {ITEMS.map((it, i) => {
              const Icon = it.icon;
              const isActive = i === active;
              return (
                <li
                  key={it.id}
                  onMouseEnter={() => setActive(i)}
                  className={`group cursor-pointer border-t border-white/10 py-5 transition-all duration-500 ${
                    isActive ? "pl-2" : "pl-0 opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Icon className={`mt-1 transition-colors ${isActive ? "text-[var(--color-primary)]" : "text-white/40"}`} size={20} />
                    <div className="flex-1">
                      <h3 className={`font-display text-2xl md:text-3xl transition-colors ${isActive ? "text-white" : "text-white/70"}`}>
                        {it.title}
                      </h3>
                      <AnimatePresence>
                        {isActive && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4 }}
                            className="text-white/60 text-sm mt-2 overflow-hidden"
                          >
                            {it.desc}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </li>
              );
            })}
            <li className="border-t border-white/10" />
          </ul>
        </div>
        <div className="relative aspect-[3/4] md:aspect-[4/5] rounded-2xl overflow-hidden border border-white/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={ITEMS[active].id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={ITEMS[active].img}
                alt={ITEMS[active].title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
