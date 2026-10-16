import { NextResponse } from "next/server";
import { adminClient } from "@/lib/server/supabase-admin";
import { QUICKMED_INBOX, clean, isEmail, looksLikeSpam, sendEmail } from "@/lib/server/email";

// "Become a partner" pop-up. Saves the pharmacy in the CRM as a pending partner
// for staff to approve or deny, and tells the QuickMed inbox. No login is created here.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

    // Bots get a normal-looking success so they don't retry.
    if (looksLikeSpam(body.website, body.openedAt)) return NextResponse.json({ ok: true });

    const firstName = clean(body.firstName, 80);
    const lastName = clean(body.lastName, 80);
    const pharmacy = clean(body.pharmacy);
    const address = clean(body.address);
    const city = clean(body.city, 80);
    const phone = clean(body.phone, 40);
    const email = clean(body.email)?.toLowerCase() ?? null;

    if (!firstName || !lastName || !pharmacy || !address || !city || !phone || !isEmail(email)) {
        return NextResponse.json({ error: "Please fill in every field with a valid email." }, { status: 400 });
    }

    const db = adminClient();
    if (!db) return NextResponse.json({ error: "Sign-ups aren't available right now. Please call (416) 834-9123." }, { status: 503 });

    // Same pharmacy sending twice: keep one pending entry.
    const { data: existing } = await db.from("pharmacies").select("id").eq("email", email).limit(1).maybeSingle();
    if (existing) return NextResponse.json({ ok: true });

    const { data, error } = await db
        .from("pharmacies")
        .insert({
            name: pharmacy,
            contact_name: `${firstName} ${lastName}`,
            email,
            phone,
            street: address,
            city,
            province: "ON",
            status: "pending",
            source: "signup",
        })
        .select("id")
        .single();
    if (error || !data) {
        return NextResponse.json({ error: "Couldn't send your request. Please try again or call (416) 834-9123." }, { status: 500 });
    }

    await db.from("audit_log").insert({ action: "signup", table_name: "pharmacies", row_id: data.id, details: { email } });

    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
    await sendEmail({
        to: QUICKMED_INBOX,
        replyTo: email,
        subject: `New partner request: ${pharmacy}`,
        text: [
            `${pharmacy} asked to become a QuickMed partner.`,
            "",
            `Contact: ${firstName} ${lastName}`,
            `Phone: ${phone}`,
            `Email: ${email}`,
            `Address: ${address}, ${city}`,
            "",
            `Approve or deny: ${origin}/admin/clients/${data.id}`,
        ].join("\n"),
    });

    return NextResponse.json({ ok: true });
}
