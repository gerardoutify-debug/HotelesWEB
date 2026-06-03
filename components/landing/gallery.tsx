"use client";
import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useClipReveal } from "@/lib/hooks/useScrollAnimation";

const PICS = [
  { src: "/images/lobby.jpeg", alt: "Lobby" },
  { src: "/images/suite.jpeg", alt: "Suite" },
  { src: "/images/restaurant.jpeg", alt: "Restaurante" },
  { src: "/images/piscinas.jpeg", alt: "Piscina" },
];

export function Gallery() {
  useClipReveal("[data-clip]");
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="section bg-[var(--color-bg)]">
      <div className="container-x">
        <div className="text-center max-w-2xl mx-auto">
          <p className="eyebrow">Galería</p>
          <h2 className="font-display text-white text-[clamp(2.25rem,5vw,4.5rem)] mt-5">
            La casa que mira al océano
          </h2>
        </div>
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 md:auto-rows-[18rem]">
          {PICS.map((p, i) => {
            const span =
              i === 0
                ? "md:row-span-2"
                : i === 3
                ? "md:col-span-2"
                : "";
            return (
              <button
                key={i}
                type="button"
                onClick={() => setOpen(i)}
                data-clip
                className={`relative ${span} ${i === 0 ? "h-[28rem] md:h-auto" : "h-72 md:h-auto"} overflow-hidden rounded-2xl group border border-white/5`}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute bottom-4 left-4 text-white text-sm uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
                  {p.alt}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setOpen(null)}
        >
          <button
            type="button"
            onClick={() => setOpen(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white"
          >
            <X size={28} />
          </button>
          <div className="relative w-full h-full max-w-6xl max-h-[85vh]">
            <Image src={PICS[open].src} alt={PICS[open].alt} fill className="object-contain" />
          </div>
        </div>
      )}
    </section>
  );
}
