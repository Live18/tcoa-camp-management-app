-- =============================================================================
-- Migration: Create games table
-- Description: Basketball games held at the camp. Each game is assigned to a
--              specific court at a location and has an optional player cap.
--              Admins create and manage games; all authenticated users can view
--              them. Attendees are tracked in the separate attendees table.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.games (
  id           uuid        NOT NULL DEFAULT uuid_generate_v4(),
  title        text        NOT NULL,
  description  text,
  date         text        NOT NULL,
  court_number integer     NOT NULL,
  max_players  integer,
  location_id  uuid,
  created_by   uuid,
  created_at   timestamptz NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT games_pkey
    PRIMARY KEY (id),

  CONSTRAINT games_location_id_fkey
    FOREIGN KEY (location_id)
    REFERENCES public.locations (id)
    ON DELETE SET NULL,

  CONSTRAINT games_created_by_fkey
    FOREIGN KEY (created_by)
    REFERENCES auth.users (id)
    ON DELETE SET NULL,

  CONSTRAINT games_court_number_check
    CHECK (court_number > 0),

  CONSTRAINT games_max_players_check
    CHECK (max_players IS NULL OR max_players > 0)
);

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS games_location_id_idx
  ON public.games (location_id);

CREATE INDEX IF NOT EXISTS games_created_by_idx
  ON public.games (created_by);

CREATE INDEX IF NOT EXISTS games_date_idx
  ON public.games (date);

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read games
CREATE POLICY "games_select_authenticated"
  ON public.games
  FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can create games
CREATE POLICY "games_insert_admin"
  ON public.games
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

-- Only admins can update games
CREATE POLICY "games_update_admin"
  ON public.games
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

-- Only admins can delete games
CREATE POLICY "games_delete_admin"
  ON public.games
  FOR DELETE
  TO authenticated
  USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

-- -----------------------------------------------------------------------------
-- Grants
-- -----------------------------------------------------------------------------
GRANT SELECT, INSERT, UPDATE, DELETE ON public.games TO authenticated;
