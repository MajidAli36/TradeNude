import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Get Supabase client - creates a new client instance on each call.
 * This ensures environment variables are accessed at runtime, not build time.
 * 
 * @throws Error if environment variables are missing
 */
export function getSupabaseClient(): SupabaseClient {
  // Access environment variables at runtime
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    const missing = [];
    if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
    if (!serviceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
    
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}. ` +
      `Please set these in your Vercel project settings under Environment Variables.`
    );
  }

  try {
    return createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
      },
    });
  } catch (error: any) {
    throw new Error(
      `Failed to create Supabase client: ${error.message}. ` +
      `Please check your Supabase credentials.`
    );
  }
}

