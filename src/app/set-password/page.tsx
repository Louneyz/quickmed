"use client";

import { useEffect, useState } from "react";
import { AuthFrame } from "@/components/portal/auth-frame";
import { Button, Field, Input, Notice } from "@/components/portal/ui";
import { homeFor, loadProfile } from "@/lib/portal/session";
import { supabase } from "@/lib/portal/supabase";

const MIN_LENGTH = 12;

// Landing page for invite and password-reset emails. Supabase reads the token
// from the link, signs the user in, and they choose their own password here.
export default function SetPasswordPage() {
    const [ready, setReady] = useState<boolean | null>(null);
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Only a fresh invite or reset link may set a password, so a shared login
        // (like the sales demo) can't be changed just by visiting this page.
        const fromLink = /access_token|token_hash|code=|type=/.test(window.location.hash + window.location.search);
        if (!fromLink) {
            // Deferred so the effect doesn't set state synchronously.
            const t = window.setTimeout(() => setReady(false), 0);
            return () => window.clearTimeout(t);
        }
        const { data: sub } = supabase().auth.onAuthStateChange((_event, session) => {
            if (session) setReady(true);
        });
        // Give the client a moment to exchange the link's token before declaring it expired.
        const timer = window.setTimeout(async () => {
            const { data } = await supabase().auth.getSession();
            setReady(Boolean(data.session));
        }, 1500);
        return () => {
            sub.subscription.unsubscribe();
            window.clearTimeout(timer);
        };
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (password.length < MIN_LENGTH) {
            setError(`Use at least ${MIN_LENGTH} characters.`);
            return;
        }
        if (password !== confirm) {
            setError("The two passwords don't match.");
            return;
        }
        setBusy(true);
        const { data, error } = await supabase().auth.updateUser({ password });
        if (error || !data.user) {
            setError(error?.message ?? "Couldn't save your password. Try the link again.");
            setBusy(false);
            return;
        }
        const profile = await loadProfile(data.user.id);
        window.location.assign(profile ? homeFor(profile.role) : "/portal");
    }

    return (
        <AuthFrame>
            <p className="label-mono text-gray-mid">Account setup</p>
            <h1 className="title-md text-ink mt-3 mb-8">Choose your password.</h1>

            {ready === null && <Notice>Checking your link…</Notice>}

            {ready === false && (
                <div className="space-y-6">
                    <Notice tone="error">
                        This link has expired or was already used. Ask QuickMed to resend your invite, or use
                        &ldquo;Forgot password?&rdquo; on the login page.
                    </Notice>
                    <a href="/login" className="label-mono text-ink underline">Go to login</a>
                </div>
            )}

            {ready && (
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Field label="New password" hint={`At least ${MIN_LENGTH} characters.`}>
                        <Input
                            type="password"
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Field>
                    <Field label="Confirm password">
                        <Input
                            type="password"
                            autoComplete="new-password"
                            required
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                        />
                    </Field>
                    {error && <Notice tone="error">{error}</Notice>}
                    <Button type="submit" className="w-full" disabled={busy}>
                        {busy ? "Saving…" : "Save and continue"}
                    </Button>
                </form>
            )}
        </AuthFrame>
    );
}
