# HoneyMoon Hotel · Setup

## Stack

- Next.js 16.2 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4 (CSS-first `@theme`)
- Supabase (Postgres + Auth + RLS)
- Motion (Framer Motion v12) + GSAP ScrollTrigger
- React Hook Form + Zod
- Brevo (transactional email)

## Variables de entorno

Copia `.env.local.example` a `.env.local`. Solo `BREVO_API_KEY` queda pendiente:

```
NEXT_PUBLIC_SUPABASE_URL=https://qhkpxpbcbbonpgctpyym.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...        # ya provisto en .env.local
SUPABASE_SERVICE_ROLE_KEY=...            # ya provisto en .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_HOTEL_NAME="HoneyMoon Hotel"
BREVO_API_KEY=                           # pega tu API key de Brevo
BREVO_SENDER_EMAIL=reservas@honeymoonhotel.pe
BREVO_SENDER_NAME=HoneyMoon Hotel
```

## Base de datos

La base ya está aplicada en el proyecto Supabase `HoneyMoon` (ref `qhkpxpbcbbonpgctpyym`).

Si quieres reproducirla:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/seed.sql`

Ejecuta cualquiera de las dos opciones:

- Vía Supabase SQL Editor (copia/pega).
- Vía CLI: `npx supabase db push` o `npx supabase db reset --linked`.

Categorías incluidas (precios PEN):

| Slug          | Nombre             | Desde   |
| ------------- | ------------------ | ------- |
| simple        | Simple             | 320     |
| matrimonial   | Matrimonial        | 540     |
| luxury        | Luxury             | 980     |
| presidencial  | Presidencial       | 1600    |
| honeymoon     | HoneyMoon Suite    | 2800    |

## Desarrollo

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Estructura

```
app/
  page.tsx                          Landing con 11 secciones (GSAP scroll)
  book/page.tsx                     Flujo de reserva 3 pasos
  book/success/[code]/page.tsx      Confirmación
  rooms/page.tsx                    Catálogo
  rooms/[slug]/page.tsx             Detalle
  reservations/page.tsx             Mis reservas (auth requerido)
  login/page.tsx · register/page.tsx
  api/availability/route.ts         GET disponibilidad
  api/reservations/route.ts         POST crear reserva + email
components/
  landing/*                         Hero, Intro, RoomsShowcase, Amenities, Stats, Gallery, Testimonials, Location, FinalCTA, Footer, Navbar
  booking/booking-flow.tsx
  rooms/*
  reservations/*
  auth/*
  ui/*                              Button, Input, Badge (shadcn-style con Radix Slot)
lib/
  supabase/{server,client,admin}.ts
  hooks/useScrollAnimation.ts       GSAP helpers (respeta prefers-reduced-motion)
  email/brevo.ts                    Plantilla HTML + envío via API Brevo
  types/database.ts
  utils.ts
middleware.ts                       Protege /reservations
supabase/migrations/001_initial_schema.sql
supabase/seed.sql
```

## Checklist de calidad

- [x] Landing con scroll inmersivo GSAP (hero reveal, parallax, horizontal pinned rooms, word reveal, clip reveal, counters)
- [x] Widget de reserva en hero — redirige a `/book` con query params
- [x] `/api/availability` consulta Supabase y `check_room_availability`
- [x] Flujo `/book` 3 pasos persiste en DB con email Brevo
- [x] `/reservations` con tabs Próximas/En curso/Completadas/Canceladas
- [x] Rutas protegidas redirigen al login
- [x] Tailwind v4 dark + Cormorant Garamond + Inter
- [x] `prefers-reduced-motion` respetado en hooks GSAP y globals.css
- [x] Schema SQL: tablas, RLS, triggers, funciones, índices
- [x] TypeScript sin errores (`npm run build`)
- [x] Responsive (mobile-first)
- [x] Navbar transparente → glass-strong al hacer scroll
- [ ] `BREVO_API_KEY` por definir en `.env.local`
