"use client";

import { useState } from "react";
import { FileText, Upload } from "lucide-react";
import { Button, Field, Input, Notice } from "@/components/portal/ui";
import { Done, Honeypot, Intro, useOpenedAt } from "./shared";

const MAX_MB = 4;

export function DriverForm({ onDone }: { onDone: () => void }) {
    const openedAt = useOpenedAt();
    const [file, setFile] = useState<File | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState<{ firstName: string; email: string; emailed: boolean } | null>(null);

    function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0] ?? null;
        setError(null);
        if (f && f.size > MAX_MB * 1024 * 1024) {
            setError(`Your resume must be smaller than ${MAX_MB} MB.`);
            e.target.value = "";
            setFile(null);
            return;
        }
        setFile(f);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!file) {
            setError("Please attach your resume.");
            return;
        }
        setBusy(true);
        setError(null);
        const data = new FormData(e.currentTarget);
        data.set("openedAt", String(openedAt.current));
        const response = await fetch("/api/driver-application", { method: "POST", body: data }).catch(() => null);
        const json = await response?.json().catch(() => ({}));
        setBusy(false);
        if (!response?.ok) {
            setError(json?.error ?? "Couldn't send your application. Please try again or call (416) 834-9123.");
            return;
        }
        setSent({
            firstName: String(data.get("fullName")).split(" ")[0],
            email: String(data.get("email")),
            emailed: Boolean(json?.emailed),
        });
    }

    if (sent) {
        return (
            <Done title={`Thanks, ${sent.firstName}.`} onDone={onDone}>
                We&apos;ve received your application and resume.
                {sent.emailed && <> A confirmation is on its way to {sent.email}.</>} Our team will be in touch if
                your experience is a fit.
            </Done>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="relative">
            <Intro eyebrow="Become a driver" title="Drive with QuickMed.">
                Deliver medication to patients across your community. Send us your details and resume and our team will
                be in touch.
            </Intro>
            <Honeypot />
            <div className="grid gap-5">
                <Field label="Full name" required>
                    <Input name="fullName" required autoComplete="name" />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Phone" required>
                        <Input name="phone" type="tel" required autoComplete="tel" />
                    </Field>
                    <Field label="Email" required>
                        <Input name="email" type="email" required autoComplete="email" />
                    </Field>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="label-mono text-gray">
                        Resume<span className="text-accent"> *</span>
                    </span>
                    <label className="flex cursor-pointer items-center gap-4 rounded-lg border-2 border-dashed border-ink/15 bg-surface/50 px-5 py-5 transition-colors hover:border-accent hover:bg-brand-soft focus-within:border-accent">
                        {file ? <FileText className="h-6 w-6 shrink-0 text-ink" aria-hidden /> : <Upload className="h-6 w-6 shrink-0 text-ink" aria-hidden />}
                        <span className="min-w-0">
                            <span className="block truncate text-ink">{file ? file.name : "Upload your resume"}</span>
                            <span className="block text-xs text-gray-mid">
                                {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB · tap to change` : `PDF or Word, up to ${MAX_MB} MB`}
                            </span>
                        </span>
                        <input
                            type="file"
                            name="resume"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={pickFile}
                            className="sr-only"
                        />
                    </label>
                </div>
            </div>
            {error && <div className="mt-6"><Notice tone="error">{error}</Notice></div>}
            <Button type="submit" variant="accent" disabled={busy} className="mt-8 w-full">
                {busy ? "Sending…" : "Submit application"}
            </Button>
            <p className="mt-4 text-xs text-gray-mid">
                We only use your details and resume to review your application. See our{" "}
                <a href="/privacy" className="underline">privacy policy</a>.
            </p>
        </form>
    );
}
