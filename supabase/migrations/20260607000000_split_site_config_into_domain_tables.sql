-- ================================================================
-- Criar tabelas por domínio (substituição de site_config)
-- ================================================================

-- site_menu: tabela de linha única
CREATE TABLE public.site_menu (
  id         boolean PRIMARY KEY DEFAULT true,
  data       jsonb   NOT NULL DEFAULT '[]',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_menu_single_row CHECK (id = true)
);
GRANT SELECT ON public.site_menu TO anon, authenticated;
GRANT INSERT, UPDATE ON public.site_menu TO authenticated;
GRANT ALL ON public.site_menu TO service_role;
ALTER TABLE public.site_menu ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read site_menu" ON public.site_menu FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write site_menu" ON public.site_menu FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- site_wines: tabela de linha única
CREATE TABLE public.site_wines (
  id         boolean PRIMARY KEY DEFAULT true,
  data       jsonb   NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_wines_single_row CHECK (id = true)
);
GRANT SELECT ON public.site_wines TO anon, authenticated;
GRANT INSERT, UPDATE ON public.site_wines TO authenticated;
GRANT ALL ON public.site_wines TO service_role;
ALTER TABLE public.site_wines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read site_wines" ON public.site_wines FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write site_wines" ON public.site_wines FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- site_testimonials: tabela de linha única
CREATE TABLE public.site_testimonials (
  id         boolean PRIMARY KEY DEFAULT true,
  data       jsonb   NOT NULL DEFAULT '[]',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_testimonials_single_row CHECK (id = true)
);
GRANT SELECT ON public.site_testimonials TO anon, authenticated;
GRANT INSERT, UPDATE ON public.site_testimonials TO authenticated;
GRANT ALL ON public.site_testimonials TO service_role;
ALTER TABLE public.site_testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read site_testimonials" ON public.site_testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write site_testimonials" ON public.site_testimonials FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- site_content: key-value para blocos e páginas
CREATE TABLE public.site_content (
  key        text PRIMARY KEY,
  value      jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT INSERT, UPDATE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read site_content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write site_content" ON public.site_content FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- site_settings: key-value para restaurante, navPages, maintenance, blocks
CREATE TABLE public.site_settings (
  key        text PRIMARY KEY,
  value      jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read site_settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write site_settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Migrar dados do site_config para as novas tabelas
INSERT INTO public.site_menu (id, data)
SELECT true, (value->'menu') FROM public.site_config WHERE key = 'admin_state' AND value->'menu' IS NOT NULL
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now();

INSERT INTO public.site_wines (id, data)
SELECT true, (value->'wines') FROM public.site_config WHERE key = 'admin_state' AND value->'wines' IS NOT NULL
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now();

INSERT INTO public.site_testimonials (id, data)
SELECT true, (value->'testimonials') FROM public.site_config WHERE key = 'admin_state' AND value->'testimonials' IS NOT NULL
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now();

INSERT INTO public.site_content (key, value)
SELECT 'block_' || (item->>'key'), item FROM public.site_config, jsonb_array_elements(value->'content') AS item WHERE key = 'admin_state'
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

INSERT INTO public.site_content (key, value)
SELECT 'page_' || (item->>'key'), item FROM public.site_config, jsonb_array_elements(value->'pages') AS item WHERE key = 'admin_state'
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

INSERT INTO public.site_settings (key, value)
SELECT unnest(ARRAY['restaurante','navPages','maintenance','blocks']),
       unnest(ARRAY[value->'restaurante', value->'navPages', value->'maintenance', value->'blocks'])
FROM public.site_config WHERE key = 'admin_state'
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
