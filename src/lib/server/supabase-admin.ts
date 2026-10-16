import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Service-role client for API routes only. Bypasses row-level security, so
// never import this from a client component.
export function adminClient(): SupabaseClient | null {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return null;
    return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
