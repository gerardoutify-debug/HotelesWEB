"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, ArrowRight, Minus, Plus } from "lucide-react";
import { todayISO, addDaysISO } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export function BookingWidget({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(todayISO());
  const [checkOut, setCheckOut] = useState(addDaysISO(todayISO(), 2));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [guestsOpen, setGuestsOpen] = useState(false);

  function submit() {
    setError(null);
    if (!checkIn || !checkOut) return setError("Selecciona ambas fechas");
    if (checkIn < todayISO()) return setError("La fecha de entrada no puede ser pasada");
    if (checkOut <= checkIn) return setError("La salida debe ser posterior a la entrada");
    const qs = new URLSearchParams({
      checkIn,
      checkOut,
      adults: String(adults),
      children: String(children),
    });
    router.push(`/book?${qs.toString()}`);
  }

  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.9, ease: [0.7, 0, 0.2, 1] }}
      className={`glass rounded-2xl border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.5)] ${
        compact ? "p-4" : "p-3 md:p-4"
      } relative z-30 max-w-3xl w-full`}
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-2">
        <Field label="Check-in" icon={<Calendar size={14} />}>
          <input
            type="date"
            value={checkIn}
            min={todayISO()}
            onChange={(e) => setCheckIn(e.target.value)}
            className="bg-transparent outline-none w-full text-sm text-white pl-1 [color-scheme:dark]"
          />
        </Field>
        <Field label="Check-out" icon={<Calendar size={14} />}>
          <input
            type="date"
            value={checkOut}
            min={addDaysISO(checkIn, 1)}
            onChange={(e) => setCheckOut(e.target.value)}
            className="bg-transparent outline-none w-full text-sm text-white pl-1 [color-scheme:dark]"
          />
        </Field>
        <Field label="Huéspedes" icon={<Users size={14} />}>
          <button
            type="button"
            onClick={() => setGuestsOpen((v) => !v)}
            className="w-full text-left text-sm text-white pl-1"
          >
            {adults} adultos · {children} niños
          </button>
        </Field>
        <button
          type="button"
          onClick={submit}
          className="h-full min-h-[64px] inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] text-[var(--color-text-inverse)] px-6 text-sm font-medium tracking-wide hover:bg-[var(--color-primary-hover)] transition-all shadow-[0_8px_30px_rgba(201,169,110,0.25)]"
        >
          Buscar habitaciones
          <ArrowRight size={16} />
        </button>
      </div>
      <AnimatePresence>
        {guestsOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-4 px-3 pt-4 pb-1">
              <Counter label="Adultos" value={adults} setValue={(v) => setAdults(Math.max(1, v))} min={1} max={6} />
              <Counter label="Niños" value={children} setValue={(v) => setChildren(Math.max(0, v))} min={0} max={4} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {error && (
        <p className="mt-3 px-3 text-xs text-red-300">{error}</p>
      )}
    </motion.div>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 px-4 py-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:border-[var(--color-primary)]/30 transition-colors">
      <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 flex items-center gap-1.5">
        {icon} {label}
      </span>
      {children}
    </label>
  );
}

function Counter({ label, value, setValue, min, max }: { label: string; value: number; setValue: (v: number) => void; min: number; max: number }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2">
      <span className="text-xs uppercase tracking-[0.18em] text-white/70">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setValue(Math.max(min, value - 1))}
          className="h-7 w-7 rounded-full border border-white/15 text-white/70 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] inline-flex items-center justify-center transition"
        >
          <Minus size={12} />
        </button>
        <span className="w-5 text-center text-sm text-white">{value}</span>
        <button
          type="button"
          onClick={() => setValue(Math.min(max, value + 1))}
          className="h-7 w-7 rounded-full border border-white/15 text-white/70 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] inline-flex items-center justify-center transition"
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  );
}
