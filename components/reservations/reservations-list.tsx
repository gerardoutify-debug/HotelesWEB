"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Calendar, ArrowRight, X, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import type { Reservation } from "@/lib/types/database";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatPEN } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const TABS = [
  { id: "upcoming", label: "Próximas" },
  { id: "active", label: "En curso" },
  { id: "past", label: "Completadas" },
  { id: "cancelled", label: "Canceladas" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const STATUS_VARIANTS: Record<Reservation["status"], "warn" | "success" | "info" | "danger" | "default"> = {
  pending: "warn",
  confirmed: "success",
  checked_in: "info",
  checked_out: "default",
  cancelled: "danger",
  no_show: "danger",
};

const STATUS_LABELS: Record<Reservation["status"], string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  checked_in: "En curso",
  checked_out: "Completada",
  cancelled: "Cancelada",
  no_show: "No show",
};

export function ReservationsList({ reservations }: { reservations: Reservation[] }) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [tab, setTab] = useState<TabId>("upcoming");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const upcoming: Reservation[] = [];
    const active: Reservation[] = [];
    const past: Reservation[] = [];
    const cancelled: Reservation[] = [];
    for (const r of reservations) {
      if (r.status === "cancelled" || r.status === "no_show") cancelled.push(r);
      else if (r.status === "checked_in" || (r.check_in_date <= today && r.check_out_date > today)) active.push(r);
      else if (r.status === "checked_out" || r.check_out_date <= today) past.push(r);
      else upcoming.push(r);
    }
    return { upcoming, active, past, cancelled };
  }, [reservations, today]);

  const list = grouped[tab];

  async function cancelReservation(id: string) {
    if (!confirm("¿Cancelar esta reserva? Esta acción no se puede deshacer.")) return;
    setCancellingId(id);
    const supabase = createClient();
    await supabase
      .from("reservations")
      .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
      .eq("id", id);
    setCancellingId(null);
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-white/10 mb-8">
        {TABS.map((t) => {
          const count = grouped[t.id].length;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-xs uppercase tracking-[0.22em] border-b-2 transition ${
                active ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "border-transparent text-white/60 hover:text-white"
              }`}
            >
              {t.label} <span className="ml-1 opacity-60">({count})</span>
            </button>
          );
        })}
      </div>
      {list.length === 0 ? (
        <p className="text-white/50 py-16 text-center">No tienes reservas en esta categoría.</p>
      ) : (
        <ul className="grid gap-5">
          {list.map((r) => {
            const cat = r.room_categories;
            const canCancel =
              (r.status === "pending" || r.status === "confirmed") &&
              new Date(r.check_in_date).getTime() - Date.now() > 48 * 3600 * 1000;
            return (
              <motion.li
                key={r.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-white/10 bg-[var(--color-surface)] p-4 md:p-6 grid md:grid-cols-[160px_1fr_auto] gap-6"
              >
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
                  <Image src={cat?.thumbnail_url ?? `https://picsum.photos/seed/${cat?.slug ?? r.id}/600/450`} alt={cat?.name ?? "Habitación"} fill sizes="160px" className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant={STATUS_VARIANTS[r.status]}>{STATUS_LABELS[r.status]}</Badge>
                    <span className="text-[11px] uppercase tracking-[0.22em] text-white/50">{r.reservation_code}</span>
                  </div>
                  <h3 className="font-display text-2xl text-white mt-2">{cat?.name ?? "Habitación"}</h3>
                  <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/60">
                    <li className="inline-flex items-center gap-1.5"><Calendar size={14}/> {formatDate(r.check_in_date)} → {formatDate(r.check_out_date)}</li>
                    <li>{r.nights} noche{r.nights === 1 ? "" : "s"}</li>
                    <li>{r.adults} + {r.children}</li>
                  </ul>
                </div>
                <div className="md:text-right flex md:flex-col items-end justify-between gap-2">
                  <p className="font-display text-2xl text-[var(--color-primary)]">{formatPEN(Number(r.total_amount))}</p>
                  <div className="flex items-center gap-3">
                    <Button asChild variant="secondary" size="sm">
                      <a href={`/book/success/${r.reservation_code}`}>Detalles <ArrowRight size={13}/></a>
                    </Button>
                    {canCancel && (
                      <button
                        onClick={() => cancelReservation(r.id)}
                        className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-red-300"
                        disabled={cancellingId === r.id}
                      >
                        {cancellingId === r.id ? <Loader2 className="animate-spin" size={13}/> : <X size={13}/>} Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
