'use client';

import type { ReactNode } from "react";
import { cn } from "../ui/button";
import { useInView, useReducedMotion } from "../motion/use-in-view";

// Small animated SVG scenes drawn in the same style as the hero route map.
// They start animating when scrolled into view; without motion they show their final frame.

function Scene({ children, className, label }: { children: ReactNode; className?: string; label: string }) {
    const [ref, inView] = useInView<HTMLDivElement>();
    return (
        <div ref={ref} data-in={inView} role="img" aria-label={label} className={cn("scene h-full w-full", className)}>
            {children}
        </div>
    );
}

const STREETS = (
    <>
        <defs>
            <pattern id="scene-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0V40" fill="none" stroke="var(--hairline)" strokeWidth="1" />
            </pattern>
        </defs>
        <rect width="320" height="240" fill="url(#scene-grid)" />
    </>
);

function PharmacyMark({ x, y }: { x: number; y: number }) {
    return (
        <g transform={`translate(${x} ${y})`}>
            <rect x="-18" y="-18" width="36" height="36" rx="9" fill="var(--ink)" />
            <path d="M-2.5 -9h5v6.5h6.5v5h-6.5v6.5h-5v-6.5h-6.5v-5h6.5z" fill="white" />
        </g>
    );
}

// Speedy: a clock that now and then sets off its alarm.
export function CounterScene() {
    return (
        <Scene label="Alarm clock ringing for a pickup">
            <svg viewBox="0 0 320 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                {STREETS}
                <g transform="translate(160 128)">
                    <g className="s-ring-waves" fill="none" stroke="var(--brand)" strokeWidth="3" strokeLinecap="round">
                        <path d="M-78 -40 a 90 90 0 0 0 0 40" />
                        <path d="M-92 -50 a 110 110 0 0 0 0 60" />
                        <path d="M78 -40 a 90 90 0 0 1 0 40" />
                        <path d="M92 -50 a 110 110 0 0 1 0 60" />
                    </g>
                    <g className="s-ring">
                        <path d="M-50 -48 a 18 18 0 0 1 26 -18" fill="var(--ink)" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" />
                        <path d="M50 -48 a 18 18 0 0 0 -26 -18" fill="var(--ink)" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" />
                        <path d="M-34 44 l-10 14 M34 44 l10 14" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" />
                        <circle r="54" fill="white" stroke="var(--ink)" strokeWidth="6" />
                        {[0, 90, 180, 270].map((a) => (
                            <path key={a} d="M0 -44 v8" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" transform={`rotate(${a})`} />
                        ))}
                        <path d="M0 0 L-18 -14" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
                        <path d="M0 0 L22 -26" stroke="var(--brand)" strokeWidth="4" strokeLinecap="round" />
                        <circle r="5" fill="var(--ink)" />
                    </g>
                </g>
            </svg>
        </Scene>
    );
}

// Secure: a magnifying glass over a request, with an eye that now and then looks through it.
export function PrivacyScene() {
    return (
        <Scene label="Magnifying glass watching over a delivery request">
            <svg viewBox="0 0 320 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                {STREETS}
                <rect x="70" y="50" width="130" height="150" rx="12" fill="white" stroke="var(--hairline)" strokeWidth="1.5" />
                <rect x="70" y="50" width="130" height="24" rx="12" fill="var(--ink)" />
                <rect x="70" y="62" width="130" height="12" fill="var(--ink)" />
                {[96, 124, 152, 180].map((y) => (
                    <rect key={y} x="86" y={y} width={y % 56 === 12 ? 70 : 98} height="8" rx="4" fill="var(--surface)" />
                ))}
                <g transform="translate(196 118)">
                    <path d="M38 38 L74 74" stroke="var(--ink)" strokeWidth="14" strokeLinecap="round" />
                    <circle r="50" fill="var(--brand-soft)" stroke="var(--ink)" strokeWidth="8" />
                    <g className="s-eye">
                        <path d="M-30 0 Q0 -26 30 0 Q0 26 -30 0 Z" fill="white" stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" />
                        <circle r="11" fill="var(--brand)" />
                        <circle r="5" fill="var(--ink)" />
                    </g>
                </g>
            </svg>
        </Scene>
    );
}

// 03 Drivers: a courier drives a route through the street grid.
const DRIVE = "M40 196 H120 V120 H200 V60 H280";

export function RouteScene() {
    const motion = !useReducedMotion();
    return (
        <Scene label="Courier following a route through local streets">
            <svg viewBox="0 0 320 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                {STREETS}
                <path d="M0 120 H320 M200 0 V240" stroke="var(--brand-soft)" strokeWidth="14" />
                <path d={DRIVE} fill="none" stroke="var(--gray-light)" strokeWidth="3" strokeDasharray="2 7" strokeLinecap="round" />
                <path id="scene-drive" d={DRIVE} pathLength={1} fill="none" stroke="var(--brand)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="s-draw" />
                <PharmacyMark x={40} y={196} />
                <g transform="translate(280 60)">
                    <circle r="9" fill="var(--brand)" className="pin-pulse" />
                    <circle r="9" fill="var(--brand)" stroke="white" strokeWidth="3" />
                </g>
                <g>
                    <circle r="8" fill="var(--ink)" stroke="white" strokeWidth="3" />
                    {/* Separate elements so SMIL starts fresh when motion turns on after hydration. */}
                    {motion ? (
                        <animateMotion key="drive" dur="5s" repeatCount="indefinite">
                            <mpath href="#scene-drive" />
                        </animateMotion>
                    ) : (
                        <animateMotion key="still" dur="0.01s" fill="freeze" keyPoints="1;1" keyTimes="0;1" calcMode="linear">
                            <mpath href="#scene-drive" />
                        </animateMotion>
                    )}
                </g>
            </svg>
        </Scene>
    );
}

// 04 Handling: a sealed package gets its tamper seal and a check.
export function PackageScene() {
    return (
        <Scene label="Sealed package with a tamper-evident seal">
            <svg viewBox="0 0 320 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                {STREETS}
                <path d="M110 92 L160 68 L210 92 L160 116 Z" fill="var(--brand-soft)" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
                <path d="M110 92 V156 L160 180 V116 Z" fill="white" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
                <path d="M210 92 V156 L160 180 V116 Z" fill="var(--surface)" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
                <path d="M135 80 L185 104 V128" fill="none" stroke="var(--brand)" strokeWidth="8" strokeLinejoin="round" />
                <g transform="translate(212 160)"><g className="s-seal">
                    <circle r="22" fill="var(--ink)" stroke="white" strokeWidth="4" />
                    <path d="M-9 0 l6 6 l12 -12" fill="none" stroke="var(--brand)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="s-check" />
                </g></g>
            </svg>
        </Scene>
    );
}

// Customer first: two hands meeting in a handshake (Lucide's handshake, drawn large).
export function SupportScene() {
    return (
        <Scene label="Two hands shaking">
            <svg viewBox="0 0 320 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                {STREETS}
                <circle cx="160" cy="120" r="78" fill="var(--brand-soft)" />
                <g transform="translate(88 50) scale(6)">
                    <g className="s-shake" fill="none" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m21 3 1 11h-2" stroke="var(--brand)" strokeWidth="1.6" />
                        <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" stroke="var(--ink)" />
                        <path d="M3 4h8" stroke="var(--ink)" />
                        <path d="m11 17 2 2a1 1 0 1 0 3-3" stroke="var(--ink)" />
                        <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" stroke="var(--ink)" />
                    </g>
                </g>
            </svg>
        </Scene>
    );
}

// Last stop: a wide route that ends at the patient's door, drawn for the dark panel.
// Closing panel: a straight route from the pharmacy to the patient's door, drawn under the buttons.
export function DoorstepLine() {
    return (
        <Scene label="Delivery route from the pharmacy to the patient's front door" className="flex items-center gap-3 md:gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-brand" aria-hidden="true">
                <svg viewBox="-12 -12 24 24" className="h-5 w-5"><path d="M-3 -10h6v7h7v6h-7v7h-6v-7h-7v-6h7z" fill="var(--ink)" /></svg>
            </span>
            <span className="relative h-2.5 flex-1" aria-hidden="true">
                <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-white/25" />
                <span className="s-line absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-brand" />
                <span className="s-drive absolute inset-0">
                    <span className="absolute left-0 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-brand bg-white" />
                </span>
            </span>
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center" aria-hidden="true">
                <span className="pin-pulse absolute inset-0 rounded-full bg-brand/20" />
                <svg viewBox="-24 -22 48 48" className="relative h-8 w-8">
                    <path d="M-22 4 L0 -18 L22 4" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M-16 0 V22 H16 V0" fill="none" stroke="white" strokeWidth="3" strokeLinejoin="round" />
                    <rect x="-5" y="8" width="10" height="14" rx="2" fill="var(--brand)" />
                </svg>
            </span>
        </Scene>
    );
}
