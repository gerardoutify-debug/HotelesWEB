"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { RoomCategory } from "@/lib/types/database";
import { formatPEN } from "@/lib/utils";

export function RoomsShowcase({ categories }: { categories: RoomCategory[] }) {
  const sorted = [...categories].sort(
    (a, b) => Number(a.base_price_per_night) - Number(b.base_price_per_night)
  );

  return (
    <section id="habitaciones" className="section bg-[var(--color-bg)]">
      <div className="container-x">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-10">
          <div className="stack">
            <p className="eyebrow">Habitaciones</p>
            <h2 className="font-display text-white text-[clamp(2.25rem,5vw,4.5rem)]">
              Cinco formas de quedarse
            </h2>
          </div>
          <p className="text-white/60 max-w-md leading-relaxed">
            Desde la simplicidad serena hasta la suite HoneyMoon: cada espacio tiene un alma propia.
          </p>
        </div>

        <div className="mt-12 md:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((c) => (
            <RoomCard key={c.id} c={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RoomCard({ c }: { c: RoomCategory }) {
  return (
    <Link
      href={`/rooms/${c.slug}`}
      className="group relative block rounded-2xl overflow-hidden border border-white/5 bg-[var(--color-surface)] aspect-[3/4] sm:aspect-[4/5]"
    >
      <Image
        src={c.thumbnail_url ?? `https://picsum.photos/seed/${c.slug}/1200/1600`}
        alt={c.name}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute inset-0 p-6 md:p-7 flex flex-col justify-between text-white">
        <div className="flex justify-between items-start text-[10px] uppercase tracking-[0.3em] text-white/70">
          <span>{c.view_type ?? ""}</span>
          <span>{c.bed_type}</span>
        </div>
        <div className="stack">
          <h3 className="font-display text-2xl md:text-3xl lg:text-4xl leading-tight">
            {c.name}
          </h3>
          <div className="flex items-end justify-between gap-4 pt-1">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/60">Desde</p>
              <p className="text-[var(--color-primary)] font-display text-2xl mt-1">
                {formatPEN(Number(c.base_price_per_night))}{" "}
                <span className="text-white/40 text-sm">/ noche</span>
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/80 group-hover:text-[var(--color-primary)] transition">
              Detalles <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
