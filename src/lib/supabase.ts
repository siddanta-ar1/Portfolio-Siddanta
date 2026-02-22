import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function createSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "[supabase] Missing environment variables. " +
        "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.",
    );
    return null;
  }

  if (!isValidHttpUrl(supabaseUrl)) {
    console.warn(
      `[supabase] NEXT_PUBLIC_SUPABASE_URL is not a valid URL ("${supabaseUrl}"). ` +
        "It should look like https://your-project-id.supabase.co",
    );
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createSupabaseClient();
