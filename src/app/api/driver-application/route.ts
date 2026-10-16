import { NextResponse } from "next/server";
import { adminClient } from "@/lib/server/supabase-admin";
import { QUICKMED_INBOX, clean, isEmail, looksLikeSpam, sendEmail } from "@/lib/server/email";

// "Become a driver" pop-up. Stores the application and resume (private bucket in
// Canada), sends the applicant a thank-you, and sends every answer plus the
// resume to the QuickMed inbox.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Vercel caps request bodies at 4.5 MB.
const MAX_RESUME_BYTES = 4 * 1024 * 1024;
const RESUME_TYPES: Record<string, string> = {
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

export async function POST(request: Request) {
    const form = await request.formData().catch(() => null);
    if (!form) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

    if (looksLikeSpam(form.get("website"), form.get("openedAt"))) return NextResponse.json({ ok: true, emailed: true });

    const fullName = clean(form.get("fullName"), 120);
    const phone = clean(form.get("phone"), 40);
    const email = clean(form.get("email"))?.toLowerCase() ?? null;
    const resume = form.get("resume");

    if (!fullName || !phone || !isEmail(email)) {
        return NextResponse.json({ error: "Please fill in every field with a valid email." }, { status: 400 });
    }
    if (!(resume instanceof File) || resume.size === 0) {
        return NextResponse.json({ error: "Please attach your resume." }, { status: 400 });
    }
    const extension = RESUME_TYPES[resume.type] ?? resume.name.split(".").pop()?.toLowerCase();
    if (!extension || !["pdf", "doc", "docx"].includes(extension)) {
        return NextResponse.json({ error: "Your resume must be a PDF or Word document." }, { status: 400 });
    }
    if (resume.size > MAX_RESUME_BYTES) {
        return NextResponse.json({ error: "Your resume must be smaller than 4 MB." }, { status: 400 });
    }

    const bytes = Buffer.from(await resume.arrayBuffer());
    const safeName = fullName.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "applicant";
    const filename = `${safeName}-resume.${extension}`;

    const db = adminClient();
    let resumePath: string | null = null;
    if (db) {
        const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${filename}`;
        const { error } = await db.storage.from("driver-resumes").upload(path, bytes, {
            contentType: resume.type || "application/octet-stream",
        });
        if (!error) resumePath = path;
        await db.from("driver_applications").insert({ full_name: fullName, phone, email, resume_path: resumePath });
    }

    const toInbox = await sendEmail({
        to: QUICKMED_INBOX,
        replyTo: email,
        subject: `New driver application: ${fullName}`,
        text: [
            "A new driver applied through quickmed.ca.",
            "",
            `Full name: ${fullName}`,
            `Phone: ${phone}`,
            `Email: ${email}`,
            `Resume: attached (${filename})`,
        ].join("\n"),
        attachments: [{ filename, content: bytes.toString("base64") }],
    });

    // Without the inbox copy or a database record, the application would be lost.
    if (!toInbox && !db) {
        return NextResponse.json({ error: "Applications aren't available right now. Please call (416) 834-9123." }, { status: 503 });
    }

    const emailed = await sendEmail({
        to: email,
        replyTo: QUICKMED_INBOX,
        subject: "Thanks for applying to drive with QuickMed",
        text: [
            `Hi ${fullName.split(" ")[0]},`,
            "",
            "Thank you for applying to drive with QuickMed. We've received your application and resume, and our team will be in touch if your experience is a fit.",
            "",
            "If you have any questions, call us at (416) 834-9123 or reply to this email.",
            "",
            "The QuickMed team",
        ].join("\n"),
    });

    return NextResponse.json({ ok: true, emailed });
}
