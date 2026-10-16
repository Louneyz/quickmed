"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { isConfigured, supabase } from "./supabase";
import type { Pharmacy, Profile, Role } from "./types";

// Sign out after this long without activity: pharmacy counters are shared computers.
const IDLE_LIMIT_MS = 30 * 60 * 1000;

type PortalSession = {
    session: Session;
    profile: Profile;
    pharmacy: Pharmacy | null;
};

const SessionContext = createContext<PortalSession | null>(null);

export function usePortalSession() {
    const value = useContext(SessionContext);
    if (!value) throw new Error("usePortalSession must be used inside <PortalGate>");
    return value;
}

export function homeFor(role: Role) {
    return role === "staff" ? "/admin" : "/portal";
}

export async function loadProfile(userId: string) {
    const { data } = await supabase()
        .from("profiles")
        .select("id, role, pharmacy_id, full_name")
        .eq("id", userId)
        .maybeSingle<Profile>();
    return data;
}

export async function signOut() {
    await supabase().auth.signOut();
    window.location.assign("/login");
}

// Wraps every /portal and /admin page: requires a signed-in user with the right
// role. The database enforces access on its own; this only routes people.
export function PortalGate({ role, children }: { role: Role; children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [state, setState] = useState<PortalSession | "loading" | "no-profile">("loading");

    useEffect(() => {
        if (!isConfigured) return;
        let cancelled = false;

        async function load(session: Session | null) {
            if (!session) {
                router.replace(`/login?next=${encodeURIComponent(pathname)}`);
                return;
            }
            const profile = await loadProfile(session.user.id);
            if (cancelled) return;
            if (!profile) {
                setState("no-profile");
                return;
            }
            if (profile.role !== role) {
                router.replace(homeFor(profile.role));
                return;
            }
            let pharmacy: Pharmacy | null = null;
            if (profile.pharmacy_id) {
                const { data } = await supabase()
                    .from("pharmacies")
                    .select("*")
                    .eq("id", profile.pharmacy_id)
                    .maybeSingle<Pharmacy>();
                pharmacy = data;
            }
            if (!cancelled) setState({ session, profile, pharmacy });
        }

        supabase().auth.getSession().then(({ data }) => load(data.session));
        const { data: sub } = supabase().auth.onAuthStateChange((event) => {
            if (event === "SIGNED_OUT") router.replace("/login");
        });

        return () => {
            cancelled = true;
            sub.subscription.unsubscribe();
        };
        // Only re-run when the required role changes, not on every navigation.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role]);

    useIdleSignOut(typeof state === "object");

    if (!isConfigured) return <NotConfigured />;
    if (state === "loading") return <Loading />;
    if (state === "no-profile") {
        return (
            <Centered>
                <p className="label-mono text-gray-mid">Account not set up</p>
                <p className="mt-3 text-ink">
                    Your login works but isn&apos;t linked to a pharmacy yet. Please call QuickMed at{" "}
                    <a className="underline" href="tel:+14168349123">(416) 834-9123</a>.
                </p>
                <button type="button" onClick={signOut} className="mt-6 label-mono text-ink underline">
                    Sign out
                </button>
            </Centered>
        );
    }

    return <SessionContext.Provider value={state}>{children}</SessionContext.Provider>;
}

function useIdleSignOut(active: boolean) {
    useEffect(() => {
        if (!active) return;
        let timer = window.setTimeout(signOut, IDLE_LIMIT_MS);
        const reset = () => {
            window.clearTimeout(timer);
            timer = window.setTimeout(signOut, IDLE_LIMIT_MS);
        };
        const events = ["pointerdown", "keydown", "scroll"] as const;
        events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
        return () => {
            window.clearTimeout(timer);
            events.forEach((e) => window.removeEventListener(e, reset));
        };
    }, [active]);
}

export function Centered({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-surface flex items-center justify-center px-4">
            <div className="max-w-md w-full rounded-lg bg-white p-8 shadow-[0_4px_24px_rgb(15_23_42/0.08)]">
                {children}
            </div>
        </div>
    );
}

function Loading() {
    return (
        <div className="min-h-screen bg-surface flex items-center justify-center" role="status">
            <span className="label-mono text-gray-mid">Loading…</span>
        </div>
    );
}

export function NotConfigured() {
    return (
        <Centered>
            <p className="label-mono text-gray-mid">Portal not connected</p>
            <p className="mt-3 text-ink">
                The database hasn&apos;t been connected yet. Set the Supabase environment variables described
                in PORTAL.md and redeploy.
            </p>
        </Centered>
    );
}
