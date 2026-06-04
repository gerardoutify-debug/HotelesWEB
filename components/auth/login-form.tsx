"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Traduce los mensajes de Supabase (en inglés) a español amigable.
function traducirError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Correo o contraseña incorrectos.";
  if (m.includes("email not confirmed")) return "Debes confirmar tu correo antes de acceder. Revisa tu bandeja de entrada.";
  if (m.includes("too many requests") || m.includes("rate limit"))
    return "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.";
  if (m.includes("network") || m.includes("fetch")) return "Error de conexión. Verifica tu internet e inténtalo de nuevo.";
  return "No pudimos iniciar sesión. Inténtalo de nuevo.";
}

export function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirect = sp.get("redirect") ?? "/reservations";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(traducirError(err.message));
      return;
    }
    router.push(redirect);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <div>
        <Label htmlFor="email">Correo</Label>
        <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" />
      </div>
      <div>
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)] transition hover:text-[var(--color-primary)] focus:outline-none focus:text-[var(--color-primary)]"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      {error && <p className="text-red-300 text-sm">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? <><Loader2 className="animate-spin" size={14}/> Ingresando…</> : "Acceder"}
      </Button>
    </form>
  );
}
