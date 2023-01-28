import { createServerClient } from "@supabase/auth-helpers-remix";
import type { Database } from "~/types/database";

// Initialize a supabase client to be use on the server-side
export const getSupabaseServerClient = (request: Request, response: Response) =>
  createServerClient<Database>(process.env.API_URL!, process.env.API_KEY!, {
    request,
    response,
  });
