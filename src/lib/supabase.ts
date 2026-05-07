import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn("Supabase credentials missing. Leaderboard and points will not sync.");
}

/**
 * IMPORTANT SECURITY NOTE:
 * We use the Publishable Key (VITE_SUPABASE_PUBLISHABLE_KEY) for the frontend.
 * This key respects Row Level Security (RLS) policies.
 * 
 * The Secret Key (SUPABASE_SECRET_KEY) must NEVER be used here as it bypasses RLS
 * and would be exposed to the public in the production bundle.
 */
export const supabase = createClient(
  supabaseUrl || "https://your-project.supabase.co",
  supabasePublishableKey || "your-publishable-key"
);
