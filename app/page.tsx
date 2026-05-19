import { createClient } from "@/lib/supabase/server";
import type { RoomCategory } from "@/lib/types/database";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Intro } from "@/components/landing/intro";
import { RoomsShowcase } from "@/components/landing/rooms-showcase";
import { Amenities } from "@/components/landing/amenities";
import { Stats } from "@/components/landing/stats";
import { Gallery } from "@/components/landing/gallery";
import { Testimonials } from "@/components/landing/testimonials";
import { Location } from "@/components/landing/location";
import { FinalCTA } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";

export const revalidate = 600;

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("room_categories")
    .select("*")
    .eq("is_active", true)
    .order("base_price_per_night", { ascending: true });
  const categories = (data ?? []) as RoomCategory[];

  return (
    <main className="bg-[var(--color-bg)] text-[var(--color-text)]">
      <Navbar />
      <Hero />
      <Intro />
      <RoomsShowcase categories={categories} />
      <Amenities />
      <Stats />
      <Gallery />
      <Testimonials />
      <Location />
      <FinalCTA />
      <Footer />
    </main>
  );
}
