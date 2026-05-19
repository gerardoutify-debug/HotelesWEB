import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { RoomCategory, AvailabilityResult } from "@/lib/types/database";
import { diffNights } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const adults = Math.max(1, parseInt(searchParams.get("adults") ?? "1", 10));
  const children = Math.max(0, parseInt(searchParams.get("children") ?? "0", 10));

  if (!checkIn || !checkOut) {
    return NextResponse.json({ error: "checkIn and checkOut are required" }, { status: 400 });
  }
  const today = new Date().toISOString().slice(0, 10);
  if (checkIn < today) {
    return NextResponse.json({ error: "checkIn must be today or later" }, { status: 400 });
  }
  if (checkOut <= checkIn) {
    return NextResponse.json({ error: "checkOut must be after checkIn" }, { status: 400 });
  }

  const guests = adults + children;
  const nights = diffNights(checkIn, checkOut);
  const supabase = createAdminClient();

  // 1) Find categories that fit occupancy
  const { data: categories, error: catErr } = await supabase
    .from("room_categories")
    .select("*")
    .eq("is_active", true)
    .gte("max_occupancy", guests)
    .order("base_price_per_night", { ascending: true });

  if (catErr) {
    return NextResponse.json({ error: catErr.message }, { status: 500 });
  }
  if (!categories?.length) {
    return NextResponse.json({ results: [], nights });
  }

  // 2) Fetch rooms + active reservations overlapping
  const categoryIds = categories.map((c: RoomCategory) => c.id);
  const { data: rooms } = await supabase
    .from("rooms")
    .select("id, category_id, status")
    .in("category_id", categoryIds)
    .eq("status", "available");

  const { data: overlap } = await supabase
    .from("reservations")
    .select("room_id, status, check_in_date, check_out_date")
    .in("category_id", categoryIds)
    .not("status", "in", "(cancelled,no_show)")
    .lt("check_in_date", checkOut)
    .gt("check_out_date", checkIn);

  const occupiedRoomIds = new Set((overlap ?? []).map((r) => r.room_id));

  // 3) Seasonal pricing
  const { data: seasonal } = await supabase
    .from("seasonal_pricing")
    .select("category_id, price_per_night, start_date, end_date")
    .in("category_id", categoryIds)
    .eq("is_active", true)
    .lte("start_date", checkIn)
    .gte("end_date", checkOut)
    .order("start_date", { ascending: false });

  const seasonalByCat = new Map<string, number>();
  for (const s of seasonal ?? []) {
    if (!seasonalByCat.has(s.category_id)) {
      seasonalByCat.set(s.category_id, Number(s.price_per_night));
    }
  }

  const results: AvailabilityResult[] = [];
  for (const cat of categories as RoomCategory[]) {
    const free = (rooms ?? []).filter(
      (r) => r.category_id === cat.id && !occupiedRoomIds.has(r.id)
    );
    if (free.length === 0) continue;
    const price = seasonalByCat.get(cat.id) ?? Number(cat.base_price_per_night);
    const subtotal = price * nights;
    const tax = +(subtotal * 0.18).toFixed(2);
    results.push({
      category: cat,
      available_rooms: free.length,
      price_per_night: price,
      subtotal,
      tax_amount: tax,
      total_price: +(subtotal + tax).toFixed(2),
      nights,
      sample_room_id: free[0].id,
    });
  }

  return NextResponse.json({ results, nights, checkIn, checkOut, adults, children });
}
