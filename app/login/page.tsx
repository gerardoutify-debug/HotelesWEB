import Link from "next/link";
import { Suspense } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Acceder",
  description: "Inicia sesión en tu cuenta de HoneyMoon Hotel.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <section className="pt-36 pb-24 px-6">
        <div className="mx-auto max-w-md">
          <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--color-primary)]/80 text-center">
            Cuenta
          </p>
          <h1 className="font-display text-4xl md:text-5xl mt-3 text-white text-center">
            Bienvenido de vuelta
          </h1>
          <p className="text-white/60 text-center mt-3">
            Accede para ver tus reservas y reservar más rápido.
          </p>
          <div className="mt-10 rounded-2xl border border-white/10 bg-[var(--color-surface)] p-8">
            <Suspense fallback={<div className="text-white/60 text-sm">Cargando…</div>}>
              <LoginForm />
            </Suspense>
          </div>
          <p className="text-white/60 text-sm text-center mt-6">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-[var(--color-primary)] hover:underline">
              Crear cuenta
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
