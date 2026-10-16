import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Onboards a pharmacy (or adds a login to an existing one) and emails the
// contact an invite to set their password. Needs the service-role key, so it
// runs on the server. It only handles pharmacy contact details, never patient data.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
    pharmacyId?: string;
    pharmacy?: {
        name: string;
        phone?: string;
        street?: string;
        city?: string;
        province?: string;
        postal_code?: string;
        notes?: string;
    };
    contactName?: string;
    email: string;
};

const clean = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : null);

export async function POST(request: Request) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) {
        return NextResponse.json({ error: "The portal database isn't configured." }, { status: 503 });
    }

    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

    // Only signed-in QuickMed staff may onboard clients.
    const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
    const { data: caller } = await admin.auth.getUser(token);
    if (!caller.user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
    const { data: callerProfile } = await admin
        .from("profiles")
        .select("role")
        .eq("id", caller.user.id)
        .maybeSingle();
    if (callerProfile?.role !== "staff") {
        return NextResponse.json({ error: "Only QuickMed staff can onboard clients." }, { status: 403 });
    }

    let body: Body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const email = clean(body.email)?.toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: "Enter a valid email for the login." }, { status: 400 });
    }

    let pharmacyId = clean(body.pharmacyId);
    let createdPharmacy = false;

    if (!pharmacyId) {
        const name = clean(body.pharmacy?.name);
        if (!name) return NextResponse.json({ error: "Enter the pharmacy's name." }, { status: 400 });
        const { data, error } = await admin
            .from("pharmacies")
            .insert({
                name,
                contact_name: clean(body.contactName),
                email,
                phone: clean(body.pharmacy?.phone),
                street: clean(body.pharmacy?.street),
                city: clean(body.pharmacy?.city),
                province: clean(body.pharmacy?.province) ?? "ON",
                postal_code: clean(body.pharmacy?.postal_code)?.toUpperCase() ?? null,
                notes: clean(body.pharmacy?.notes),
            })
            .select("id")
            .single();
        if (error || !data) return NextResponse.json({ error: "Couldn't save the pharmacy." }, { status: 500 });
        pharmacyId = data.id as string;
        createdPharmacy = true;
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
    const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${origin}/set-password`,
        data: { full_name: clean(body.contactName) },
    });

    if (inviteError || !invited.user) {
        if (createdPharmacy) await admin.from("pharmacies").delete().eq("id", pharmacyId);
        const taken = inviteError?.message?.toLowerCase().includes("already");
        return NextResponse.json(
            { error: taken ? "That email already has a QuickMed login." : "Couldn't send the invite email." },
            { status: taken ? 409 : 500 },
        );
    }

    const { error: profileError } = await admin.from("profiles").insert({
        id: invited.user.id,
        role: "pharmacy",
        pharmacy_id: pharmacyId,
        full_name: clean(body.contactName),
        email,
    });
    if (profileError) {
        await admin.auth.admin.deleteUser(invited.user.id);
        if (createdPharmacy) await admin.from("pharmacies").delete().eq("id", pharmacyId);
        return NextResponse.json({ error: "Couldn't link the login to the pharmacy." }, { status: 500 });
    }

    // Approving a pending (or previously denied) partner makes them an active client.
    let approved = false;
    if (!createdPharmacy) {
        const { data: activated } = await admin
            .from("pharmacies")
            .update({ status: "active" })
            .eq("id", pharmacyId)
            .in("status", ["pending", "denied"])
            .select("id");
        approved = Boolean(activated?.length);
    }

    await admin.from("audit_log").insert({
        actor: caller.user.id,
        action: createdPharmacy ? "onboard" : approved ? "approve" : "add_login",
        table_name: "pharmacies",
        row_id: pharmacyId,
        details: { email },
    });

    return NextResponse.json({ pharmacyId });
}
