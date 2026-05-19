export interface RoomCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  base_price_per_night: number;
  max_occupancy: number;
  bed_type: string;
  size_sqm: number | null;
  floor_level: string | null;
  view_type: string | null;
  thumbnail_url: string | null;
  gallery_urls: string[];
  amenities: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  category_id: string;
  room_number: string;
  floor_number: number;
  status: "available" | "occupied" | "maintenance" | "out_of_service";
  notes: string | null;
  room_categories?: RoomCategory;
}

export interface Reservation {
  id: string;
  reservation_code: string;
  user_id: string | null;
  room_id: string;
  category_id: string;
  guest_full_name: string;
  guest_email: string;
  guest_phone: string | null;
  guest_document_number: string | null;
  check_in_date: string;
  check_out_date: string;
  check_in_time: string;
  check_out_time: string;
  adults: number;
  children: number;
  nights: number;
  price_per_night: number;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  status:
    | "pending"
    | "confirmed"
    | "checked_in"
    | "checked_out"
    | "cancelled"
    | "no_show";
  payment_status: "pending" | "partial" | "paid" | "refunded";
  payment_method: string | null;
  special_requests: string | null;
  extras: Record<string, unknown>[];
  source: string;
  created_at: string;
  updated_at: string;
  room_categories?: RoomCategory;
  rooms?: Room;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  nationality: string | null;
  document_type: string | null;
  document_number: string | null;
  preferences: Record<string, unknown>;
  loyalty_points: number;
  vip_tier: "standard" | "silver" | "gold" | "platinum";
  avatar_url: string | null;
}

export interface AvailabilityResult {
  category: RoomCategory;
  available_rooms: number;
  price_per_night: number;
  total_price: number;
  subtotal: number;
  tax_amount: number;
  nights: number;
  sample_room_id: string;
}

export interface HotelConfig {
  hotel_info: {
    name: string;
    tagline: string;
    phone: string;
    email: string;
    address: string;
    stars: number;
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
  };
  check_in_out: {
    check_in: string;
    check_out: string;
    early_check_in_fee: number;
    late_check_out_fee: number;
    reception_hours?: string;
  };
  policies: {
    cancellation_hours: number;
    children_free_age: number;
    pets_allowed: boolean;
    smoking: boolean;
    min_age_to_book?: number;
  };
  opening_hours?: Record<string, string>;
  amenities_global?: string[];
}
