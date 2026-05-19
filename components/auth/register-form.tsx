"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (data.session) {
      router.push("/reservations");
      router.refresh();
    } else {
      setInfo("Cuenta creada. Revisa tu correo para confirmar la cuenta antes de acceder.");
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <div>
        <Label htmlFor="name">Nombre completo</Label>
        <Input id="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ej. Camila Pérez" />
      </div>
      <div>
        <Label htmlFor="email">Correo</Label>
        <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" />
      </div>
      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" required autoComplete="new-password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
      </div>
      {error && <p className="text-red-300 text-sm">{error}</p>}
      {info && <p className="text-emerald-300 text-sm">{info}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? <><Loader2 className="animate-spin" size={14}/> Creando cuenta…</> : "Crear cuenta"}
      </Button>
    </form>
  );
}
