// Transactional email through Resend's HTTP API (no SDK needed).
// Without RESEND_API_KEY, sending is skipped and reported as not sent.

export const QUICKMED_INBOX = process.env.QUICKMED_INBOX ?? "info@quickmed.ca";

type Attachment = { filename: string; content: string /* base64 */ };

export async function sendEmail(message: {
    to: string;
    subject: string;
    text: string;
    replyTo?: string;
    attachments?: Attachment[];
}): Promise<boolean> {
    const key = process.env.RESEND_API_KEY;
    if (!key) return false;
    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
        body: JSON.stringify({
            from: process.env.EMAIL_FROM ?? "QuickMed <no-reply@quickmed.ca>",
            to: [message.to],
            subject: message.subject,
            text: message.text,
            reply_to: message.replyTo,
            attachments: message.attachments,
        }),
    }).catch(() => null);
    return Boolean(response?.ok);
}

// Light spam screen shared by the public forms: a hidden field people never fill
// in, and a minimum time between opening the form and sending it.
export function looksLikeSpam(honeypot: unknown, openedAt: unknown) {
    if (typeof honeypot === "string" && honeypot.trim() !== "") return true;
    const opened = Number(openedAt);
    return !Number.isFinite(opened) || Date.now() - opened < 3000;
}

export const clean = (value: unknown, max = 200) =>
    typeof value === "string" && value.trim() ? value.trim().slice(0, max) : null;

export const isEmail = (value: string | null): value is string =>
    Boolean(value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
