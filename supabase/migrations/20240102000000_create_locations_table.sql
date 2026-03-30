-- =============================================================================
-- Migration: Create locations table
-- Description: Physical venues for the basketball camp. Each location can have
--              multiple courts (for games) and rooms (for classroom sessions).
--              Only admins can create or modify locations; all authenticated
--              users can read them.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.locations (
  id         uuid        NOT NULL DEFAULT uuid_generate_v4(),
  name       text        NOT NULL,
  address    text        NOT NULL,
  city       text        NOT NULL,
  state      text        NOT NULL,
  zip        text        NOT NULL,
  courts     integer,
  rooms      integer,
  created_at timestamptz NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT locations_pkey
    PRIMARY KEY (id),

  CONSTRAINT locations_courts_check
    CHECK (courts IS NULL OR courts >= 0),

  CONSTRAINT locations_rooms_check
    CHECK (rooms IS NULL OR rooms >= 0)
);

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS locations_name_idx
  ON public.locations (name);

CREATE INDEX IF NOT EXISTS locations_city_state_idx
  ON public.locations (city, state);

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read locations
-- (needed for game/session forms, attendee views, etc.)
CREATE POLICY "locations_select_authenticated"
  ON public.locations
  FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can create locations
CREATE POLICY "locations_insert_admin"
  ON public.locations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

-- Only admins can update locations
CREATE POLICY "locations_update_admin"
  ON public.locations
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

-- Only super admins can delete locations
CREATE POLICY "locations_delete_super_admin"
  ON public.locations
  FOR DELETE
  TO authenticated
  USING (
    (SELECT is_super_admin FROM public.profiles WHERE id = auth.uid())
  );

-- -----------------------------------------------------------------------------
-- Grants
-- -----------------------------------------------------------------------------
GRANT SELECT ON public.locations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.locations TO authenticated;
