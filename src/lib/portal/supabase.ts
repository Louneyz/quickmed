import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Browser-only Supabase client for the portal and admin app. Patient data goes
// straight from the browser to the Canadian database; it never passes through
// our own server. Only imported from portal routes, so the marketing pages
// never download it.

let client: SupabaseClient | null = null;

export const isConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export function supabase(): SupabaseClient {
    if (!client) {
        client = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://localhost",
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "missing",
            { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } },
        );
    }
    return client;
}
