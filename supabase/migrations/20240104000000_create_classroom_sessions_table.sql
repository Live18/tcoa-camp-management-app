-- =============================================================================
-- Migration: Create classroom_sessions table
-- Description: Instructional/classroom sessions held at the camp. Similar to
--              games but take place in rooms rather than courts. Each session
--              has an optional attendee cap. Admins manage sessions; all
--              authenticated users can view them. Attendance is tracked in the
--              separate attendees table.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.classroom_sessions (
  id            uuid        NOT NULL DEFAULT uuid_generate_v4(),
  title         text        NOT NULL,
  description   text,
  date          text        NOT NULL,
  room_name     text        NOT NULL,
  max_attendees integer,
  location_id   uuid,
  created_by    uuid,
  created_at    timestamptz NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT classroom_sessions_pkey
    PRIMARY KEY (id),

  CONSTRAINT classroom_sessions_location_id_fkey
    FOREIGN KEY (location_id)
    REFERENCES public.locations (id)
    ON DELETE SET NULL,

  CONSTRAINT classroom_sessions_created_by_fkey
    FOREIGN KEY (created_by)
    REFERENCES auth.users (id)
    ON DELETE SET NULL,

  CONSTRAINT classroom_sessions_max_attendees_check
    CHECK (max_attendees IS NULL OR max_attendees > 0)
);

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS classroom_sessions_location_id_idx
  ON public.classroom_sessions (location_id);

CREATE INDEX IF NOT EXISTS classroom_sessions_created_by_idx
  ON public.classroom_sessions (created_by);

CREATE INDEX IF NOT EXISTS classroom_sessions_date_idx
  ON public.classroom_sessions (date);

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
ALTER TABLE public.classroom_sessions ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read sessions
CREATE POLICY "classroom_sessions_select_authenticated"
  ON public.classroom_sessions
  FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can create sessions
CREATE POLICY "classroom_sessions_insert_admin"
  ON public.classroom_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

-- Only admins can update sessions
CREATE POLICY "classroom_sessions_update_admin"
  ON public.classroom_sessions
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

-- Only admins can delete sessions
CREATE POLICY "classroom_sessions_delete_admin"
  ON public.classroom_sessions
  FOR DELETE
  TO authenticated
  USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

-- -----------------------------------------------------------------------------
-- Grants
-- -----------------------------------------------------------------------------
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classroom_sessions TO authenticated;
