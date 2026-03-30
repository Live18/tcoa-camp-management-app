-- =============================================================================
-- Migration: Create notifications table
-- Description: In-app notification records written whenever a significant
--              action occurs (e.g. admin granted/revoked, attendee assigned).
--              Rows are inserted by the app and by the notificationService.
--              External delivery (email/SMS) is handled separately via the
--              send-email Edge Function; this table provides an audit trail
--              and enables an in-app notification inbox.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id         bigint      GENERATED ALWAYS AS IDENTITY,
  user_id    uuid,
  title      text        NOT NULL DEFAULT '',
  message    text        NOT NULL DEFAULT '',
  type       text        NOT NULL DEFAULT 'general',
  status     text        NOT NULL DEFAULT 'unread',
  created_at timestamptz NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT notifications_pkey
    PRIMARY KEY (id),

  CONSTRAINT notifications_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES public.profiles (id)
    ON DELETE CASCADE,

  CONSTRAINT notifications_type_check
    CHECK (type IN ('general', 'assignment', 'admin', 'system')),

  CONSTRAINT notifications_status_check
    CHECK (status IN ('unread', 'read', 'dismissed'))
);

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS notifications_user_id_idx
  ON public.notifications (user_id);

-- Efficiently query unread notifications for a user
CREATE INDEX IF NOT EXISTS notifications_user_status_idx
  ON public.notifications (user_id, status)
  WHERE status = 'unread';

CREATE INDEX IF NOT EXISTS notifications_created_at_idx
  ON public.notifications (created_at DESC);

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only read their own notifications;
-- admins can read all notifications
CREATE POLICY "notifications_select"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

-- The app inserts notifications on behalf of any user, so any authenticated
-- user can insert (the service functions control who actually calls this)
CREATE POLICY "notifications_insert_authenticated"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users can update (mark as read/dismissed) their own notifications;
-- admins can update any notification
CREATE POLICY "notifications_update"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
    OR (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  )
  WITH CHECK (
    auth.uid() = user_id
    OR (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

-- Users can delete their own notifications; admins can delete any
CREATE POLICY "notifications_delete"
  ON public.notifications
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id
    OR (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

-- -----------------------------------------------------------------------------
-- Grants
-- -----------------------------------------------------------------------------
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
