// Rate limiter en memoria (ventana fija por clave/IP).
//
// Nota: el estado vive en el proceso, así que el límite es POR INSTANCIA del
// servidor. En un único servidor (Railway, VPS, dev) protege bien. Si algún día
// escalas a varias instancias serverless, conviene migrar a un store compartido
// (Upstash Redis). Para el tamaño de este sitio, esto es una defensa sólida.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000; // cota de memoria: purga si crece demasiado

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfter: number; // segundos hasta poder reintentar
};

export function rateLimit(opts: {
  key: string;
  limit: number;
  windowMs: number;
}): RateLimitResult {
  const { key, limit, windowMs } = opts;
  const now = Date.now();

  // Purga perezosa de buckets expirados para que el Map no crezca sin límite.
  if (buckets.size > MAX_BUCKETS) {
    for (const [k, b] of buckets) {
      if (now > b.resetAt) buckets.delete(k);
    }
  }

  const existing = buckets.get(key);
  if (!existing || now > existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  if (existing.count >= limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count += 1;
  return { ok: true, remaining: limit - existing.count, retryAfter: 0 };
}

// Extrae la IP del cliente respetando los headers de proxy (Railway/Vercel).
export function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
