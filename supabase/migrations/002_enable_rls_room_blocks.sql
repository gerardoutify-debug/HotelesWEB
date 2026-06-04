-- =============================================
-- 002 · Habilitar RLS en room_blocks
-- =============================================
-- En la migración 001 se creó la tabla room_blocks pero NO se le activó
-- Row Level Security (las otras 8 tablas sí la tienen). Con la anon key
-- pública, eso dejaba la tabla expuesta a lectura/escritura directa.
--
-- room_blocks es una tabla INTERNA (bloqueos de habitaciones por
-- mantenimiento, etc.) que el frontend nunca consulta con la anon key:
-- el servidor la usa a través de la service role key, que ignora el RLS.
-- Por eso activamos RLS SIN políticas públicas: deny-by-default para
-- anon/authenticated, acceso total solo desde el servidor (service role).
-- =============================================

ALTER TABLE room_blocks ENABLE ROW LEVEL SECURITY;

-- (Sin CREATE POLICY a propósito: ningún rol público debe leer ni escribir
--  esta tabla. Si en el futuro el panel de admin necesita gestionarla desde
--  el cliente, se agregará una política basada en rol de administrador.)
