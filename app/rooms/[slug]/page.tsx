import { notFound } from "next/navigation";
import Image from "next/image";
import { BedDouble, Users, Mountain, Wifi, Bath, Coffee, Sparkles, Tv, Snowflake, Lock, Car, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Badge } from "@/components/ui/badge";
import { RoomBookingPanel } from "@/components/rooms/room-booking-panel";
import { formatPEN } from "@/lib/utils";
import type { RoomCategory } from "@/lib/types/database";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("room_categories").select("name, description").eq("slug", slug).single();
  if (!data) return { title: "Habitación" };
  return {
    title: data.name,
    description: data.description ?? undefined,
    openGraph: { title: data.name, description: data.description ?? undefined },
  };
}

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  wifi: Wifi, bath: Bath, coffee: Coffee, sparkles: Sparkles, tv: Tv, snowflake: Snowflake, lock: Lock, car: Car,
};

export default async function RoomDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("room_categories").select("*").eq("slug", slug).eq("is_active", true).single();
  if (!data) notFound();
  const cat = data as RoomCategory;
  const gallery = cat.gallery_urls?.length ? cat.gallery_urls : [cat.thumbnail_url ?? `https://picsum.photos/seed/${cat.slug}/1600/1000`];

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <section className="pt-32 pb-24 px-6">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-[1.4fr_1fr] gap-10">
          <div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/5">
              <Image src={gallery[0]} alt={cat.name} fill sizes="(min-width:1024px) 60vw, 100vw" priority className="object-cover" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {gallery.slice(1, 4).map((src, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/5">
                  <Image src={src} alt={`${cat.name} ${i + 2}`} fill sizes="20vw" className="object-cover" />
                </div>
              ))}
            </div>

            <div className="mt-12">
              <Badge variant="gold">{cat.view_type} · {cat.floor_level}</Badge>
              <h1 className="font-display text-4xl md:text-6xl text-white mt-4">{cat.name}</h1>
              <p className="text-white/70 mt-4 text-lg leading-relaxed max-w-2xl">{cat.description}</p>
              <ul className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <Stat icon={<BedDouble size={16}/>} label="Cama" value={cat.bed_type} />
                <Stat icon={<Users size={16}/>} label="Capacidad" value={`Hasta ${cat.max_occupancy}`} />
                {cat.size_sqm && <Stat icon={<Mountain size={16}/>} label="Tamaño" value={`${cat.size_sqm} m²`} />}
                <Stat icon={<Clock size={16}/>} label="Check-in" value="15:00" />
              </ul>
            </div>

            <div className="mt-12">
              <h2 className="font-display text-2xl text-white">Amenidades incluidas</h2>
              <ul className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                {(cat.amenities ?? []).map((a, i) => {
                  const Icon = ICONS[a.toLowerCase()] ?? Sparkles;
                  return (
                    <li key={i} className="flex items-center gap-3 rounded-lg border border-white/5 bg-[var(--color-surface)] px-3 py-2.5 text-sm text-white/80">
                      <Icon size={16} className="text-[var(--color-primary)]" />
                      <span>{a}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-12">
              <h2 className="font-display text-2xl text-white">Políticas</h2>
              <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-sm text-white/70">
                <li className="rounded-lg border border-white/5 bg-[var(--color-surface)] px-4 py-3">
                  <strong className="text-white">Check-in:</strong> 15:00 · <strong className="text-white">Check-out:</strong> 11:00
                </li>
                <li className="rounded-lg border border-white/5 bg-[var(--color-surface)] px-4 py-3">
                  <strong className="text-white">Cancelación:</strong> Gratuita hasta 48h antes
                </li>
                <li className="rounded-lg border border-white/5 bg-[var(--color-surface)] px-4 py-3">
                  <strong className="text-white">Niños:</strong> Gratis hasta 6 años
                </li>
                <li className="rounded-lg border border-white/5 bg-[var(--color-surface)] px-4 py-3">
                  <strong className="text-white">Mascotas:</strong> No permitidas
                </li>
              </ul>
            </div>
          </div>

          <RoomBookingPanel category={cat} />
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <li className="rounded-xl border border-white/5 bg-[var(--color-surface)] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.22em] text-white/50 inline-flex items-center gap-1.5">
        <span className="text-[var(--color-primary)]">{icon}</span> {label}
      </p>
      <p className="text-white text-sm mt-1">{value}</p>
    </li>
  );
}

export { formatPEN as _ };
