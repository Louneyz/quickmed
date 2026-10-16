"use client";

import { useEffect, useRef } from "react";

// Hidden field for the spam screen: people never see or fill it, bots usually do.
export function Honeypot() {
    return (
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
                Website
                <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
            </label>
        </div>
    );
}

// When the form was opened, sent with it so instant bot submissions can be ignored.
export function useOpenedAt() {
    const openedAt = useRef(0);
    useEffect(() => {
        openedAt.current = Date.now();
    }, []);
    return openedAt;
}

export function Intro({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
    return (
        <div className="mb-8">
            <p className="label-mono text-ink">{eyebrow}</p>
            <h2 id="join-dialog-title" className="title-md text-ink mt-3">{title}</h2>
            <p className="mt-4 text-ink">{children}</p>
        </div>
    );
}

export function Done({ title, children, onDone }: { title: string; children: React.ReactNode; onDone: () => void }) {
    return (
        <div className="py-6" role="status">
            <p className="label-mono text-ink">Sent</p>
            <h2 id="join-dialog-title" className="title-md text-ink mt-3">{title}</h2>
            <p className="mt-4 text-ink">{children}</p>
            <button
                type="button"
                onClick={onDone}
                className="cta label-mono mt-8 inline-flex items-center justify-center rounded-lg bg-ink px-6 py-4 text-white hover:text-ink transition-colors [--cta-hover:var(--brand)]"
            >
                Close
            </button>
        </div>
    );
}
