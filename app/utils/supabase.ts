import { createClient } from "@supabase/supabase-js";

/**
 * Initialize a supabase client, used to make API calls.
 */
export const supabase = createClient(
  process.env.API_URL as string,
  process.env.API_KEY as string
);
