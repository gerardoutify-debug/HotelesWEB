"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { RoomCategory } from "@/lib/types/database";
import { formatPEN } from "@/lib/utils";
import { useHorizontalScroll } from "@/lib/hooks/useScrollAnimation";

export function RoomsShowcase({ categories }: { categories: RoomCategory[] }) {
  useHorizontalScroll("hm-rooms-pin", "hm-rooms-track");
  const sorted = [...categories].sort((a, b) => Number(a.base_price_per_night) - Number(b.base_price_per_night));

  return (
    <section id="habitaciones" className="relative bg-[var(--color-bg)]">
      <div className="px-6 pt-24 pb-10">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--color-primary)]/80">
              Habitaciones
            </p>
            <h2 className="font-display text-4xl md:text-6xl mt-3 text-white">
              Cinco formas de quedarse
            </h2>
          </div>
          <p className="text-white/60 max-w-md">
            Desde la simplicidad serena hasta la suite HoneyMoon: cada espacio tiene un alma propia.
          </p>
        </div>
      </div>
      <div id="hm-rooms-pin" className="relative h-[100dvh] overflow-hidden">
        <div
          id="hm-rooms-track"
          className="absolute inset-0 flex items-center gap-6 pl-[7vw] pr-[7vw] md:gap-8 will-change-transform overflow-x-auto md:overflow-visible scrollbar-none snap-x snap-mandatory"
        >
          {sorted.map((c) => (
            <RoomCard key={c.id} c={c} />
          ))}
          <div className="shrink-0 w-[40vw] hidden md:block" />
        </div>
      </div>
    </section>
  );
}

function RoomCard({ c }: { c: RoomCategory }) {
  return (
    <article className="relative shrink-0 snap-center w-[82vw] sm:w-[60vw] md:w-[36vw] lg:w-[32vw] h-[72vh] rounded-2xl overflow-hidden border border-white/5 group">
      <Image
        src={c.thumbnail_url ?? `https://picsum.photos/seed/${c.slug}/1200/1600`}
        alt={c.name}
        fill
        sizes="(min-width: 1024px) 32vw, (min-width: 768px) 36vw, 82vw"
        className="object-cover scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute inset-0 p-7 flex flex-col justify-between">
        <div className="flex justify-between items-start text-[10px] uppercase tracking-[0.3em] text-white/70">
          <span>{c.view_type ?? ""}</span>
          <span>{c.bed_type}</span>
        </div>
        <div className="text-white">
          <h3 className="font-display text-3xl md:text-4xl leading-tight">{c.name}</h3>
          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/60">Desde</p>
              <p className="text-[var(--color-primary)] font-display text-2xl">
                {formatPEN(Number(c.base_price_per_night))} <span className="text-white/40 text-sm">/ noche</span>
              </p>
            </div>
            <Link
              href={`/rooms/${c.slug}`}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/80 hover:text-[var(--color-primary)] transition"
            >
              Ver detalles <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
