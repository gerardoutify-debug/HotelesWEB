import { Suspense } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { BookingFlow } from "@/components/booking/booking-flow";

export const metadata = {
  title: "Reservar",
  description: "Reserva tu habitación en HoneyMoon Hotel en tres simples pasos.",
};

export default function BookPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <Suspense fallback={<div className="pt-40 text-center text-white/60">Cargando…</div>}>
        <BookingFlow />
      </Suspense>
      <Footer />
    </main>
  );
}
