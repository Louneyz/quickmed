// Sales demo mode: the portal and the dispatch dashboard run entirely in the
// visitor's browser on made-up data, with no database behind them. Any username
// and password (or none) opens the demo, and a toggle switches between the
// pharmacy view and QuickMed's dispatch view.
//
// It is on until NEXT_PUBLIC_PORTAL_MODE=live is set in Vercel (then redeploy);
// that switches back to real Supabase logins and data.
//
// Nothing here ever talks to the real database, so no real client or patient
// record can appear in the demo. Whatever a visitor enters stays in their own
// browser tab and is gone when they close it.

export const DEMO_ONLY = process.env.NEXT_PUBLIC_PORTAL_MODE !== "live";

export const DEMO_URL = "https://demo.quickmed.invalid";

export type DemoView = "pharmacy" | "staff";

const STORE_KEY = "quickmed-demo-data-v2";
const VIEW_KEY = "quickmed-demo-view";
const USER_ID = "00000000-0000-4000-8000-0000000000d1";
const EMAIL = "demo@accounts.quickmed.ca";
const DAY = 24 * 60 * 60 * 1000;

type Row = Record<string, unknown>;
type Db = { pharmacies: Row[]; profiles: Row[]; delivery_requests: Row[]; deliveries: Row[] };

export function demoView(): DemoView {
    try {
        return sessionStorage.getItem(VIEW_KEY) === "staff" ? "staff" : "pharmacy";
    } catch {
        return "pharmacy";
    }
}

// Switches between the pharmacy portal and the dispatch dashboard.
export function switchDemoView(view: DemoView) {
    try {
        sessionStorage.setItem(VIEW_KEY, view);
    } catch {}
    window.location.assign(view === "staff" ? "/admin" : "/portal");
}

const user = {
    id: USER_ID,
    aud: "authenticated",
    role: "authenticated",
    email: EMAIL,
    app_metadata: { provider: "email", providers: ["email"] },
    user_metadata: { full_name: "Demo" },
    created_at: "2026-01-05T14:00:00.000Z",
};

// ---- Made-up data -----------------------------------------------------------
// All names, addresses and numbers are invented (555 numbers are reserved for fiction).

const firstNames = ["Alex", "Jordan", "Casey", "Riley", "Sam", "Taylor", "Morgan", "Jamie", "Avery", "Drew", "Quinn", "Robin", "Parker", "Reese", "Skyler", "Emerson", "Rowan", "Hayden", "Sage", "Finley"];
const lastNames = ["Morgan", "Reyes", "Lindqvist", "Fontaine", "Achebe", "Nakamura", "Okonkwo", "Castellano", "Petrov", "Haddad", "Abernathy", "Delacroix", "Moreau", "Singh", "Kowalski", "Oyelaran", "Bergstrom", "Tanaka", "Ferreira", "Novak"];
const streets = ["Elm Grove Ave", "Harbour View Rd", "Cedar Park Blvd", "Birchmount Crt", "Willow Bend", "Lakeshore Terr", "Orchard Lane", "Summit Ridge Dr", "Riverstone Way", "Foxglove Cres", "Juniper Hollow", "Bayside Ave", "Maplewood Dr", "Thornhill Rd", "Aspen Gate"];
const postals = ["M6K 2H8", "M5J 2N8", "M4E 1B2", "M1N 3J4", "M4C 5K1", "M8V 1Z3", "M4L 2T6", "M4J 3P9", "M4K 1N2", "M1L 4G7", "M4B 2R5", "M4M 3C1"];
const flagSets: string[][] = [[], [], [], ["refrigerated"], ["narcotic"], ["asap"], ["cod"], ["reverse_pickup"], ["refrigerated", "asap"]];
const notes = [null, null, "Please pick up after 2pm.", "Side door, ring twice.", "Patient prefers a call on arrival.", null, "Fragile, keep upright."];

const pharmacySeeds: [string, string, string, string, string, number, string][] = [
    // name, contact, phone, street, city, deliveries per week, status
    ["Maple Street Pharmacy", "Dana Whitfield", "(416) 555-0100", "100 Maple St", "Toronto", 9, "active"],
    ["Riverside Drug Mart", "Omar Siddiqui", "(416) 555-0141", "220 River Rd", "Toronto", 7, "active"],
    ["Bloorview Pharmacy", "Grace Liu", "(647) 555-0162", "1450 Bloor St W", "Toronto", 5, "active"],
    ["Danforth Health Pharmacy", "Nikos Papadakis", "(416) 555-0177", "880 Danforth Ave", "Toronto", 4, "active"],
    ["Lakeshore Apothecary", "Priya Raman", "(416) 555-0119", "3100 Lake Shore Blvd W", "Etobicoke", 3, "active"],
    ["Scarborough Care Pharmacy", "Marcus Bennett", "(416) 555-0186", "2500 Kingston Rd", "Scarborough", 0, "paused"],
];

const pendingSeeds: [string, string, string, string, string, string, number][] = [
    // name, contact, phone, email, street, city, hours ago
    ["Yonge & Eglinton Pharmacy", "Sofia Marchetti", "(416) 555-0153", "sofia@yongeeglinton-demo.ca", "2300 Yonge St", "Toronto", 3],
    ["North York Family Pharmacy", "Daniel Osei", "(647) 555-0198", "daniel@nyfamily-demo.ca", "5000 Yonge St", "North York", 26],
];

// Small seeded random so every demo starts with the same believable data.
function rng(seed: number) {
    return () => {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
    };
}

function seed(): Db {
    const rand = rng(42);
    const pick = <T,>(list: T[]) => list[Math.floor(rand() * list.length)];
    const db: Db = { pharmacies: [], profiles: [], delivery_requests: [], deliveries: [] };

    pharmacySeeds.forEach(([name, contact, phone, street, city, perWeek, status], i) => {
        const id = `00000000-0000-4000-8000-0000000000a${i}`;
        const email = i === 0 ? EMAIL : `${contact.split(" ")[0].toLowerCase()}@${name.toLowerCase().replace(/[^a-z]+/g, "")}-demo.ca`;
        db.pharmacies.push({
            id, name, contact_name: contact, email, phone, street, city, province: "ON",
            postal_code: pick(postals), notes: null, status, is_demo: false, source: "admin",
            created_at: new Date(Date.now() - (200 - i * 25) * DAY).toISOString(),
        });
        db.profiles.push({
            id: i === 0 ? USER_ID : `00000000-0000-4000-8000-0000000000b${i}`,
            role: "pharmacy", pharmacy_id: id, full_name: contact, email,
            created_at: new Date(Date.now() - (195 - i * 25) * DAY).toISOString(),
        });

        // A month of history, busiest clients most often. Paused clients stopped five weeks ago.
        const total = perWeek ? perWeek * 4 : 6;
        for (let n = 0; n < total; n++) {
            // Every active client sent two requests today: one early (delivered by now), one recent (still out).
            const today = perWeek > 0 && n < 2;
            const daysAgo = today ? 0 : perWeek ? 1 + Math.floor(rand() * 27) : 36 + Math.floor(rand() * 20);
            const sent = new Date(Date.now() - daysAgo * DAY);
            if (today) sent.setTime(Date.now() - (n === 0 ? 5 : 0.75) * 60 * 60 * 1000);
            else sent.setHours(8 + Math.floor(rand() * 9), Math.floor(rand() * 4) * 15, 0, 0);
            const requestId = crypto.randomUUID();
            db.delivery_requests.push({
                id: requestId, pharmacy_id: id, submitted_by: null,
                delivery_date: sent.toISOString().slice(0, 10), notes: pick(notes), created_at: sent.toISOString(),
            });
            const stops = rand() < 0.3 ? 2 : 1;
            for (let s = 0; s < stops; s++) {
                const done = new Date(sent.getTime() + (today ? 1.5 + rand() : 2 + rand() * 4) * 60 * 60 * 1000);
                const pending = done.getTime() > Date.now();
                db.deliveries.push({
                    id: crypto.randomUUID(), request_id: requestId, pharmacy_id: id,
                    patient_first_name: pick(firstNames), patient_last_name: pick(lastNames),
                    street: `${10 + Math.floor(rand() * 890)} ${pick(streets)}`, street2: null,
                    city, province: "ON", postal_code: pick(postals),
                    phone: `(${rand() < 0.5 ? 416 : 647}) 555-01${String(Math.floor(rand() * 100)).padStart(2, "0")}`,
                    flags: pick(flagSets), status: pending ? "pending" : "completed",
                    completed_at: pending ? null : done.toISOString(),
                    completed_by: null, redacted_at: null, created_at: sent.toISOString(),
                });
            }
        }
    });

    pendingSeeds.forEach(([name, contact, phone, email, street, city, hoursAgo], i) => {
        db.pharmacies.push({
            id: `00000000-0000-4000-8000-0000000000c${i}`, name, contact_name: contact, email, phone, street, city,
            province: "ON", postal_code: null, notes: null, status: "pending", is_demo: false, source: "signup",
            created_at: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
        });
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

// ---- What the client sees ----------------------------------------------------

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

// The signed-in demo user is the Maple Street pharmacist or a QuickMed dispatcher,
// depending on the toggle.
function currentProfile(db: Db): Row {
    if (demoView() === "staff") {
        return { id: USER_ID, role: "staff", pharmacy_id: null, full_name: "QuickMed Dispatch (Demo)", email: EMAIL };
    }
    return db.profiles.find((p) => p.id === USER_ID)!;
}

const myPharmacyId = (db: Db) => (demoView() === "staff" ? null : (currentProfile(db).pharmacy_id as string));

function stats(db: Db, p: Row): Row {
    const mine = db.deliveries.filter((d) => d.pharmacy_id === p.id);
    const requests = db.delivery_requests.filter((r) => r.pharmacy_id === p.id);
    const done = mine.filter((d) => d.status === "completed");
    const latest = (rows: Row[], key: string) =>
        rows.map((r) => r[key] as string | null).filter(Boolean).sort().at(-1) ?? null;
    return {
        pharmacy_id: p.id, name: p.name, contact_name: p.contact_name, email: p.email, phone: p.phone,
        status: p.status, is_demo: p.is_demo, created_at: p.created_at,
        request_count: requests.length, delivery_count: mine.length, completed_count: done.length,
        pending_count: mine.filter((d) => d.status === "pending").length,
        last_request_at: latest(requests, "created_at"), last_delivery_at: latest(done, "completed_at"),
        source: p.source, street: p.street, city: p.city,
    };
}

function withJoins(db: Db, row: Row) {
    const request = db.delivery_requests.find((r) => r.id === row.request_id);
    const pharmacy = db.pharmacies.find((p) => p.id === row.pharmacy_id);
    return {
        ...row,
        delivery_requests: request ? { delivery_date: request.delivery_date, notes: request.notes } : null,
        pharmacies: pharmacy ? { name: pharmacy.name, is_demo: false } : null,
    };
}

// Applies the PostgREST filters the app uses: eq/neq/gte/lte, ilike search (or=...), order and paging.
function query(rows: Row[], params: URLSearchParams) {
    let out = rows;
    for (const [key, value] of params) {
        if (key.includes(".") || ["select", "order", "limit", "offset", "or"].includes(key)) continue;
        const [op, ...rest] = value.split(".");
        const v = rest.join(".");
        if (op === "eq") out = out.filter((r) => String(r[key]) === v);
        else if (op === "neq") out = out.filter((r) => String(r[key]) !== v);
        else if (op === "gte") out = out.filter((r) => r[key] != null && String(r[key]) >= v);
        else if (op === "lte") out = out.filter((r) => r[key] != null && String(r[key]) <= v);
    }
    const term = params.get("or")?.match(/ilike\.\*([^*,)]*)\*/)?.[1]?.toLowerCase();
    if (term) {
        out = out.filter((r) =>
            ["patient_first_name", "patient_last_name", "street", "city", "phone", "postal_code"].some((k) =>
                String(r[k] ?? "").toLowerCase().includes(term),
            ),
        );
    }
    const order = params.get("order");
    if (order) {
        const [col, dir] = order.split(".");
        out = [...out].sort((a, b) => String(a[col] ?? "").localeCompare(String(b[col] ?? "")) * (dir === "desc" ? -1 : 1));
    }
    const total = out.length;
    const offset = Number(params.get("offset") ?? 0);
    const limit = params.has("limit") ? Number(params.get("limit")) : out.length;
    return { rows: out.slice(offset, offset + limit), total };
}

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
    new Response(body === null ? null : JSON.stringify(body), {
        status,
        headers: { "content-type": "application/json", ...headers },
    });

function submit(db: Db, body: { p_delivery_date: string | null; p_notes: string; p_stops: Row[] }) {
    const pharmacyId = myPharmacyId(db);
    if (!pharmacyId) return json({ message: "Only pharmacy accounts can submit delivery requests", code: "42501" }, 403);
    if (!Array.isArray(body.p_stops) || body.p_stops.length === 0) {
        return json({ message: "Add at least one patient", code: "22023" }, 400);
    }
    const now = new Date().toISOString();
    const requestId = crypto.randomUUID();
    db.delivery_requests.push({
        id: requestId, pharmacy_id: pharmacyId, submitted_by: USER_ID,
        delivery_date: body.p_delivery_date, notes: body.p_notes?.trim() || null, created_at: now,
    });
    for (const stop of body.p_stops) {
        const text = (key: string) => (typeof stop[key] === "string" && (stop[key] as string).trim()) || null;
        db.deliveries.push({
            id: crypto.randomUUID(), request_id: requestId, pharmacy_id: pharmacyId,
            patient_first_name: text("first_name"), patient_last_name: text("last_name"),
            street: text("street"), street2: text("street2"), city: text("city"),
            province: text("province") ?? "ON", postal_code: text("postal_code")?.toUpperCase() ?? null,
            phone: text("phone"), flags: Array.isArray(stop.flags) ? stop.flags : [],
            status: "pending", completed_at: null, completed_by: null, redacted_at: null, created_at: now,
        });
    }
    save(db);
    return json(requestId);
}

// Onboarding (and approving a pending partner) without sending any email.
function onboard(db: Db, body: { pharmacyId?: string; pharmacy?: Row; contactName?: string; email?: string }) {
    let id = body.pharmacyId;
    if (id) {
        const p = db.pharmacies.find((x) => x.id === id);
        if (p && (p.status === "pending" || p.status === "denied")) p.status = "active";
    } else {
        id = crypto.randomUUID();
        db.pharmacies.push({
            id, name: body.pharmacy?.name ?? "New pharmacy", contact_name: body.contactName ?? null, email: body.email,
            phone: body.pharmacy?.phone ?? null, street: body.pharmacy?.street ?? null, city: body.pharmacy?.city ?? null,
            province: body.pharmacy?.province ?? "ON", postal_code: body.pharmacy?.postal_code ?? null,
            notes: body.pharmacy?.notes ?? null, status: "active", is_demo: false, source: "admin",
            created_at: new Date().toISOString(),
        });
    }
    db.profiles.push({
        id: crypto.randomUUID(), role: "pharmacy", pharmacy_id: id, full_name: body.contactName ?? null,
        email: body.email, created_at: new Date().toISOString(),
    });
    save(db);
    return json({ pharmacyId: id });
}

// Stands in for the network: the Supabase client (and the onboarding call) send
// every request here instead.
export async function demoFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const request = new Request(input, init);
    const url = new URL(request.url, window.location.href);
    const path = url.pathname;
    const body = request.method === "GET" || request.method === "HEAD" ? null : await request.text();

    // Auth: any username and password signs in to the demo.
    if (path === "/auth/v1/token") return json(session());
    if (path === "/auth/v1/user") return json(user);
    if (path === "/auth/v1/logout") return new Response(null, { status: 204 });
    if (path.startsWith("/auth/v1/")) return json({});

    const db = load();
    if (path === "/api/admin/clients") return onboard(db, JSON.parse(body || "{}"));
    if (path === "/rest/v1/rpc/submit_delivery_request") return submit(db, JSON.parse(body || "{}"));

    const staff = demoView() === "staff";
    const mine = myPharmacyId(db);
    const visible = (rows: Row[], key = "pharmacy_id") => (staff ? rows : rows.filter((r) => r[key] === mine));

    const table = path.replace("/rest/v1/", "");
    const single = request.headers.get("accept")?.includes("vnd.pgrst.object");
    const wantsCount = request.headers.get("prefer")?.includes("count=");
    const respond = ({ rows, total }: { rows: Row[]; total: number }) => {
        const headers: Record<string, string> = wantsCount ? { "content-range": `0-${Math.max(rows.length - 1, 0)}/${total}` } : {};
        if (request.method === "HEAD") return new Response(null, { status: 200, headers });
        if (single) return rows[0] ? json(rows[0], 200, headers) : json({ message: "No rows", code: "PGRST116" }, 406);
        return json(rows, 200, headers);
    };

    if (request.method === "PATCH") {
        const patch = JSON.parse(body || "{}") as Row;
        const id = url.searchParams.get("id")?.replace(/^eq\./, "");
        if (staff && table === "deliveries") {
            const row = db.deliveries.find((d) => d.id === id);
            if (row && typeof patch.status === "string") {
                row.status = patch.status;
                row.completed_at = patch.status === "completed" ? new Date().toISOString() : null;
                save(db);
            }
            return respond({ rows: row ? [row] : [], total: row ? 1 : 0 });
        }
        if (staff && table === "pharmacies") {
            const row = db.pharmacies.find((p) => p.id === id);
            if (row) {
                Object.assign(row, patch);
                save(db);
            }
            return respond({ rows: row ? [row] : [], total: row ? 1 : 0 });
        }
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
        return json({ message: "That isn't available in the demo.", code: "42501" }, 403);
    }

    switch (table) {
        case "profiles": {
            const me = currentProfile(db);
            // The dispatcher's own profile stands in for the demo user's id.
            const rows = staff ? [me, ...db.profiles.filter((p) => p.id !== USER_ID)] : [me];
            return respond(query(rows, url.searchParams));
        }
        case "pharmacies":
            return respond(query(visible(db.pharmacies, "id"), url.searchParams));
        case "pharmacy_stats":
            return respond(query(visible(db.pharmacies, "id").map((p) => stats(db, p)), url.searchParams));
        case "delivery_requests":
            return respond(query(visible(db.delivery_requests), url.searchParams));
        case "deliveries": {
            const result = query(visible(db.deliveries), url.searchParams);
            return respond({ rows: result.rows.map((r) => withJoins(db, r)), total: result.total });
        }
        default:
            return respond({ rows: [], total: 0 });
    }
}
