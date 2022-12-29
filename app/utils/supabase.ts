import { createClient } from "@supabase/supabase-js";
import type { Database } from "~/types/supabase";

/**
 * Initialize a supabase client, used to make API calls.
 */
export const supabase = createClient<Database>(
  process.env.API_URL as string,
  process.env.API_KEY as string
);
