"use client";
import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useClipReveal } from "@/lib/hooks/useScrollAnimation";

const PICS = [
  { src: "https://picsum.photos/seed/hm-gal-1/1600/2000", alt: "Lobby", area: "md:col-span-1 md:row-span-2 aspect-[3/4]" },
  { src: "https://picsum.photos/seed/hm-gal-2/1400/1000", alt: "Suite", area: "aspect-[4/3]" },
  { src: "https://picsum.photos/seed/hm-gal-3/1400/1000", alt: "Restaurante", area: "aspect-[4/3]" },
  { src: "https://picsum.photos/seed/hm-gal-4/2400/900", alt: "Piscina", area: "md:col-span-2 aspect-[16/6]" },
];

export function Gallery() {
  useClipReveal("[data-clip]");
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="relative py-32 px-6 bg-[var(--color-bg)]">
      <div className="mx-auto max-w-7xl">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--color-primary)]/80 text-center">
          Galería
        </p>
        <h2 className="font-display text-4xl md:text-6xl mt-3 text-white text-center">
          La casa que mira al océano
        </h2>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4">
          {PICS.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setOpen(i)}
              data-clip
              className={`relative ${p.area} overflow-hidden rounded-2xl group border border-white/5 reveal-clip`}
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
          ))}
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
