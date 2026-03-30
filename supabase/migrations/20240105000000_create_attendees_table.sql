-- =============================================================================
-- Migration: Create attendees table
-- Description: Junction table assigning users to either a game or a classroom
--              session with a specific role (e.g. player, coach, presenter,
--              observer). Every row must reference exactly one of game_id or
--              session_id — not both and not neither. The published flag
--              controls whether the assignment is visible to the attendee.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.attendees (
  id         uuid        NOT NULL DEFAULT uuid_generate_v4(),
  user_id    uuid        NOT NULL,
  role       text        NOT NULL,
  game_id    uuid,
  session_id uuid,
  published  boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT attendees_pkey
    PRIMARY KEY (id),

  CONSTRAINT attendees_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES public.profiles (id)
    ON DELETE CASCADE,

  CONSTRAINT attendees_game_id_fkey
    FOREIGN KEY (game_id)
    REFERENCES public.games (id)
    ON DELETE CASCADE,

  CONSTRAINT attendees_session_id_fkey
    FOREIGN KEY (session_id)
    REFERENCES public.classroom_sessions (id)
    ON DELETE CASCADE,

  -- Every row must belong to exactly one event
  CONSTRAINT attendees_exactly_one_event_check
    CHECK (
      (game_id IS NOT NULL AND session_id IS NULL) OR
      (game_id IS NULL AND session_id IS NOT NULL)
    ),

  CONSTRAINT attendees_role_check
    CHECK (role IN ('presenter', 'observer', 'referee', 'staff')),

  -- Prevent duplicate assignments for the same user to the same event
  CONSTRAINT attendees_unique_user_game
    UNIQUE (user_id, game_id),

  CONSTRAINT attendees_unique_user_session
    UNIQUE (user_id, session_id)
);

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS attendees_user_id_idx
  ON public.attendees (user_id);

CREATE INDEX IF NOT EXISTS attendees_game_id_idx
  ON public.attendees (game_id);

CREATE INDEX IF NOT EXISTS attendees_session_id_idx
  ON public.attendees (session_id);

CREATE INDEX IF NOT EXISTS attendees_published_idx
  ON public.attendees (published)
  WHERE published = true;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
ALTER TABLE public.attendees ENABLE ROW LEVEL SECURITY;

-- Users can see their own attendee records;
-- admins can see all records
CREATE POLICY "attendees_select"
  ON public.attendees
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

-- Only admins can assign attendees
CREATE POLICY "attendees_insert_admin"
  ON public.attendees
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

-- Only admins can update attendee records (e.g. toggle published flag)
CREATE POLICY "attendees_update_admin"
  ON public.attendees
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

-- Only admins can remove attendees
CREATE POLICY "attendees_delete_admin"
  ON public.attendees
  FOR DELETE
  TO authenticated
  USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

-- -----------------------------------------------------------------------------
-- Grants
-- -----------------------------------------------------------------------------
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendees TO authenticated;
