import Link from "next/link";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Crear cuenta",
  description: "Crea tu cuenta en HoneyMoon Hotel.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <section className="pt-36 pb-24 px-6">
        <div className="mx-auto max-w-md">
          <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--color-primary)]/80 text-center">
            Nueva cuenta
          </p>
          <h1 className="font-display text-4xl md:text-5xl mt-3 text-white text-center">
            Crea tu cuenta
          </h1>
          <p className="text-white/60 text-center mt-3">
            Reserva más rápido y mantén tu historial.
          </p>
          <div className="mt-10 rounded-2xl border border-white/10 bg-[var(--color-surface)] p-8">
            <RegisterForm />
          </div>
          <p className="text-white/60 text-sm text-center mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-[var(--color-primary)] hover:underline">
              Acceder
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
