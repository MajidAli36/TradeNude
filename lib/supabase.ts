import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as
  | string
  | undefined;

if (!supabaseUrl || !serviceRoleKey) {
  console.warn(
    "Supabase env vars are not set. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local."
  );
}

export const supabase = createClient(
  supabaseUrl || "",
  serviceRoleKey || "",
  {
    auth: {
      persistSession: false,
    },
  }
);

