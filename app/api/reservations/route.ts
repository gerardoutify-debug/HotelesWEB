import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { sendReservationEmail } from "@/lib/email/brevo";
import { diffNights } from "@/lib/utils";

export const dynamic = "force-dynamic";

const Body = z.object({
  category_id: z.string().uuid(),
  check_in_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  check_out_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  adults: z.coerce.number().int().min(1).max(8),
  children: z.coerce.number().int().min(0).max(8),
  guest_full_name: z.string().min(3).max(200),
  guest_email: z.string().email(),
  guest_phone: z.string().min(7).max(30).optional().or(z.literal("")),
  guest_document_number: z.string().max(50).optional().or(z.literal("")),
  special_requests: z.string().max(500).optional().or(z.literal("")),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;
  const nights = diffNights(data.check_in_date, data.check_out_date);
  if (nights < 1) {
    return NextResponse.json({ error: "Fechas inválidas" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // 1) Validate category + occupancy
  const { data: category, error: catErr } = await supabase
    .from("room_categories")
    .select("*")
    .eq("id", data.category_id)
    .eq("is_active", true)
    .single();
  if (catErr || !category) {
    return NextResponse.json({ error: "Categoría no disponible" }, { status: 404 });
  }
  if (category.max_occupancy < data.adults + data.children) {
    return NextResponse.json(
      { error: "La habitación no admite tantos huéspedes" },
      { status: 400 }
    );
  }

  // 2) Find free room
  const { data: rooms } = await supabase
    .from("rooms")
    .select("id")
    .eq("category_id", data.category_id)
    .eq("status", "available");
  if (!rooms?.length) {
    return NextResponse.json({ error: "Sin habitaciones físicas configuradas" }, { status: 409 });
  }

  const { data: overlap } = await supabase
    .from("reservations")
    .select("room_id")
    .in(
      "room_id",
      rooms.map((r) => r.id)
    )
    .not("status", "in", "(cancelled,no_show)")
    .lt("check_in_date", data.check_out_date)
    .gt("check_out_date", data.check_in_date);

  const occupied = new Set((overlap ?? []).map((o) => o.room_id));
  const freeRoom = rooms.find((r) => !occupied.has(r.id));
  if (!freeRoom) {
    return NextResponse.json(
      { error: "No hay disponibilidad para esas fechas" },
      { status: 409 }
    );
  }

  // 3) Compute price (server-side) with seasonal override
  const { data: seasonal } = await supabase
    .from("seasonal_pricing")
    .select("price_per_night, start_date, end_date")
    .eq("category_id", category.id)
    .eq("is_active", true)
    .lte("start_date", data.check_in_date)
    .gte("end_date", data.check_out_date)
    .order("start_date", { ascending: false })
    .limit(1);

  const pricePerNight =
    seasonal?.[0]?.price_per_night != null
      ? Number(seasonal[0].price_per_night)
      : Number(category.base_price_per_night);
  const subtotal = +(pricePerNight * nights).toFixed(2);
  const taxRate = 0.18;
  const taxAmount = +(subtotal * taxRate).toFixed(2);
  const total = +(subtotal + taxAmount).toFixed(2);

  // 4) Get user if authenticated
  const server = await createServerSupabase();
  const {
    data: { user },
  } = await server.auth.getUser();

  // 5) Insert reservation (admin client bypasses RLS)
  const { data: inserted, error: insErr } = await supabase
    .from("reservations")
    .insert({
      user_id: user?.id ?? null,
      room_id: freeRoom.id,
      category_id: category.id,
      guest_full_name: data.guest_full_name,
      guest_email: data.guest_email,
      guest_phone: data.guest_phone || null,
      guest_document_number: data.guest_document_number || null,
      check_in_date: data.check_in_date,
      check_out_date: data.check_out_date,
      adults: data.adults,
      children: data.children,
      price_per_night: pricePerNight,
      subtotal,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      total_amount: total,
      currency: "PEN",
      status: "confirmed",
      payment_status: "pending",
      special_requests: data.special_requests || null,
      source: "website",
      reservation_code: "TMP",
    })
    .select("*, room_categories(*), rooms(*)")
    .single();

  if (insErr || !inserted) {
    console.error("Reservation insert error", insErr);
    return NextResponse.json(
      { error: insErr?.message ?? "No se pudo crear la reserva" },
      { status: 500 }
    );
  }

  // 6) Send confirmation email (skips silently if BREVO_API_KEY missing)
  try {
    await sendReservationEmail(inserted as never);
  } catch (e) {
    console.error("Email send error", e);
  }

  return NextResponse.json({
    ok: true,
    reservation_code: inserted.reservation_code,
    id: inserted.id,
    total_amount: total,
  });
}
