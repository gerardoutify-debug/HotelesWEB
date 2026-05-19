"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RoomCategory } from "@/lib/types/database";
import { formatPEN, todayISO, addDaysISO, diffNights } from "@/lib/utils";

export function RoomBookingPanel({ category }: { category: RoomCategory }) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(todayISO());
  const [checkOut, setCheckOut] = useState(addDaysISO(todayISO(), 2));
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [price, setPrice] = useState<number | null>(null);

  const nights = useMemo(() => diffNights(checkIn, checkOut), [checkIn, checkOut]);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      if (checkOut <= checkIn) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/availability?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${childrenCount}`);
        const json = await res.json();
        if (cancelled) return;
        const found = (json.results ?? []).find((r: { category: RoomCategory; price_per_night: number }) => r.category.id === category.id);
        setAvailable(Boolean(found));
        setPrice(found?.price_per_night ?? null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    check();
    return () => { cancelled = true; };
  }, [checkIn, checkOut, adults, childrenCount, category.id]);

  function bookNow() {
    const qs = new URLSearchParams({ checkIn, checkOut, adults: String(adults), children: String(childrenCount) });
    router.push(`/book?${qs.toString()}`);
  }

  const effectivePrice = price ?? Number(category.base_price_per_night);
  const subtotal = effectivePrice * nights;
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <aside className="lg:sticky lg:top-28 self-start">
      <div className="rounded-2xl border border-white/10 bg-[var(--color-surface)] p-6">
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/50">Desde</p>
        <p className="font-display text-4xl text-[var(--color-primary)] mt-1">
          {formatPEN(effectivePrice)}
          <span className="text-base text-white/40"> / noche</span>
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Field icon={<Calendar size={13}/>} label="Check-in">
            <input type="date" value={checkIn} min={todayISO()} onChange={(e) => setCheckIn(e.target.value)} className="bg-transparent outline-none w-full text-sm text-white [color-scheme:dark]" />
          </Field>
          <Field icon={<Calendar size={13}/>} label="Check-out">
            <input type="date" value={checkOut} min={addDaysISO(checkIn, 1)} onChange={(e) => setCheckOut(e.target.value)} className="bg-transparent outline-none w-full text-sm text-white [color-scheme:dark]" />
          </Field>
          <Field icon={<Users size={13}/>} label="Adultos">
            <input type="number" min={1} max={category.max_occupancy} value={adults} onChange={(e) => setAdults(parseInt(e.target.value || "1", 10))} className="bg-transparent outline-none w-full text-sm text-white" />
          </Field>
          <Field icon={<Users size={13}/>} label="Niños">
            <input type="number" min={0} max={4} value={childrenCount} onChange={(e) => setChildrenCount(parseInt(e.target.value || "0", 10))} className="bg-transparent outline-none w-full text-sm text-white" />
          </Field>
        </div>

        <div className="mt-6 space-y-2 text-sm text-white/70 border-t border-white/5 pt-6">
          <Row label={`${formatPEN(effectivePrice)} × ${nights} noches`} value={formatPEN(subtotal)} />
          <Row label="IGV (18%)" value={formatPEN(tax)} />
          <div className="my-2 border-t border-white/5" />
          <Row label="Total" value={formatPEN(total)} highlight />
        </div>

        <Button onClick={bookNow} className="w-full mt-6" disabled={available === false}>
          {loading ? <><Loader2 className="animate-spin" size={14}/> Verificando…</> : available === false ? "No disponible" : <>Reservar ahora <ArrowRight size={14}/></>}
        </Button>
        {available === false && (
          <p className="mt-3 text-xs text-amber-300 text-center">No hay habitaciones de esta categoría para esas fechas.</p>
        )}
      </div>
    </aside>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5">
      <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 inline-flex items-center gap-1.5">{icon}{label}</span>
      {children}
    </label>
  );
}
function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex justify-between gap-3 ${highlight ? "text-white" : ""}`}>
      <span className={highlight ? "" : "text-white/60"}>{label}</span>
      <span className={highlight ? "font-display text-xl text-[var(--color-primary)]" : ""}>{value}</span>
    </div>
  );
}
