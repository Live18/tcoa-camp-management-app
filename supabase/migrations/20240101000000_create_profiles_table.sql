-- =============================================================================
-- Migration: Create profiles table
-- Description: Stores public user profile data linked to Supabase Auth users.
--              One profile per auth user. Created automatically via trigger
--              when a new user signs up. Admins and Super Admins are flagged
--              here for role-based access control throughout the app.
-- =============================================================================

-- Enable uuid-ossp extension (required for uuid_generate_v4())
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id                      uuid          NOT NULL,
  name                    text          NOT NULL,
  email                   text          NOT NULL,
  role                    text          NOT NULL DEFAULT 'participant',
  -- is_admin and is_super_admin are computed from role and cannot be set directly
  is_admin                boolean       GENERATED ALWAYS AS (role IN ('admin', 'super_admin')) STORED,
  is_super_admin          boolean       GENERATED ALWAYS AS (role = 'super_admin') STORED,
  phone                   text,
  photo_url               text,
  bio                     text,
  notification_preference text,
  created_at              timestamptz   NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT profiles_pkey
    PRIMARY KEY (id),

  CONSTRAINT profiles_id_fkey
    FOREIGN KEY (id)
    REFERENCES auth.users (id)
    ON DELETE CASCADE,

  CONSTRAINT profiles_email_unique
    UNIQUE (email),

  CONSTRAINT profiles_role_check
    CHECK (role IN ('participant', 'presenter', 'admin', 'super_admin')),

  CONSTRAINT profiles_notification_preference_check
    CHECK (notification_preference IN ('email', 'sms'))
);

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS profiles_email_idx
  ON public.profiles (email);

CREATE INDEX IF NOT EXISTS profiles_role_idx
  ON public.profiles (role);

-- Index admins/super_admins via role (is_admin and is_super_admin are generated)
CREATE INDEX IF NOT EXISTS profiles_admin_role_idx
  ON public.profiles (role)
  WHERE role IN ('admin', 'super_admin');

-- -----------------------------------------------------------------------------
-- Auto-create profile on signup trigger
-- Reads name and role from the metadata passed during supabase.auth.signUp()
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', 'Unknown'),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'participant')
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can read any profile
-- (needed so attendee lists, user selectors, etc. can resolve names)
CREATE POLICY "profiles_select_authenticated"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can only update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Only admins can insert profiles manually
-- (normal inserts happen via the trigger above)
CREATE POLICY "profiles_insert_admin"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

-- Only super admins can delete profiles
CREATE POLICY "profiles_delete_super_admin"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (
    (SELECT is_super_admin FROM public.profiles WHERE id = auth.uid())
  );

-- -----------------------------------------------------------------------------
-- Grants
-- -----------------------------------------------------------------------------
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
