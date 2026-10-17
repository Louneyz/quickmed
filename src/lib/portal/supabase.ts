import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { DEMO_ONLY, DEMO_URL, demoFetch } from "./demo";

// Browser-only Supabase client for the portal and admin app. Patient data goes
// straight from the browser to the Canadian database; it never passes through
// our own server. Only imported from portal routes, so the marketing pages
// never download it.
//
// In demo mode (see demo.ts) the same client runs against made-up data in the
// browser instead, so every portal page works without a database.

let client: SupabaseClient | null = null;

export const isConfigured =
    DEMO_ONLY || Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export function supabase(): SupabaseClient {
    if (!client) {
        client = DEMO_ONLY
            ? createClient(DEMO_URL, "demo", {
                  auth: { persistSession: true, autoRefreshToken: false, detectSessionInUrl: false, storageKey: "quickmed-demo-auth" },
                  global: { fetch: demoFetch },
              })
            : createClient(
                  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://localhost",
                  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "missing",
                  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } },
              );
    }
    return client;
}
