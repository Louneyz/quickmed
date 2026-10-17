"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AuthFrame } from "@/components/portal/auth-frame";
import { Button, Field, Input, Notice } from "@/components/portal/ui";
import { homeFor, loadProfile, toLoginEmail } from "@/lib/portal/session";
import { DEMO_ONLY } from "@/lib/portal/demo";
import { isConfigured, supabase } from "@/lib/portal/supabase";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<"login" | "reset" | "reset-sent">("login");

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setBusy(true);
        setError(null);
        // Demo mode: whatever is typed (or nothing) opens the sales demo.
        const credentials = DEMO_ONLY
            ? { email: "demo@accounts.quickmed.ca", password: "demo" }
            : { email: toLoginEmail(email), password };
        const { data, error } = await supabase().auth.signInWithPassword(credentials);
        if (error || !data.user) {
            setError("That login and password don't match. Try again or reset your password.");
            setBusy(false);
            return;
        }
        const profile = await loadProfile(data.user.id);
        const next = new URLSearchParams(window.location.search).get("next");
        const home = profile ? homeFor(profile.role) : "/portal";
        // Only follow `next` inside the user's own area, never to another site.
        window.location.assign(next && next.startsWith(home) ? next : home);
    }

    async function handleReset(e: React.FormEvent) {
        e.preventDefault();
        setBusy(true);
        setError(null);
        await supabase().auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/set-password`,
        });
        // Same message whether or not the account exists, so emails can't be probed.
        setMode("reset-sent");
        setBusy(false);
    }

    return (
        <AuthFrame>
            <p className="label-mono text-ink">{mode === "login" ? "Partner login" : "Reset password"}</p>
            <h1 className="title-md text-ink mt-3 mb-8">
                {mode === "login" ? "Welcome back." : "Forgot your password?"}
            </h1>

            {!isConfigured && (
                <div className="mb-6">
                    <Notice>The portal isn&apos;t connected to its database yet.</Notice>
                </div>
            )}

            {mode === "reset-sent" ? (
                <div className="space-y-6">
                    <Notice tone="success">
                        If {email} has a QuickMed account, a reset link is on its way. Check your inbox.
                    </Notice>
                    <Button variant="ghost" onClick={() => setMode("login")}>Back to login</Button>
                </div>
            ) : (
                <form onSubmit={mode === "login" ? handleLogin : handleReset} className="space-y-5">
                    <Field label={mode === "login" ? "Email or username" : "Email"}>
                        <Input
                            type={mode === "login" ? "text" : "email"}
                            autoCapitalize="none"
                            autoComplete="username"
                            required={!DEMO_ONLY || mode !== "login"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@pharmacy.ca"
                        />
                    </Field>

                    {mode === "login" && (
                        <Field label="Password">
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required={!DEMO_ONLY}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pr-12"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center px-4 text-ink hover:text-ink"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </Field>
                    )}

                    {error && <Notice tone="error">{error}</Notice>}

                    <Button type="submit" className="w-full" disabled={busy || !isConfigured}>
                        {busy ? "One moment…" : mode === "login" ? "Log in" : "Send reset link"}
                    </Button>

                    <div className="flex justify-between text-sm">
                        <button
                            type="button"
                            className="text-ink hover:text-ink underline underline-offset-4"
                            onClick={() => {
                                setMode(mode === "login" ? "reset" : "login");
                                setError(null);
                            }}
                        >
                            {mode === "login" ? "Forgot password?" : "Back to login"}
                        </button>
                    </div>
                </form>
            )}

            <p className="mt-10 text-sm text-ink">
                Not a partner yet?{" "}
                <a href="/partners" className="text-ink underline underline-offset-4">Become a partner</a>
            </p>
        </AuthFrame>
    );
}
