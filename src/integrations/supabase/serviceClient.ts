import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Service role client — bypasses RLS for privileged operations.
// Used only for: fetching verification tokens, checking email_verified,
// and updating email_verified on the verify page.
// Never expose this client to untrusted user input.

const SUPABASE_URL = "https://mmvgiwrlehbzipbhksgs.supabase.co";
const SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY as string;

export const supabaseAdmin = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
