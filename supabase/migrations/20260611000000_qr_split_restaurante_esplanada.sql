-- Split QR readings/settings per location (restaurante / esplanada)

ALTER TABLE public.qr_settings DROP CONSTRAINT IF EXISTS qr_settings_pkey;
ALTER TABLE public.qr_settings ADD COLUMN IF NOT EXISTS location text;
UPDATE public.qr_settings SET location = 'restaurante' WHERE location IS NULL;
ALTER TABLE public.qr_settings ALTER COLUMN location SET NOT NULL;
ALTER TABLE public.qr_settings DROP COLUMN IF EXISTS id;
ALTER TABLE public.qr_settings ADD CONSTRAINT qr_settings_location_check CHECK (location IN ('restaurante','esplanada'));
ALTER TABLE public.qr_settings ADD PRIMARY KEY (location);

INSERT INTO public.qr_settings (location, secret_key, duration_minutes, updated_at)
SELECT 'esplanada', encode(gen_random_bytes(16), 'hex'), duration_minutes, now()
FROM public.qr_settings WHERE location = 'restaurante'
ON CONFLICT (location) DO NOTHING;

ALTER TABLE public.qr_readings ADD COLUMN IF NOT EXISTS location text NOT NULL DEFAULT 'restaurante';
ALTER TABLE public.qr_readings ADD CONSTRAINT qr_readings_location_check CHECK (location IN ('restaurante','esplanada'));
CREATE INDEX IF NOT EXISTS qr_readings_location_created_at_idx ON public.qr_readings (location, created_at DESC);

DROP FUNCTION IF EXISTS public.qr_stats();
DROP FUNCTION IF EXISTS public.qr_admin_settings();
DROP FUNCTION IF EXISTS public.set_qr_duration(integer);
DROP FUNCTION IF EXISTS public.regenerate_qr_key();
DROP FUNCTION IF EXISTS public.redeem_qr_key(text);

CREATE FUNCTION public.qr_stats()
RETURNS TABLE(location text, today bigint, this_week bigint, this_month bigint, total bigint)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN RAISE EXCEPTION 'forbidden'; END IF;
  RETURN QUERY
  SELECT loc.location,
    (SELECT count(*) FROM public.qr_readings r WHERE r.location = loc.location AND r.created_at >= date_trunc('day', now())),
    (SELECT count(*) FROM public.qr_readings r WHERE r.location = loc.location AND r.created_at >= date_trunc('week', now())),
    (SELECT count(*) FROM public.qr_readings r WHERE r.location = loc.location AND r.created_at >= date_trunc('month', now())),
    (SELECT count(*) FROM public.qr_readings r WHERE r.location = loc.location)
  FROM (VALUES ('restaurante'), ('esplanada')) AS loc(location);
END; $$;

CREATE FUNCTION public.qr_admin_settings()
RETURNS TABLE(location text, secret_key text, duration_minutes integer)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN RAISE EXCEPTION 'forbidden'; END IF;
  RETURN QUERY SELECT s.location, s.secret_key, s.duration_minutes
    FROM public.qr_settings s ORDER BY s.location;
END; $$;

CREATE FUNCTION public.set_qr_duration(p_location text, p_minutes integer)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN RAISE EXCEPTION 'forbidden'; END IF;
  IF p_minutes < 1 OR p_minutes > 1440 THEN RAISE EXCEPTION 'duration_out_of_range'; END IF;
  IF p_location NOT IN ('restaurante','esplanada') THEN RAISE EXCEPTION 'invalid_location'; END IF;
  UPDATE public.qr_settings SET duration_minutes = p_minutes, updated_at = now() WHERE location = p_location;
END; $$;

CREATE FUNCTION public.regenerate_qr_key(p_location text)
RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE new_key text;
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN RAISE EXCEPTION 'forbidden'; END IF;
  IF p_location NOT IN ('restaurante','esplanada') THEN RAISE EXCEPTION 'invalid_location'; END IF;
  new_key := encode(gen_random_bytes(16), 'hex');
  UPDATE public.qr_settings SET secret_key = new_key, updated_at = now() WHERE location = p_location;
  RETURN new_key;
END; $$;

CREATE FUNCTION public.redeem_qr_key(p_key text)
RETURNS TABLE(valid boolean, duration_minutes integer, location text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_loc text; v_dm integer;
BEGIN
  SELECT s.location, s.duration_minutes INTO v_loc, v_dm
    FROM public.qr_settings s WHERE s.secret_key = p_key;
  IF v_loc IS NULL THEN
    RETURN QUERY SELECT false, 0, NULL::text; RETURN;
  END IF;
  INSERT INTO public.qr_readings (location) VALUES (v_loc);
  RETURN QUERY SELECT true, v_dm, v_loc;
END; $$;
