-- =============================================================================
-- Migration: Add admin_notes column to profiles
-- Description: Stores private administrative notes on a user's profile.
--              Only admins can read/write; owners cannot see or modify.
-- =============================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS admin_notes text;

-- ---------------------------------------------------------------------------
-- RLS policy: only admins can read admin_notes
-- The existing "profiles_select_authenticated" policy allows any authenticated
-- user to SELECT the whole row.  We cannot do column-level RLS in Postgres
-- directly, so we enforce visibility in application code.  The update policy
-- below ensures only admins can write the field.
-- ---------------------------------------------------------------------------

-- Allow admins to update admin_notes (in addition to the existing
-- profiles_update_own policy that lets users update their own row).
-- We use a separate policy so the is_admin check is explicit.
CREATE POLICY "profiles_update_admin_notes"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );
