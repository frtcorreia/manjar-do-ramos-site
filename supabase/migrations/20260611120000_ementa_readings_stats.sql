-- Track ementa page visits and expose admin stats

CREATE TABLE IF NOT EXISTS public.ementa_readings (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL    DEFAULT now()
);

ALTER TABLE public.ementa_readings ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon) may insert a reading
CREATE POLICY "ementa_readings_insert" ON public.ementa_readings
  FOR INSERT WITH CHECK (true);

-- Only admins may read
CREATE POLICY "ementa_readings_admin_select" ON public.ementa_readings
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Public function: record one ementa visit (called from the page, no auth required)
CREATE FUNCTION public.record_ementa_read()
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.ementa_readings DEFAULT VALUES;
END; $$;

GRANT EXECUTE ON FUNCTION public.record_ementa_read() TO anon, authenticated;

-- Admin function: return aggregated stats
CREATE FUNCTION public.ementa_stats()
RETURNS TABLE(today bigint, this_week bigint, this_month bigint, total bigint)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN RAISE EXCEPTION 'forbidden'; END IF;
  RETURN QUERY
  SELECT
    (SELECT count(*) FROM public.ementa_readings WHERE created_at >= date_trunc('day',  now())),
    (SELECT count(*) FROM public.ementa_readings WHERE created_at >= date_trunc('week', now())),
    (SELECT count(*) FROM public.ementa_readings WHERE created_at >= date_trunc('month',now())),
    (SELECT count(*) FROM public.ementa_readings);
END; $$;
