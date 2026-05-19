import { createClient } from "@/lib/supabase/server";
import type { RoomCategory } from "@/lib/types/database";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { RoomsCatalog } from "@/components/rooms/rooms-catalog";

export const revalidate = 300;
export const metadata = {
  title: "Habitaciones",
  description: "Explora todas las habitaciones y suites de HoneyMoon Hotel.",
};

export default async function RoomsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("room_categories")
    .select("*")
    .eq("is_active", true)
    .order("base_price_per_night", { ascending: true });
  const categories = (data ?? []) as RoomCategory[];

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <section className="pt-36 pb-12 px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--color-primary)]/80">
            Catálogo
          </p>
          <h1 className="font-display text-5xl md:text-7xl mt-3 text-white text-balance">
            Cinco maneras de habitar HoneyMoon.
          </h1>
          <p className="text-white/60 mt-4 max-w-xl">
            Filtra por vista, capacidad y precio para encontrar la habitación perfecta.
          </p>
        </div>
      </section>
      <RoomsCatalog categories={categories} />
      <Footer />
    </main>
  );
}
