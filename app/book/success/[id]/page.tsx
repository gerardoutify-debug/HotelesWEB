import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPEN, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

// El lookup se hace por el UUID aleatorio de la reserva (no por el código
// secuencial HM-00001, que era adivinable). El UUID actúa como un "token de
// acceso": solo lo conoce quien hizo la reserva (lo recibe al confirmar). Esto
// cierra la fuga de datos personales por enumeración de códigos.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const supabase = createAdminClient();
  const { data: reservation } = await supabase
    .from("reservations")
    .select("*, room_categories(*), rooms(*)")
    .eq("id", id)
    .single();

  if (!reservation) notFound();
  const cat = reservation.room_categories;

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <section className="pt-36 pb-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary)]">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="font-display text-4xl md:text-6xl text-white mt-6 text-balance">
            ¡Tu reserva está confirmada!
          </h1>
          <p className="text-white/60 mt-4 max-w-xl mx-auto">
            Gracias {reservation.guest_full_name}, te enviamos los detalles a <span className="text-[var(--color-primary)]">{reservation.guest_email}</span>.
          </p>
          <div className="mt-10 inline-block rounded-2xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 px-10 py-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">Código de reserva</p>
            <p className="font-display text-4xl text-[var(--color-primary)] mt-2">{reservation.reservation_code}</p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl mt-16 rounded-2xl border border-white/10 bg-[var(--color-surface)] p-8 md:p-10">
          <div className="flex items-center justify-between flex-wrap gap-3 border-b border-white/5 pb-6">
            <div>
              <Badge variant="gold">{cat?.bed_type} · {cat?.view_type}</Badge>
              <h2 className="font-display text-3xl text-white mt-3">{cat?.name}</h2>
            </div>
            <Badge variant="success">{reservation.status === "confirmed" ? "Confirmada" : reservation.status}</Badge>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <Info label="Check-in" value={`${formatDate(reservation.check_in_date)} · 15:00`} />
            <Info label="Check-out" value={`${formatDate(reservation.check_out_date)} · 11:00`} />
            <Info label="Noches" value={`${reservation.nights}`} />
            <Info label="Huéspedes" value={`${reservation.adults} adultos · ${reservation.children} niños`} />
            <Info label="Habitación" value={`${reservation.rooms?.room_number ?? "Asignada al check-in"}`} />
            <Info label="Total" value={formatPEN(Number(reservation.total_amount))} highlight />
          </div>
          {reservation.special_requests && (
            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">Solicitudes</p>
              <p className="text-white/80 italic mt-2">&ldquo;{reservation.special_requests}&rdquo;</p>
            </div>
          )}
        </div>

        <div className="mx-auto max-w-3xl mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/reservations">Ver mis reservas</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Info({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.22em] text-white/50">{label}</p>
      <p className={highlight ? "font-display text-2xl text-[var(--color-primary)] mt-1" : "text-white mt-1"}>{value}</p>
    </div>
  );
}
