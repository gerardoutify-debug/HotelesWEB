-- =============================================
-- SEED: HoneyMoon Hotel
-- =============================================

-- Categorías de habitaciones (5 niveles, honeymoon es la más cara)
INSERT INTO room_categories (name, slug, description, base_price_per_night, max_occupancy, bed_type, size_sqm, view_type, floor_level, thumbnail_url, gallery_urls, amenities) VALUES
  ('Simple', 'simple',
   'Habitación acogedora y funcional, ideal para viajeros individuales. Cama Queen, espacio optimizado y todas las amenidades esenciales del hotel HoneyMoon.',
   320.00, 1, 'Queen', 22.00, 'city', 'ground',
   'https://picsum.photos/seed/honeymoon-simple/1200/800',
   ARRAY['https://picsum.photos/seed/honeymoon-simple-1/1600/1000','https://picsum.photos/seed/honeymoon-simple-2/1600/1000','https://picsum.photos/seed/honeymoon-simple-3/1600/1000'],
   '["WiFi premium","Smart TV 43''","A/C","Caja fuerte","Desayuno continental","Amenities de baño"]'::jsonb),

  ('Matrimonial', 'matrimonial',
   'Habitación pensada para parejas. Cama King size, ambientes cálidos, vista a jardines tropicales y detalles románticos para una estadía perfecta en HoneyMoon.',
   540.00, 2, 'King', 32.00, 'garden', 'mid',
   'https://picsum.photos/seed/honeymoon-matrimonial/1200/800',
   ARRAY['https://picsum.photos/seed/honeymoon-matrimonial-1/1600/1000','https://picsum.photos/seed/honeymoon-matrimonial-2/1600/1000','https://picsum.photos/seed/honeymoon-matrimonial-3/1600/1000'],
   '["WiFi premium","Smart TV 50''","A/C","Mini bar","Cafetera Nespresso","Bata y pantuflas","Desayuno buffet"]'::jsonb),

  ('Luxury', 'luxury',
   'Lujo contemporáneo con vista al mar. Cama King, sala de estar integrada, bañera de hidromasaje y balcón privado. Una experiencia HoneyMoon de alto nivel.',
   980.00, 3, 'King', 55.00, 'ocean', 'top',
   'https://picsum.photos/seed/honeymoon-luxury/1200/800',
   ARRAY['https://picsum.photos/seed/honeymoon-luxury-1/1600/1000','https://picsum.photos/seed/honeymoon-luxury-2/1600/1000','https://picsum.photos/seed/honeymoon-luxury-3/1600/1000','https://picsum.photos/seed/honeymoon-luxury-4/1600/1000'],
   '["WiFi premium","Smart TV 65''","A/C climatizado","Mini bar premium","Cafetera Nespresso","Bañera de hidromasaje","Balcón con vista al mar","Servicio a la habitación 24h","Bata y pantuflas de seda","Desayuno buffet gourmet"]'::jsonb),

  ('Presidencial', 'presidencial',
   'La suite presidencial de HoneyMoon: dos ambientes, comedor, sala de estar, vista panorámica al océano y mayordomo dedicado. Diseño elegante para ocasiones especiales.',
   1600.00, 4, 'King', 90.00, 'ocean', 'penthouse',
   'https://picsum.photos/seed/honeymoon-presidencial/1200/800',
   ARRAY['https://picsum.photos/seed/honeymoon-presidencial-1/1600/1000','https://picsum.photos/seed/honeymoon-presidencial-2/1600/1000','https://picsum.photos/seed/honeymoon-presidencial-3/1600/1000','https://picsum.photos/seed/honeymoon-presidencial-4/1600/1000'],
   '["WiFi premium","Smart TVs en cada ambiente","A/C climatizado","Mini bar premium","Máquina de café espresso","Bañera de hidromasaje","Sauna privado","Terraza panorámica","Mayordomo dedicado 24/7","Transfer desde aeropuerto","Cena de bienvenida"]'::jsonb),

  ('HoneyMoon Suite', 'honeymoon',
   'La experiencia más exclusiva del hotel. Suite romántica con jacuzzi privado en terraza, cama King con dosel, vista 270 grados al océano, champagne de bienvenida, cena privada al atardecer y mayordomo personal. La joya de HoneyMoon Hotel.',
   2800.00, 2, 'King', 120.00, 'ocean', 'penthouse',
   'https://picsum.photos/seed/honeymoon-suite/1200/800',
   ARRAY['https://picsum.photos/seed/honeymoon-suite-1/1600/1000','https://picsum.photos/seed/honeymoon-suite-2/1600/1000','https://picsum.photos/seed/honeymoon-suite-3/1600/1000','https://picsum.photos/seed/honeymoon-suite-4/1600/1000','https://picsum.photos/seed/honeymoon-suite-5/1600/1000'],
   '["Champagne de bienvenida","Jacuzzi privado en terraza","Cama King con dosel","Vista panorámica 270 grados","Cena romántica privada","Spa in-suite","Mayordomo personal 24/7","Transfer en limusina","Pétalos de rosa diarios","Desayuno en la cama","Sesión de fotos profesional","Decoración personalizada"]'::jsonb);

-- Habitaciones físicas
INSERT INTO rooms (category_id, room_number, floor_number, status)
SELECT id, 'S-0' || num, 1, 'available'
FROM room_categories, GENERATE_SERIES(1,8) AS num
WHERE slug = 'simple';

INSERT INTO rooms (category_id, room_number, floor_number, status)
SELECT id, 'M-' || LPAD(num::text, 2, '0'), 3, 'available'
FROM room_categories, GENERATE_SERIES(1,10) AS num
WHERE slug = 'matrimonial';

INSERT INTO rooms (category_id, room_number, floor_number, status)
SELECT id, 'L-0' || num, 6, 'available'
FROM room_categories, GENERATE_SERIES(1,6) AS num
WHERE slug = 'luxury';

INSERT INTO rooms (category_id, room_number, floor_number, status)
SELECT id, 'P-0' || num, 9, 'available'
FROM room_categories, GENERATE_SERIES(1,3) AS num
WHERE slug = 'presidencial';

INSERT INTO rooms (category_id, room_number, floor_number, status)
SELECT id, 'HM-0' || num, 10, 'available'
FROM room_categories, GENERATE_SERIES(1,2) AS num
WHERE slug = 'honeymoon';

-- Precios de temporada
INSERT INTO seasonal_pricing (category_id, name, start_date, end_date, price_per_night, multiplier)
SELECT id, 'Alta Temporada Verano', '2026-12-20', '2027-01-10', base_price_per_night * 1.5, 1.5
FROM room_categories;

INSERT INTO seasonal_pricing (category_id, name, start_date, end_date, price_per_night, multiplier)
SELECT id, 'San Valentín', '2027-02-12', '2027-02-16', base_price_per_night * 1.4, 1.4
FROM room_categories;

INSERT INTO seasonal_pricing (category_id, name, start_date, end_date, price_per_night, multiplier)
SELECT id, 'Semana Santa', '2027-03-25', '2027-04-05', base_price_per_night * 1.3, 1.3
FROM room_categories;

-- Amenidades globales del hotel
INSERT INTO amenities (name, icon, category, description) VALUES
  ('Piscina Infinity', 'Waves', 'services', 'Piscina infinity con vista al océano'),
  ('Spa & Wellness', 'Sparkles', 'services', 'Spa de lujo con tratamientos exclusivos'),
  ('Restaurante Gourmet', 'UtensilsCrossed', 'services', 'Cocina de autor con productos locales'),
  ('Bar de Azotea', 'Wine', 'services', 'Bar premium con vista panorámica'),
  ('Gimnasio 24h', 'Dumbbell', 'services', 'Equipos de última generación'),
  ('Concierge 24h', 'BellRing', 'services', 'Atención personalizada todo el día'),
  ('Estacionamiento gratuito', 'Car', 'services', 'Valet parking incluido'),
  ('WiFi premium', 'Wifi', 'room', 'Internet de alta velocidad en todo el hotel'),
  ('Servicio a la habitación 24h', 'Coffee', 'services', 'Room service todo el día'),
  ('Transfer aeropuerto', 'Plane', 'services', 'Servicio de traslado desde y hacia el aeropuerto'),
  ('Smart TV', 'Tv', 'entertainment', 'Smart TV con streaming'),
  ('A/C', 'Snowflake', 'room', 'Aire acondicionado climatizado'),
  ('Caja fuerte', 'Lock', 'room', 'Caja de seguridad digital'),
  ('Mini bar', 'GlassWater', 'room', 'Mini bar surtido'),
  ('Bañera de hidromasaje', 'Bath', 'bathroom', 'Jacuzzi premium en habitaciones selectas');

-- Configuración del hotel
INSERT INTO hotel_config (key, value, description) VALUES
  ('hotel_info', '{"name":"HoneyMoon Hotel","tagline":"Donde el océano se convierte en tu hogar","phone":"+51 1 234-5678","email":"reservas@honeymoonhotel.pe","address":"Malecón Cisneros 1420, Miraflores, Lima, Perú","stars":5,"instagram":"@honeymoonhotel","facebook":"HoneyMoonHotelPeru","whatsapp":"+51999888777"}'::jsonb, 'Información general del hotel'),
  ('check_in_out', '{"check_in":"15:00","check_out":"11:00","early_check_in_fee":80,"late_check_out_fee":100,"reception_hours":"24/7"}'::jsonb, 'Horarios de check-in y check-out'),
  ('policies', '{"cancellation_hours":48,"children_free_age":6,"pets_allowed":false,"smoking":false,"min_age_to_book":18}'::jsonb, 'Políticas del hotel'),
  ('amenities_global', '["Piscina infinity","Spa & wellness center","Restaurante gourmet","Bar de azotea","Gimnasio 24h","Concierge 24h","Estacionamiento gratuito","WiFi premium","Servicio de habitaciones 24h","Transfer aeropuerto"]'::jsonb, 'Amenidades generales del hotel'),
  ('opening_hours', '{"reception":"24/7","restaurant":"06:30 - 23:00","bar":"16:00 - 02:00","spa":"09:00 - 21:00","gym":"24/7","pool":"06:00 - 22:00"}'::jsonb, 'Horarios de atención de cada área');
