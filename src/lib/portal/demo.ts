// Sales demo mode: the portal runs entirely in the visitor's browser on made-up
// data, with no database behind it. Any username and password (or none) opens
// the demo pharmacy, so QuickMed can show the portal without handing out logins.
//
// It is on until NEXT_PUBLIC_PORTAL_MODE=live is set in Vercel (then redeploy);
// that switches the portal back to real Supabase logins and data.
//
// Nothing here ever talks to the real database, so no real client or patient
// record can appear in the demo. Whatever a visitor enters stays in their own
// browser tab and is gone when they close it.

export const DEMO_ONLY = process.env.NEXT_PUBLIC_PORTAL_MODE !== "live";

export const DEMO_URL = "https://demo.quickmed.invalid";

const STORE_KEY = "quickmed-demo-data";
const USER_ID = "00000000-0000-4000-8000-0000000000d1";
const PHARMACY_ID = "00000000-0000-4000-8000-0000000000a1";
const EMAIL = "demo@accounts.quickmed.ca";

type Row = Record<string, unknown>;
type Db = { delivery_requests: Row[]; deliveries: Row[] };

const pharmacy: Row = {
    id: PHARMACY_ID,
    name: "Maple Street Pharmacy (Demo)",
    contact_name: "Demo Pharmacist",
    email: EMAIL,
    phone: "(416) 555-0100",
    street: "100 Maple St",
    city: "Toronto",
    province: "ON",
    postal_code: "M4M 1A1",
    notes: "Sales demo account. Sample data only.",
    status: "active",
    is_demo: true,
    source: "admin",
    created_at: "2026-01-05T14:00:00.000Z",
};

const profile: Row = { id: USER_ID, role: "pharmacy", pharmacy_id: PHARMACY_ID, full_name: "Demo Pharmacist", email: EMAIL };

const user = {
    id: USER_ID,
    aud: "authenticated",
    role: "authenticated",
    email: EMAIL,
    app_metadata: { provider: "email", providers: ["email"] },
    user_metadata: { full_name: "Demo Pharmacist" },
    created_at: "2026-01-05T14:00:00.000Z",
};

// All names, addresses and numbers are made up (555 numbers are reserved for fiction).
const samples: { daysAgo: number; notes: string | null; stops: [string, string, string, string, string, string[], string][] }[] = [
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

function seed(): Db {
    const db: Db = { delivery_requests: [], deliveries: [] };
    const day = 24 * 60 * 60 * 1000;
    samples.forEach((r, i) => {
        const sent = new Date(Date.now() - r.daysAgo * day);
        sent.setHours(9 + (i % 4), 0, 0, 0);
        const requestId = crypto.randomUUID();
        db.delivery_requests.push({
            id: requestId,
            pharmacy_id: PHARMACY_ID,
            submitted_by: USER_ID,
            delivery_date: sent.toISOString().slice(0, 10),
            notes: r.notes,
            created_at: sent.toISOString(),
        });
        for (const [first, last, street, postal, phone, flags, status] of r.stops) {
            db.deliveries.push({
                id: crypto.randomUUID(),
                request_id: requestId,
                pharmacy_id: PHARMACY_ID,
                patient_first_name: first,
                patient_last_name: last,
                street,
                street2: null,
                city: "Toronto",
                province: "ON",
                postal_code: postal,
                phone,
                flags,
                status,
                completed_at: status === "completed" ? new Date(sent.getTime() + 4 * 60 * 60 * 1000).toISOString() : null,
                completed_by: null,
                redacted_at: null,
                created_at: sent.toISOString(),
            });
        }
    });
    return db;
}

function load(): Db {
    try {
        const saved = sessionStorage.getItem(STORE_KEY);
        if (saved) return JSON.parse(saved) as Db;
    } catch {}
    const db = seed();
    save(db);
    return db;
}

function save(db: Db) {
    try {
        sessionStorage.setItem(STORE_KEY, JSON.stringify(db));
    } catch {}
}

const b64url = (value: object) =>
    btoa(JSON.stringify(value)).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

function session() {
    const exp = Math.floor(Date.now() / 1000) + 12 * 60 * 60;
    return {
        access_token: `${b64url({ alg: "none", typ: "JWT" })}.${b64url({ sub: USER_ID, role: "authenticated", exp })}.demo`,
        token_type: "bearer",
        expires_in: 12 * 60 * 60,
        expires_at: exp,
        refresh_token: "demo",
        user,
    };
}

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
    new Response(body === null ? null : JSON.stringify(body), {
        status,
        headers: { "content-type": "application/json", ...headers },
    });

const withJoins = (db: Db, row: Row) => {
    const request = db.delivery_requests.find((r) => r.id === row.request_id);
    return {
        ...row,
        delivery_requests: request ? { delivery_date: request.delivery_date, notes: request.notes } : null,
        pharmacies: { name: pharmacy.name, is_demo: true },
    };
};

function stats(db: Db): Row {
    const done = db.deliveries.filter((d) => d.status === "completed");
    const latest = (rows: Row[], key: string) =>
        rows.map((r) => r[key] as string | null).filter(Boolean).sort().at(-1) ?? null;
    return {
        pharmacy_id: PHARMACY_ID,
        name: pharmacy.name,
        contact_name: pharmacy.contact_name,
        email: pharmacy.email,
        phone: pharmacy.phone,
        status: pharmacy.status,
        is_demo: true,
        created_at: pharmacy.created_at,
        request_count: db.delivery_requests.length,
        delivery_count: db.deliveries.length,
        completed_count: done.length,
        pending_count: db.deliveries.filter((d) => d.status === "pending").length,
        last_request_at: latest(db.delivery_requests, "created_at"),
        last_delivery_at: latest(done, "completed_at"),
        source: "admin",
        street: pharmacy.street,
        city: pharmacy.city,
    };
}

// Applies the PostgREST filters the portal uses: eq, ilike search (or=...), order and paging.
function query(rows: Row[], params: URLSearchParams) {
    let out = rows;
    for (const [key, value] of params) {
        if (value.startsWith("eq.") && !key.includes(".")) out = out.filter((r) => String(r[key]) === value.slice(3));
    }
    const term = params.get("or")?.match(/ilike\.\*([^*,)]*)\*/)?.[1]?.toLowerCase();
    if (term) {
        out = out.filter((r) =>
            ["patient_first_name", "patient_last_name", "street", "city", "phone", "postal_code"].some((k) =>
                String(r[k] ?? "").toLowerCase().includes(term),
            ),
        );
    }
    if (params.get("order")?.startsWith("created_at.desc")) {
        out = [...out].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
    }
    const offset = Number(params.get("offset") ?? 0);
    const limit = params.has("limit") ? Number(params.get("limit")) : out.length;
    return out.slice(offset, offset + limit);
}

function submit(db: Db, body: { p_delivery_date: string | null; p_notes: string; p_stops: Row[] }) {
    if (!Array.isArray(body.p_stops) || body.p_stops.length === 0) {
        return json({ message: "Add at least one patient", code: "22023" }, 400);
    }
    const now = new Date().toISOString();
    const requestId = crypto.randomUUID();
    db.delivery_requests.push({
        id: requestId,
        pharmacy_id: PHARMACY_ID,
        submitted_by: USER_ID,
        delivery_date: body.p_delivery_date,
        notes: body.p_notes?.trim() || null,
        created_at: now,
    });
    for (const stop of body.p_stops) {
        const text = (key: string) => (typeof stop[key] === "string" && (stop[key] as string).trim()) || null;
        db.deliveries.push({
            id: crypto.randomUUID(),
            request_id: requestId,
            pharmacy_id: PHARMACY_ID,
            patient_first_name: text("first_name"),
            patient_last_name: text("last_name"),
            street: text("street"),
            street2: text("street2"),
            city: text("city"),
            province: text("province") ?? "ON",
            postal_code: text("postal_code")?.toUpperCase() ?? null,
            phone: text("phone"),
            flags: Array.isArray(stop.flags) ? stop.flags : [],
            status: "pending",
            completed_at: null,
            completed_by: null,
            redacted_at: null,
            created_at: now,
        });
    }
    save(db);
    return json(requestId);
}

// Stands in for the network: the Supabase client sends every request here instead.
export async function demoFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const request = new Request(input, init);
    const url = new URL(request.url);
    const path = url.pathname;
    const body = request.method === "GET" || request.method === "HEAD" ? null : await request.text();

    // Auth: any username and password signs in as the demo pharmacist.
    if (path === "/auth/v1/token") return json(session());
    if (path === "/auth/v1/user") return json(user);
    if (path === "/auth/v1/logout") return new Response(null, { status: 204 });
    if (path.startsWith("/auth/v1/")) return json({});

    const db = load();
    const single = request.headers.get("accept")?.includes("vnd.pgrst.object");
    const respond = (rows: Row[]) =>
        single ? (rows[0] ? json(rows[0]) : json({ message: "No rows", code: "PGRST116" }, 406)) : json(rows);

    if (path === "/rest/v1/rpc/submit_delivery_request") return submit(db, JSON.parse(body || "{}"));

    const table = path.replace("/rest/v1/", "");
    if (request.method === "PATCH" && table === "deliveries") {
        const patch = JSON.parse(body || "{}") as Row;
        const id = url.searchParams.get("id")?.replace(/^eq\./, "");
        const row = db.deliveries.find((d) => d.id === id);
        if (row && typeof patch.status === "string") {
            row.status = patch.status;
            row.completed_at = patch.status === "completed" ? new Date().toISOString() : null;
            save(db);
        }
        return respond(row ? [row] : []);
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
        return json({ message: "This is a demo account, so changes aren't saved.", code: "42501" }, 403);
    }

    switch (table) {
        case "profiles":
            return respond(query([profile], url.searchParams));
        case "pharmacies":
            return respond(query([pharmacy], url.searchParams));
        case "pharmacy_stats":
            return respond([stats(db)]);
        case "delivery_requests":
            return respond(query(db.delivery_requests, url.searchParams));
        case "deliveries":
            return respond(query(db.deliveries, url.searchParams).map((r) => withJoins(db, r)));
        default:
            return respond([]);
    }
}
