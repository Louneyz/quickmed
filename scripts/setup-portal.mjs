// One-command setup for the pharmacy portal, run after the schema is in Supabase:
//
//   npm run setup:portal
//
// Reads .env.local. It is safe to run again at any time:
//   * STAFF_EMAIL + STAFF_PASSWORD  create (or reset) a QuickMed staff login for /admin.
//   * DEMO_PASSWORD                 create (or reset) the sales demo login and reload its sample data.
//     DEMO_USERNAME (default "demo") is what salespeople type in the login box.
//
// The demo is an ordinary pharmacy account flagged is_demo, so row-level security
// keeps it from ever seeing real clients' data. Passwords live only in .env.local
// and Supabase, never in the repo.

import { createClient } from "@supabase/supabase-js";

// Must match USERNAME_DOMAIN in src/lib/portal/session.tsx.
const USERNAME_DOMAIN = "accounts.quickmed.ca";
const DEMO_PHARMACY = "Maple Street Pharmacy (Demo)";

const env = process.env;
const fail = (message) => {
    console.error(`\n✗ ${message}\n`);
    process.exit(1);
};

if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    fail("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local (see .env.example).");
}
if (!env.STAFF_EMAIL && !env.DEMO_PASSWORD) {
    fail("Nothing to do: set STAFF_EMAIL + STAFF_PASSWORD and/or DEMO_PASSWORD in .env.local.");
}

const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
});

const { error: schemaError } = await db.from("pharmacies").select("id, is_demo").limit(1);
if (schemaError) {
    fail(
        "The portal tables aren't in this Supabase project yet. Open SQL Editor, paste " +
            "supabase/migrations/0001_portal.sql, run it, then run this again.\n  " +
            `(${schemaError.message})`,
    );
}

async function findUser(email) {
    for (let page = 1; ; page++) {
        const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 });
        if (error) fail(`Couldn't list users: ${error.message}`);
        const user = data.users.find((u) => u.email?.toLowerCase() === email);
        if (user || data.users.length < 1000) return user ?? null;
    }
}

// Creates the login, or resets its password if it already exists. No email is sent.
async function upsertLogin(email, password, fullName) {
    const existing = await findUser(email);
    if (existing) {
        const { error } = await db.auth.admin.updateUserById(existing.id, { password, email_confirm: true });
        if (error) fail(`Couldn't update ${email}: ${error.message}`);
        return existing.id;
    }
    const { data, error } = await db.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName },
    });
    if (error) fail(`Couldn't create ${email}: ${error.message}`);
    return data.user.id;
}

async function upsertProfile(profile) {
    const { error } = await db.from("profiles").upsert(profile);
    if (error) fail(`Couldn't save profile for ${profile.email}: ${error.message}`);
}

// ---- Staff login --------------------------------------------------------------

if (env.STAFF_EMAIL) {
    const email = env.STAFF_EMAIL.trim().toLowerCase();
    if (!env.STAFF_PASSWORD || env.STAFF_PASSWORD.length < 12) {
        fail("STAFF_PASSWORD must be at least 12 characters.");
    }
    const id = await upsertLogin(email, env.STAFF_PASSWORD, env.STAFF_NAME ?? "QuickMed");
    await upsertProfile({ id, role: "staff", pharmacy_id: null, full_name: env.STAFF_NAME ?? null, email });
    console.log(`✓ Staff login ready: ${email} → /admin`);
}

// ---- Sales demo ---------------------------------------------------------------

if (env.DEMO_PASSWORD) {
    const username = (env.DEMO_USERNAME ?? "demo").trim().toLowerCase();
    const email = `${username}@${USERNAME_DOMAIN}`;

    let { data: pharmacy } = await db.from("pharmacies").select("id").eq("is_demo", true).maybeSingle();
    if (!pharmacy) {
        const { data, error } = await db
            .from("pharmacies")
            .insert({
                name: DEMO_PHARMACY,
                contact_name: "Demo Pharmacist",
                email,
                phone: "(416) 555-0100",
                street: "100 Maple St",
                city: "Toronto",
                province: "ON",
                postal_code: "M4M 1A1",
                notes: "Sales demo account. Sample data only; reset with npm run setup:portal.",
                is_demo: true,
            })
            .select("id")
            .single();
        if (error) fail(`Couldn't create the demo pharmacy: ${error.message}`);
        pharmacy = data;
    }

    const userId = await upsertLogin(email, env.DEMO_PASSWORD, "Demo Pharmacist");
    await upsertProfile({ id: userId, role: "pharmacy", pharmacy_id: pharmacy.id, full_name: "Demo Pharmacist", email });

    // Reload sample deliveries so every demo starts from the same clean state.
    await db.from("delivery_requests").delete().eq("pharmacy_id", pharmacy.id);

    const day = 24 * 60 * 60 * 1000;
    const at = (daysAgo, hour) => {
        const d = new Date(Date.now() - daysAgo * day);
        d.setHours(hour, 0, 0, 0);
        return d;
    };
    const dateOnly = (d) => d.toISOString().slice(0, 10);

    // All names, addresses and numbers below are made up (555 numbers are reserved for fiction).
    const requests = [
        { daysAgo: 0, notes: "Please pick up after 2pm.", stops: [
            ["Alex", "Morgan", "12 Elm Grove Ave", "M6K 2H8", "(416) 555-0134", ["refrigerated"], "pending"],
            ["Jordan", "Reyes", "88 Harbour View Rd", "M5J 2N8", "(647) 555-0172", ["asap"], "pending"],
        ] },
        { daysAgo: 0, notes: null, stops: [
            ["Casey", "Lindqvist", "401 Cedar Park Blvd", "M4E 1B2", "(416) 555-0118", ["narcotic"], "pending"],
        ] },
        { daysAgo: 1, notes: "Side door, ring twice.", stops: [
            ["Riley", "Fontaine", "7 Birchmount Crt", "M1N 3J4", "(416) 555-0156", [], "completed"],
            ["Sam", "Achebe", "230 Willow Bend", "M4C 5K1", "(647) 555-0193", ["cod"], "completed"],
        ] },
        { daysAgo: 3, notes: null, stops: [
            ["Taylor", "Nakamura", "56 Lakeshore Terr", "M8V 1Z3", "(416) 555-0121", ["refrigerated"], "completed"],
        ] },
        { daysAgo: 5, notes: null, stops: [
            ["Morgan", "Okonkwo", "19 Orchard Lane", "M4L 2T6", "(416) 555-0147", [], "completed"],
            ["Jamie", "Castellano", "77 Summit Ridge Dr", "M4J 3P9", "(647) 555-0165", ["reverse_pickup"], "completed"],
            ["Avery", "Petrov", "305 Riverstone Way", "M4K 1N2", "(416) 555-0109", [], "completed"],
        ] },
        { daysAgo: 8, notes: "Patient prefers a call on arrival.", stops: [
            ["Drew", "Haddad", "41 Foxglove Cres", "M1L 4G7", "(416) 555-0187", ["narcotic"], "completed"],
        ] },
        { daysAgo: 12, notes: null, stops: [
            ["Quinn", "Abernathy", "9 Juniper Hollow", "M4B 2R5", "(647) 555-0128", [], "completed"],
            ["Robin", "Delacroix", "612 Bayside Ave", "M4M 3C1", "(416) 555-0140", ["refrigerated", "asap"], "completed"],
        ] },
    ];

    let stopCount = 0;
    for (const r of requests) {
        const sentAt = at(r.daysAgo, 9 + (stopCount % 4));
        const { data: request, error } = await db
            .from("delivery_requests")
            .insert({ pharmacy_id: pharmacy.id, submitted_by: userId, delivery_date: dateOnly(sentAt), notes: r.notes, created_at: sentAt.toISOString() })
            .select("id")
            .single();
        if (error) fail(`Couldn't seed demo data: ${error.message}`);

        const rows = r.stops.map(([first, last, street, postal, phone, flags, status]) => ({
            request_id: request.id,
            pharmacy_id: pharmacy.id,
            patient_first_name: first,
            patient_last_name: last,
            street,
            city: "Toronto",
            province: "ON",
            postal_code: postal,
            phone,
            flags,
            status,
            created_at: sentAt.toISOString(),
            completed_at: status === "completed" ? new Date(sentAt.getTime() + 4 * 60 * 60 * 1000).toISOString() : null,
        }));
        const { error: stopError } = await db.from("deliveries").insert(rows);
        if (stopError) fail(`Couldn't seed demo deliveries: ${stopError.message}`);
        stopCount += rows.length;
    }

    console.log(`✓ Demo login ready: username "${env.DEMO_USERNAME ?? "demo"}" → /portal (${stopCount} sample deliveries loaded)`);
}

console.log("\nDone. Log in at /login.");
