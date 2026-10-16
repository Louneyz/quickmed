"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { X } from "lucide-react";

// The forms only download when someone opens a pop-up, keeping every page light.
const loading = () => <p className="label-mono text-gray-mid" role="status">Loading…</p>;
const PartnerForm = dynamic(() => import("./partner-form").then((m) => m.PartnerForm), { ssr: false, loading });
const DriverForm = dynamic(() => import("./driver-form").then((m) => m.DriverForm), { ssr: false, loading });

type Kind = "partner" | "driver";

// "Become a partner" and "Become a driver" open as pop-ups instead of pages.
// Any link to /partners or /drivers on the site opens the matching pop-up, so
// existing buttons keep working unchanged; #become-a-partner / #become-a-driver
// in the URL opens it too (the old pages redirect there).
const routes: Record<string, Kind> = { "/partners": "partner", "/drivers": "driver" };
const hashes: Record<string, Kind> = { "#become-a-partner": "partner", "#become-a-driver": "driver" };

export function JoinDialogs() {
    const [kind, setKind] = useState<Kind | null>(null);
    const [session, setSession] = useState(0);
    const dialog = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const open = (k: Kind) => {
            setKind(k);
            setSession((n) => n + 1);
        };

        function onClick(e: MouseEvent) {
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            const link = (e.target as Element | null)?.closest?.("a[href]");
            if (!link) return;
            const url = new URL((link as HTMLAnchorElement).href, window.location.href);
            if (url.origin !== window.location.origin) return;
            const k = routes[url.pathname] ?? hashes[url.hash];
            if (!k) return;
            e.preventDefault();
            open(k);
        }

        function fromHash() {
            const k = hashes[window.location.hash];
            if (!k) return;
            history.replaceState(null, "", window.location.pathname + window.location.search);
            open(k);
        }

        document.addEventListener("click", onClick, true);
        window.addEventListener("hashchange", fromHash);
        fromHash();
        return () => {
            document.removeEventListener("click", onClick, true);
            window.removeEventListener("hashchange", fromHash);
        };
    }, []);

    useEffect(() => {
        const d = dialog.current;
        if (kind && d && !d.open) {
            d.showModal();
            d.querySelector<HTMLElement>("[data-autofocus]")?.focus();
        }
    }, [kind, session]);

    const close = () => dialog.current?.close();

    return (
        <dialog
            ref={dialog}
            onClose={() => setKind(null)}
            onClick={(e) => e.target === dialog.current && close()}
            aria-labelledby="join-dialog-title"
            className="join-dialog m-0 sm:m-auto h-dvh max-h-dvh w-full max-w-full sm:h-fit sm:max-h-[92dvh] sm:max-w-xl sm:rounded-lg bg-white p-0 text-ink shadow-[0_24px_80px_rgb(15_23_42/0.35)] backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
        >
            {kind && (
                <div className="flex flex-col h-full sm:max-h-[92dvh]">
                    <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-white/95 backdrop-blur border-b border-hairline px-5 sm:px-8 py-4">
                        <img src="/images/brand/quickmed-logo-navy.svg" alt="QuickMed" className="h-6 w-auto" />
                        <button
                            type="button"
                            onClick={close}
                            aria-label="Close"
                            className="h-11 w-11 -mr-2 flex items-center justify-center rounded-lg text-ink hover:bg-ink/5"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    {/* Focus lands here on open (not on the close button, and without popping a phone keyboard). */}
                    <div data-autofocus tabIndex={-1} className="flex-1 overflow-y-auto px-5 sm:px-8 py-8 outline-none">
                        {kind === "partner" ? (
                            <PartnerForm key={session} onDone={close} />
                        ) : (
                            <DriverForm key={session} onDone={close} />
                        )}
                    </div>
                </div>
            )}
        </dialog>
    );
}
