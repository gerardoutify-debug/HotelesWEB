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
    <section id="amenidades" className="section bg-[var(--color-bg)]">
      <div className="container-x grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <p className="eyebrow">Experiencia HoneyMoon</p>
          <h2 className="font-display text-white text-[clamp(2.25rem,5vw,4.5rem)] max-w-md mt-5">
            El hotel como destino.
          </h2>
          <ul className="mt-10 lg:mt-14 divide-y divide-white/10 border-y border-white/10">
            {ITEMS.map((it, i) => {
              const Icon = it.icon;
              const isActive = i === active;
              return (
                <li
                  key={it.id}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  tabIndex={0}
                  className={`group cursor-pointer py-5 transition-all duration-500 outline-none ${
                    isActive ? "opacity-100" : "opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Icon
                      className={`mt-1 transition-colors ${
                        isActive ? "text-[var(--color-primary)]" : "text-white/40"
                      }`}
                      size={20}
                    />
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-display text-2xl md:text-3xl transition-colors leading-tight ${
                          isActive ? "text-white" : "text-white/70"
                        }`}
                      >
                        {it.title}
                      </h3>
                      <AnimatePresence>
                        {isActive && (
                          <motion.p
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.4 }}
                            className="text-white/65 text-sm leading-relaxed overflow-hidden"
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
          </ul>
        </div>
        <div className="relative aspect-[3/4] lg:aspect-[4/5] rounded-2xl overflow-hidden border border-white/10">
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
                sizes="(min-width: 1024px) 50vw, 100vw"
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
