-- Habilitar extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================
-- TABLA: room_categories (tipos de habitación)
-- =============================================
CREATE TABLE room_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  base_price_per_night DECIMAL(10,2) NOT NULL,
  max_occupancy INTEGER NOT NULL DEFAULT 2,
  bed_type VARCHAR(50) NOT NULL,
  size_sqm DECIMAL(5,2),
  floor_level VARCHAR(50),
  view_type VARCHAR(100),
  thumbnail_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  amenities JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLA: rooms (habitaciones físicas)
-- =============================================
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES room_categories(id),
  room_number VARCHAR(20) UNIQUE NOT NULL,
  floor_number INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'available'
    CHECK (status IN ('available', 'occupied', 'maintenance', 'out_of_service')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLA: seasonal_pricing
-- =============================================
CREATE TABLE seasonal_pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES room_categories(id),
  name VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL,
  multiplier DECIMAL(3,2) DEFAULT 1.00,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLA: profiles
-- =============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(200),
  phone VARCHAR(30),
  nationality VARCHAR(100),
  document_type VARCHAR(50),
  document_number VARCHAR(50),
  preferences JSONB DEFAULT '{}',
  loyalty_points INTEGER DEFAULT 0,
  vip_tier VARCHAR(20) DEFAULT 'standard'
    CHECK (vip_tier IN ('standard', 'silver', 'gold', 'platinum')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLA: reservations
-- =============================================
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_code VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  room_id UUID NOT NULL REFERENCES rooms(id),
  category_id UUID NOT NULL REFERENCES room_categories(id),
  guest_full_name VARCHAR(200) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  guest_phone VARCHAR(30),
  guest_document_number VARCHAR(50),
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  check_in_time TIME DEFAULT '15:00',
  check_out_time TIME DEFAULT '11:00',
  adults INTEGER NOT NULL DEFAULT 1 CHECK (adults >= 1),
  children INTEGER NOT NULL DEFAULT 0 CHECK (children >= 0),
  nights INTEGER GENERATED ALWAYS AS (check_out_date - check_in_date) STORED,
  price_per_night DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(4,2) DEFAULT 0.18,
  tax_amount DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'PEN',
  status VARCHAR(30) DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show')),
  payment_status VARCHAR(20) DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded')),
  payment_method VARCHAR(50),
  special_requests TEXT,
  internal_notes TEXT,
  extras JSONB DEFAULT '[]',
  source VARCHAR(50) DEFAULT 'website',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  CONSTRAINT valid_dates CHECK (check_out_date > check_in_date)
);

-- =============================================
-- TABLA: amenities
-- =============================================
CREATE TABLE amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  category VARCHAR(50),
  description TEXT
);

-- =============================================
-- TABLA: hotel_config
-- =============================================
CREATE TABLE hotel_config (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLA: room_blocks
-- =============================================
CREATE TABLE room_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES rooms(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason VARCHAR(100) NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLA: reviews
-- =============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID NOT NULL REFERENCES reservations(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  category_id UUID NOT NULL REFERENCES room_categories(id),
  overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  cleanliness_rating INTEGER CHECK (cleanliness_rating BETWEEN 1 AND 5),
  service_rating INTEGER CHECK (service_rating BETWEEN 1 AND 5),
  location_rating INTEGER CHECK (location_rating BETWEEN 1 AND 5),
  title VARCHAR(200),
  body TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ÍNDICES
-- =============================================
CREATE INDEX idx_reservations_dates ON reservations(check_in_date, check_out_date);
CREATE INDEX idx_reservations_room ON reservations(room_id);
CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_code ON reservations(reservation_code);
CREATE INDEX idx_rooms_category ON rooms(category_id);
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_seasonal_pricing_dates ON seasonal_pricing(start_date, end_date);

-- =============================================
-- FUNCION + TRIGGER: reservation_code
-- =============================================
CREATE SEQUENCE reservation_code_seq START 1;

CREATE OR REPLACE FUNCTION generate_reservation_code()
RETURNS TRIGGER AS $func$
BEGIN
  NEW.reservation_code := 'HM-' ||
    TO_CHAR(NOW(), 'YYYY') || '-' ||
    LPAD(NEXTVAL('reservation_code_seq')::TEXT, 5, '0');
  RETURN NEW;
END;
$func$ LANGUAGE plpgsql;

CREATE TRIGGER set_reservation_code
  BEFORE INSERT ON reservations
  FOR EACH ROW EXECUTE FUNCTION generate_reservation_code();

-- =============================================
-- FUNCION: check_room_availability
-- =============================================
CREATE OR REPLACE FUNCTION check_room_availability(
  p_room_id UUID,
  p_check_in DATE,
  p_check_out DATE,
  p_exclude_reservation_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $func$
DECLARE
  conflict_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO conflict_count
  FROM reservations
  WHERE room_id = p_room_id
    AND status NOT IN ('cancelled', 'no_show')
    AND (p_exclude_reservation_id IS NULL OR id != p_exclude_reservation_id)
    AND check_in_date < p_check_out
    AND check_out_date > p_check_in;
  RETURN conflict_count = 0;
END;
$func$ LANGUAGE plpgsql;

-- =============================================
-- FUNCION: get_room_price
-- =============================================
CREATE OR REPLACE FUNCTION get_room_price(
  p_category_id UUID,
  p_check_in DATE,
  p_check_out DATE
)
RETURNS DECIMAL(10,2) AS $func$
DECLARE
  base_price DECIMAL(10,2);
  seasonal_price DECIMAL(10,2);
BEGIN
  SELECT base_price_per_night INTO base_price
  FROM room_categories WHERE id = p_category_id;
  SELECT price_per_night INTO seasonal_price
  FROM seasonal_pricing
  WHERE category_id = p_category_id
    AND start_date <= p_check_in
    AND end_date >= p_check_out
    AND is_active = TRUE
  ORDER BY start_date DESC
  LIMIT 1;
  RETURN COALESCE(seasonal_price, base_price);
END;
$func$ LANGUAGE plpgsql;

-- =============================================
-- FUNCION: update_updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $func$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$func$ LANGUAGE plpgsql;

CREATE TRIGGER trg_rooms_updated_at BEFORE UPDATE ON rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_reservations_updated_at BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_room_categories_updated_at BEFORE UPDATE ON room_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- FUNCION: handle_new_user
-- =============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $func$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasonal_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "reservations_select_own" ON reservations FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "reservations_insert_auth" ON reservations FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "reservations_update_own" ON reservations FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "reviews_select_published" ON reviews FOR SELECT USING (is_published = TRUE);
CREATE POLICY "reviews_select_own" ON reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "reviews_insert_auth" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "room_categories_select_public" ON room_categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "rooms_select_public" ON rooms FOR SELECT USING (TRUE);
CREATE POLICY "amenities_select_public" ON amenities FOR SELECT USING (TRUE);
CREATE POLICY "seasonal_pricing_select_public" ON seasonal_pricing FOR SELECT USING (is_active = TRUE);
CREATE POLICY "hotel_config_select_public" ON hotel_config FOR SELECT USING (TRUE);
