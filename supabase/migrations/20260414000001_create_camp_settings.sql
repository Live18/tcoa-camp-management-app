-- =============================================================================
-- Migration: Create camp_settings table
-- Description: Stores a single row of global camp configuration (name, dates).
--              Only admins can update; any authenticated user can read.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.camp_settings (
  id         uuid        NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001',
  camp_name  text,
  camp_start date,
  camp_end   date,
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT camp_settings_pkey PRIMARY KEY (id)
);

-- Seed the single configuration row so there is always one row to upsert.
INSERT INTO public.camp_settings (id)
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE public.camp_settings ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can read camp settings
CREATE POLICY "camp_settings_select_authenticated"
  ON public.camp_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can update
CREATE POLICY "camp_settings_update_admin"
  ON public.camp_settings
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------
GRANT SELECT, UPDATE ON public.camp_settings TO authenticated;
