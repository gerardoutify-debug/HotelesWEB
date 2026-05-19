"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BedDouble, Users, Mountain } from "lucide-react";
import { motion } from "motion/react";
import type { RoomCategory } from "@/lib/types/database";
import { formatPEN } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const VIEWS = [
  { value: "all", label: "Todas" },
  { value: "ocean", label: "Océano" },
  { value: "garden", label: "Jardín" },
  { value: "pool", label: "Piscina" },
  { value: "city", label: "Ciudad" },
];
const CAPACITY = [
  { value: "all", label: "Cualquiera" },
  { value: "1-2", label: "1-2" },
  { value: "3-4", label: "3-4" },
  { value: "5+", label: "5+" },
];
const BEDS = [
  { value: "all", label: "Todas" },
  { value: "King", label: "King" },
  { value: "Queen", label: "Queen" },
  { value: "Twin", label: "Twin" },
];

export function RoomsCatalog({ categories }: { categories: RoomCategory[] }) {
  const prices = categories.map((c) => Number(c.base_price_per_night));
  const min = Math.min(...prices, 0);
  const max = Math.max(...prices, 5000);
  const [view, setView] = useState("all");
  const [cap, setCap] = useState("all");
  const [bed, setBed] = useState("all");
  const [maxPrice, setMaxPrice] = useState(max);
  const [sort, setSort] = useState<"price_asc" | "price_desc" | "size">("price_asc");

  const filtered = useMemo(() => {
    let r = categories.filter((c) => {
      if (view !== "all" && c.view_type !== view) return false;
      if (bed !== "all" && c.bed_type !== bed) return false;
      if (cap === "1-2" && c.max_occupancy > 2) return false;
      if (cap === "3-4" && (c.max_occupancy < 3 || c.max_occupancy > 4)) return false;
      if (cap === "5+" && c.max_occupancy < 5) return false;
      if (Number(c.base_price_per_night) > maxPrice) return false;
      return true;
    });
    r = [...r].sort((a, b) => {
      if (sort === "price_asc") return Number(a.base_price_per_night) - Number(b.base_price_per_night);
      if (sort === "price_desc") return Number(b.base_price_per_night) - Number(a.base_price_per_night);
      if (sort === "size") return Number(b.size_sqm ?? 0) - Number(a.size_sqm ?? 0);
      return 0;
    });
    return r;
  }, [categories, view, cap, bed, maxPrice, sort]);

  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-[280px_1fr] gap-10">
        <aside className="lg:sticky lg:top-28 self-start space-y-6">
          <FilterGroup label="Vista" options={VIEWS} value={view} setValue={setView} />
          <FilterGroup label="Capacidad" options={CAPACITY} value={cap} setValue={setCap} />
          <FilterGroup label="Cama" options={BEDS} value={bed} setValue={setBed} />
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/50 mb-3">Precio máximo</p>
            <input type="range" min={min} max={max} value={maxPrice} step={50} onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))} className="w-full accent-[var(--color-primary)]"/>
            <p className="mt-2 text-sm text-white/80">{formatPEN(maxPrice)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/50 mb-3">Ordenar</p>
            <select value={sort} onChange={(e) => setSort(e.target.value as "price_asc" | "price_desc" | "size")} className="w-full bg-[var(--color-surface)] border border-white/10 rounded-lg h-11 px-3 text-sm text-white">
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
              <option value="size">Tamaño</option>
            </select>
          </div>
        </aside>
        <div>
          <p className="text-white/60 text-sm mb-6">{filtered.length} habitación{filtered.length === 1 ? "" : "es"}</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {filtered.map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Link href={`/rooms/${c.slug}`} className="block group rounded-2xl border border-white/5 bg-[var(--color-surface)] overflow-hidden hover:border-[var(--color-primary)]/40 transition-all">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={c.thumbnail_url ?? `https://picsum.photos/seed/${c.slug}/1200/900`} alt={c.name} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute top-3 left-3">
                      <Badge variant="gold">{c.view_type}</Badge>
                    </div>
                  </div>
                  <div className="p-5">
                    <h2 className="font-display text-2xl text-white">{c.name}</h2>
                    <p className="text-white/60 text-sm mt-1 line-clamp-2">{c.description}</p>
                    <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/60">
                      <li className="inline-flex items-center gap-1"><BedDouble size={13}/> {c.bed_type}</li>
                      <li className="inline-flex items-center gap-1"><Users size={13}/> Hasta {c.max_occupancy}</li>
                      {c.size_sqm && <li className="inline-flex items-center gap-1"><Mountain size={13}/> {c.size_sqm} m²</li>}
                    </ul>
                    <div className="mt-5 pt-4 border-t border-white/5 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.22em] text-white/50">Desde</p>
                        <p className="font-display text-2xl text-[var(--color-primary)]">{formatPEN(Number(c.base_price_per_night))}<span className="text-sm text-white/40"> /noche</span></p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.22em] text-white/70 group-hover:text-[var(--color-primary)] transition">
                        Ver detalle <ArrowRight size={13}/>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterGroup<T extends string>({ label, options, value, setValue }: { label: string; options: { value: T; label: string }[]; value: T; setValue: (v: T) => void; }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.22em] text-white/50 mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setValue(o.value)}
            className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-[0.18em] border transition ${
              value === o.value
                ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/10"
                : "border-white/10 text-white/70 hover:border-white/30"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
