"use client";

import { useState } from "react";
import { Button, Field, Input, Notice } from "@/components/portal/ui";
import { Done, Honeypot, Intro, useOpenedAt } from "./shared";

export function PartnerForm({ onDone }: { onDone: () => void }) {
    const openedAt = useOpenedAt();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState<{ firstName: string; email: string } | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setBusy(true);
        setError(null);
        const data = Object.fromEntries(new FormData(e.currentTarget));
        const response = await fetch("/api/partner-signup", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ ...data, openedAt: openedAt.current }),
        }).catch(() => null);
        const json = await response?.json().catch(() => ({}));
        setBusy(false);
        if (!response?.ok) {
            setError(json?.error ?? "Couldn't send your request. Please try again or call (416) 834-9123.");
            return;
        }
        setSent({ firstName: String(data.firstName), email: String(data.email) });
    }

    if (sent) {
        return (
            <Done title={`Thanks, ${sent.firstName}.`} onDone={onDone}>
                Our team will review your request and email your partner portal login to {sent.email} once you&apos;re
                approved. Questions? Call <a href="tel:+14168349123" className="text-ink underline">(416) 834-9123</a>.
            </Done>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="relative">
            <Intro eyebrow="Become a partner" title="Partner with QuickMed.">
                Tell us about your pharmacy. Once our team approves your request, we&apos;ll email you a login for the
                partner portal, where you can send deliveries and track every stop.
            </Intro>
            <Honeypot />
            <div className="grid gap-5 sm:grid-cols-2">
                <Field label="First name" required>
                    <Input name="firstName" required autoComplete="given-name" />
                </Field>
                <Field label="Last name" required>
                    <Input name="lastName" required autoComplete="family-name" />
                </Field>
                <Field label="Pharmacy name" required className="sm:col-span-2">
                    <Input name="pharmacy" required autoComplete="organization" />
                </Field>
                <Field label="Address" required className="sm:col-span-2">
                    <Input name="address" required autoComplete="street-address" />
                </Field>
                <Field label="City" required>
                    <Input name="city" required autoComplete="address-level2" />
                </Field>
                <Field label="Phone" required>
                    <Input name="phone" type="tel" required autoComplete="tel" />
                </Field>
                <Field label="Email" required className="sm:col-span-2">
                    <Input name="email" type="email" required autoComplete="email" />
                </Field>
            </div>
            {error && <div className="mt-6"><Notice tone="error">{error}</Notice></div>}
            <Button type="submit" variant="accent" disabled={busy} className="mt-8 w-full">
                {busy ? "Sending…" : "Send request"}
            </Button>
            <p className="mt-4 text-xs text-ink">
                We only use these details to review your request and set up your account. See our{" "}
                <a href="/privacy" className="underline">privacy policy</a>.
            </p>
        </form>
    );
}
