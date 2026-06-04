"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Calendar, Users, Check, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPEN, formatDate, todayISO, addDaysISO, diffNights } from "@/lib/utils";
import type { AvailabilityResult } from "@/lib/types/database";

const Schema = z.object({
  guest_full_name: z.string().min(3, "Mínimo 3 caracteres").max(200),
  guest_email: z.email("Correo inválido"),
  guest_phone: z.string().min(7, "Mínimo 7 caracteres").max(30).optional().or(z.literal("")),
  guest_document_number: z.string().max(50).optional().or(z.literal("")),
  special_requests: z.string().max(500).optional().or(z.literal("")),
});
type GuestForm = z.infer<typeof Schema>;

export function BookingFlow() {
  const router = useRouter();
  const sp = useSearchParams();

  const initialCheckIn = sp.get("checkIn") ?? todayISO();
  const initialCheckOut = sp.get("checkOut") ?? addDaysISO(initialCheckIn, 2);
  const initialAdults = parseInt(sp.get("adults") ?? "2", 10);
  const initialChildren = parseInt(sp.get("children") ?? "0", 10);

  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [adults, setAdults] = useState(initialAdults);
  const [childrenCount, setChildrenCount] = useState(initialChildren);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AvailabilityResult[]>([]);
  const [selected, setSelected] = useState<AvailabilityResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const nights = useMemo(() => diffNights(checkIn, checkOut), [checkIn, checkOut]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const url = `/api/availability?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${childrenCount}`;
        const res = await fetch(url);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "No se pudo cargar la disponibilidad");
        if (!cancelled) setResults(json.results ?? []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error desconocido");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [checkIn, checkOut, adults, childrenCount]);

  const form = useForm<GuestForm>({
    resolver: zodResolver(Schema),
    defaultValues: { guest_full_name: "", guest_email: "", guest_phone: "", guest_document_number: "", special_requests: "" },
  });

  async function confirm() {
    if (!selected) return;
    const values = form.getValues();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id: selected.category.id,
          check_in_date: checkIn,
          check_out_date: checkOut,
          adults,
          children: childrenCount,
          ...values,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "No se pudo confirmar la reserva");
      router.push(`/book/success/${json.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="mx-auto max-w-6xl">
        <StepsBar step={step} />
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45 }}
              className="grid lg:grid-cols-[1fr_320px] gap-10"
            >
              <section>
                <DateBar
                  checkIn={checkIn}
                  checkOut={checkOut}
                  adults={adults}
                  childrenCount={childrenCount}
                  onChange={({ ci, co, a, c }) => {
                    setCheckIn(ci);
                    setCheckOut(co);
                    setAdults(a);
                    setChildrenCount(c);
                    setSelected(null);
                  }}
                />
                <h2 className="font-display text-3xl md:text-4xl text-white mt-10">
                  Habitaciones disponibles
                </h2>
                <p className="text-white/60 text-sm mt-2">
                  {nights} noche{nights === 1 ? "" : "s"} · {formatDate(checkIn)} → {formatDate(checkOut)}
                </p>
                {loading && (
                  <div className="mt-10 flex items-center gap-3 text-white/60">
                    <Loader2 className="animate-spin" size={18} /> Buscando disponibilidad…
                  </div>
                )}
                {error && (
                  <p className="mt-6 text-red-300">{error}</p>
                )}
                {!loading && !error && results.length === 0 && (
                  <div className="mt-10 rounded-2xl border border-white/10 p-10 text-center">
                    <p className="text-white/70">No hay habitaciones disponibles para esas fechas. Prueba con otro rango.</p>
                  </div>
                )}
                <div className="mt-8 grid gap-6">
                  {results.map((r) => (
                    <RoomResultCard
                      key={r.category.id}
                      r={r}
                      selected={selected?.category.id === r.category.id}
                      onSelect={() => setSelected(r)}
                    />
                  ))}
                </div>
              </section>
              <Sidebar
                step={step}
                selected={selected}
                checkIn={checkIn}
                checkOut={checkOut}
                adults={adults}
                childrenCount={childrenCount}
                nights={nights}
                onNext={() => selected && setStep(2)}
                disabled={!selected}
              />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45 }}
              className="grid lg:grid-cols-[1fr_320px] gap-10"
            >
              <section>
                <h2 className="font-display text-3xl md:text-4xl text-white">
                  Tus datos
                </h2>
                <p className="text-white/60 text-sm mt-2">
                  Necesitamos algunos datos para preparar tu llegada.
                </p>
                <form className="mt-10 grid gap-6 max-w-2xl">
                  <div>
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input id="name" placeholder="Ej. Camila Pérez" {...form.register("guest_full_name")} />
                    {form.formState.errors.guest_full_name && (
                      <p className="mt-2 text-xs text-red-300">{form.formState.errors.guest_full_name.message}</p>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input id="email" type="email" placeholder="tucorreo@ejemplo.com" {...form.register("guest_email")} />
                      {form.formState.errors.guest_email && (
                        <p className="mt-2 text-xs text-red-300">{form.formState.errors.guest_email.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono (opcional)</Label>
                      <Input id="phone" type="tel" placeholder="+51 999 888 777" {...form.register("guest_phone")} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="doc">Documento (opcional)</Label>
                      <Input id="doc" placeholder="DNI / Pasaporte" {...form.register("guest_document_number")} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="req">Solicitudes especiales (opcional)</Label>
                    <Textarea id="req" placeholder="Cama extra, alergias, decoración para una ocasión especial…" {...form.register("special_requests")} />
                  </div>
                </form>
                <div className="mt-8 flex gap-3">
                  <Button variant="secondary" onClick={() => setStep(1)}>
                    <ArrowLeft size={14} /> Atrás
                  </Button>
                  <Button
                    onClick={async () => {
                      const ok = await form.trigger();
                      if (ok) setStep(3);
                    }}
                  >
                    Continuar <ArrowRight size={14} />
                  </Button>
                </div>
              </section>
              <Sidebar
                step={step}
                selected={selected}
                checkIn={checkIn}
                checkOut={checkOut}
                adults={adults}
                childrenCount={childrenCount}
                nights={nights}
                onNext={() => setStep(3)}
                disabled={false}
              />
            </motion.div>
          )}
          {step === 3 && selected && (
            <motion.div
              key="s3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45 }}
              className="grid lg:grid-cols-[1fr_320px] gap-10"
            >
              <section>
                <h2 className="font-display text-3xl md:text-4xl text-white">
                  Confirmación
                </h2>
                <p className="text-white/60 text-sm mt-2">
                  Revisa los detalles. Al confirmar, recibirás tu código de reserva por correo.
                </p>
                <div className="mt-10 rounded-2xl border border-white/10 bg-[var(--color-surface)] p-8 grid md:grid-cols-[180px_1fr] gap-6">
                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden">
                    <Image src={selected.category.thumbnail_url ?? `https://picsum.photos/seed/${selected.category.slug}/800/1000`} alt={selected.category.name} fill className="object-cover" sizes="180px" />
                  </div>
                  <div>
                    <Badge variant="gold">{selected.category.bed_type} · {selected.category.view_type}</Badge>
                    <h3 className="font-display text-2xl text-white mt-3">{selected.category.name}</h3>
                    <p className="text-white/60 text-sm mt-2">{selected.category.description}</p>
                    <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                      <Detail label="Check-in" value={`${formatDate(checkIn)} · 15:00`} />
                      <Detail label="Check-out" value={`${formatDate(checkOut)} · 11:00`} />
                      <Detail label="Huéspedes" value={`${adults} adultos · ${childrenCount} niños`} />
                      <Detail label="Habitación" value={`${selected.category.bed_type} · ${selected.category.size_sqm ?? "-"} m²`} />
                    </div>
                  </div>
                </div>
                <div className="mt-6 rounded-2xl border border-white/10 bg-[var(--color-surface)] p-8">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/50">Datos del huésped</p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm mt-3 text-white/80">
                    <Detail label="Nombre" value={form.getValues("guest_full_name")} />
                    <Detail label="Email" value={form.getValues("guest_email")} />
                    {form.getValues("guest_phone") && <Detail label="Teléfono" value={form.getValues("guest_phone") ?? ""} />}
                    {form.getValues("guest_document_number") && <Detail label="Documento" value={form.getValues("guest_document_number") ?? ""} />}
                  </div>
                  {(form.getValues("special_requests") ?? "").length > 0 && (
                    <p className="text-white/60 text-sm mt-4 italic">&ldquo;{form.getValues("special_requests")}&rdquo;</p>
                  )}
                </div>
                <div className="mt-6 rounded-2xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 p-8">
                  <PriceBreakdown selected={selected} nights={nights} />
                </div>
                {error && <p className="mt-4 text-red-300 text-sm">{error}</p>}
                <div className="mt-8 flex gap-3">
                  <Button variant="secondary" onClick={() => setStep(2)} disabled={submitting}>
                    <ArrowLeft size={14} /> Atrás
                  </Button>
                  <Button onClick={confirm} disabled={submitting}>
                    {submitting ? <><Loader2 className="animate-spin" size={14}/> Procesando…</> : <>Confirmar reserva <Check size={14} /></>}
                  </Button>
                </div>
              </section>
              <Sidebar
                step={step}
                selected={selected}
                checkIn={checkIn}
                checkOut={checkOut}
                adults={adults}
                childrenCount={childrenCount}
                nights={nights}
                onNext={confirm}
                disabled={submitting}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StepsBar({ step }: { step: number }) {
  const steps = ["Habitación", "Datos del huésped", "Confirmación"];
  return (
    <ol className="mb-10 grid grid-cols-3 gap-2 max-w-2xl">
      {steps.map((s, i) => {
        const n = i + 1;
        const active = step === n;
        const done = step > n;
        return (
          <li key={s} className="flex items-center gap-3">
            <span className={`h-8 w-8 inline-flex items-center justify-center rounded-full border text-xs ${
              active ? "border-[var(--color-primary)] text-[var(--color-primary)]" : done ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-[var(--color-text-inverse)]" : "border-white/15 text-white/40"
            }`}>
              {done ? <Check size={14} /> : n}
            </span>
            <span className={`text-[11px] uppercase tracking-[0.2em] ${active || done ? "text-white" : "text-white/40"}`}>{s}</span>
          </li>
        );
      })}
    </ol>
  );
}

function DateBar({
  checkIn, checkOut, adults, childrenCount, onChange,
}: {
  checkIn: string; checkOut: string; adults: number; childrenCount: number;
  onChange: (v: { ci: string; co: string; a: number; c: number }) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[var(--color-surface)] p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
      <DateField icon={<Calendar size={14}/>} label="Check-in" value={checkIn} min={todayISO()} onChange={(v) => onChange({ ci: v, co: v >= checkOut ? addDaysISO(v, 1) : checkOut, a: adults, c: childrenCount })} />
      <DateField icon={<Calendar size={14}/>} label="Check-out" value={checkOut} min={addDaysISO(checkIn, 1)} onChange={(v) => onChange({ ci: checkIn, co: v, a: adults, c: childrenCount })} />
      <NumField icon={<Users size={14}/>} label="Adultos" value={adults} min={1} max={6} onChange={(v) => onChange({ ci: checkIn, co: checkOut, a: v, c: childrenCount })} />
      <NumField icon={<Users size={14}/>} label="Niños" value={childrenCount} min={0} max={4} onChange={(v) => onChange({ ci: checkIn, co: checkOut, a: adults, c: v })} />
    </div>
  );
}

function DateField({ icon, label, value, min, onChange }: { icon: React.ReactNode; label: string; value: string; min: string; onChange: (v: string) => void; }) {
  return (
    <label className="flex flex-col gap-1 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5">
      <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 flex items-center gap-1.5">{icon}{label}</span>
      <input type="date" value={value} min={min} onChange={(e) => onChange(e.target.value)} className="bg-transparent outline-none text-sm text-white [color-scheme:dark]" />
    </label>
  );
}
function NumField({ icon, label, value, min, max, onChange }: { icon: React.ReactNode; label: string; value: number; min: number; max: number; onChange: (v: number) => void; }) {
  return (
    <label className="flex flex-col gap-1 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5">
      <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 flex items-center gap-1.5">{icon}{label}</span>
      <input type="number" min={min} max={max} value={value} onChange={(e) => onChange(Math.min(max, Math.max(min, parseInt(e.target.value || `${min}`, 10))))} className="bg-transparent outline-none text-sm text-white" />
    </label>
  );
}

function RoomResultCard({ r, selected, onSelect }: { r: AvailabilityResult; selected: boolean; onSelect: () => void; }) {
  const c = r.category;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`text-left grid md:grid-cols-[260px_1fr_auto] gap-6 rounded-2xl border p-4 transition-all ${
        selected
          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-[0_8px_30px_rgba(201,169,110,0.18)]"
          : "border-white/10 bg-[var(--color-surface)] hover:border-[var(--color-primary)]/40"
      }`}
    >
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
        <Image src={c.thumbnail_url ?? `https://picsum.photos/seed/${c.slug}/800/600`} alt={c.name} fill sizes="260px" className="object-cover" />
      </div>
      <div>
        <Badge variant="gold">{c.bed_type} · {c.view_type ?? "vista"}</Badge>
        <h3 className="font-display text-2xl text-white mt-2">{c.name}</h3>
        <p className="text-white/60 text-sm mt-1 line-clamp-2">{c.description}</p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/60">
          <li>Hasta {c.max_occupancy} huéspedes</li>
          {c.size_sqm && <li>{c.size_sqm} m²</li>}
          <li>{r.available_rooms} disponibles</li>
        </ul>
      </div>
      <div className="md:text-right">
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/50">{r.nights} noches</p>
        <p className="font-display text-3xl text-[var(--color-primary)] mt-1">{formatPEN(r.total_price)}</p>
        <p className="text-[11px] text-white/50 mt-1">IGV incluido</p>
        <p className="text-xs text-white/60 mt-3">{formatPEN(r.price_per_night)} / noche</p>
        <span className={`mt-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.22em] ${selected ? "text-[var(--color-primary)]" : "text-white/70"}`}>
          {selected ? <><Check size={14}/> Seleccionada</> : "Elegir"}
        </span>
      </div>
    </button>
  );
}

function Sidebar({
  step, selected, checkIn, checkOut, adults, childrenCount, nights, onNext, disabled,
}: {
  step: number;
  selected: AvailabilityResult | null;
  checkIn: string;
  checkOut: string;
  adults: number;
  childrenCount: number;
  nights: number;
  onNext: () => void;
  disabled: boolean;
}) {
  return (
    <aside className="lg:sticky lg:top-28 self-start">
      <div className="rounded-2xl border border-white/10 bg-[var(--color-surface)] p-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-white/50">Resumen</p>
        <h3 className="font-display text-2xl text-white mt-2">
          {selected ? selected.category.name : "Selecciona una habitación"}
        </h3>
        <ul className="mt-6 space-y-3 text-sm text-white/80">
          <li className="flex justify-between gap-3 border-b border-white/5 pb-3"><span className="text-white/50">Check-in</span><span>{formatDate(checkIn)}</span></li>
          <li className="flex justify-between gap-3 border-b border-white/5 pb-3"><span className="text-white/50">Check-out</span><span>{formatDate(checkOut)}</span></li>
          <li className="flex justify-between gap-3 border-b border-white/5 pb-3"><span className="text-white/50">Noches</span><span>{nights}</span></li>
          <li className="flex justify-between gap-3"><span className="text-white/50">Huéspedes</span><span>{adults} + {childrenCount}</span></li>
        </ul>
        {selected && (
          <div className="mt-6 pt-6 border-t border-white/5">
            <PriceBreakdown selected={selected} nights={nights} compact />
          </div>
        )}
        {step < 3 && (
          <Button onClick={onNext} disabled={disabled} className="w-full mt-6">
            {step === 1 ? "Continuar" : "Revisar"} <ArrowRight size={14} />
          </Button>
        )}
      </div>
    </aside>
  );
}

function PriceBreakdown({ selected, nights, compact }: { selected: AvailabilityResult; nights: number; compact?: boolean }) {
  return (
    <div className={compact ? "text-sm" : ""}>
      <Row label={`${formatPEN(selected.price_per_night)} × ${nights} noches`} value={formatPEN(selected.subtotal)} />
      <Row label="IGV (18%)" value={formatPEN(selected.tax_amount)} />
      <div className="my-3 border-t border-white/10" />
      <Row label="Total" value={formatPEN(selected.total_price)} highlight />
    </div>
  );
}
function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex justify-between gap-3 ${highlight ? "text-white" : "text-white/70"}`}>
      <span className={highlight ? "" : "text-white/60"}>{label}</span>
      <span className={highlight ? "font-display text-2xl text-[var(--color-primary)]" : ""}>{value}</span>
    </div>
  );
}
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.22em] text-white/50">{label}</p>
      <p className="text-white mt-1">{value}</p>
    </div>
  );
}
