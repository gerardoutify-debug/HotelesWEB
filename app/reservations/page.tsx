import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { ReservationsList } from "@/components/reservations/reservations-list";
import type { Reservation } from "@/lib/types/database";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Mis reservas",
  description: "Historial y reservas próximas en HoneyMoon Hotel.",
};

export default async function ReservationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/reservations");

  // Use admin for clean reads (RLS already enforces ownership, but service role is safe here on server)
  const admin = createAdminClient();
  const { data } = await admin
    .from("reservations")
    .select("*, room_categories(*), rooms(*)")
    .eq("user_id", user.id)
    .order("check_in_date", { ascending: false });

  const reservations = (data ?? []) as Reservation[];

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <section className="pt-36 pb-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--color-primary)]/80">
                Mi cuenta
              </p>
              <h1 className="font-display text-4xl md:text-6xl mt-3 text-white">Mis reservas</h1>
              <p className="text-white/60 mt-3">Hola{user.user_metadata?.full_name ? ` ${String(user.user_metadata.full_name).split(" ")[0]}` : ""}, estas son tus reservas.</p>
            </div>
            <Button asChild>
              <Link href="/book">Nueva reserva</Link>
            </Button>
          </div>
          <div className="mt-12">
            {reservations.length === 0 ? (
              <EmptyState />
            ) : (
              <ReservationsList reservations={reservations} />
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[var(--color-surface)] p-16 text-center">
      <p className="text-white/60">Aún no tienes reservas.</p>
      <Button asChild className="mt-6">
        <Link href="/book">Hacer mi primera reserva</Link>
      </Button>
    </div>
  );
}
