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
// A gentle up-and-down route from x0 to x1 along y, as smooth quadratic waves.
function waveRoute(x0: number, x1: number, y: number, waves: number, amp: number) {
    const half = (x1 - x0) / (waves * 2);
    return `M${x0} ${y} q ${half / 2} ${-amp * 2} ${half} 0` + ` t ${half} 0`.repeat(waves * 2 - 1);
}

function DoorstepRoute({ width, waves, id, className }: { width: number; waves: number; id: string; className?: string }) {
    const motion = !useReducedMotion();
    const route = waveRoute(64, width - 64, 50, waves, 16);
    return (
        <svg viewBox={`0 0 ${width} 100`} className={cn("h-auto w-full", className)} aria-hidden="true">
            <path d={route} fill="none" stroke="rgb(255 255 255 / 0.2)" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
            <path id={id} d={route} pathLength={1} fill="none" stroke="var(--brand)" strokeWidth="4" strokeLinecap="round" className="s-draw" />

            <g transform="translate(32 50)">
                <rect x="-22" y="-22" width="44" height="44" rx="11" fill="var(--brand)" />
                <path d="M-3.5 -11h7v7.5h7.5v7h-7.5v7.5h-7v-7.5h-7.5v-7h7.5z" fill="var(--ink)" />
            </g>

            <g transform={`translate(${width - 32} 50)`}>
                <circle r="26" fill="var(--brand)" opacity="0.18" className="pin-pulse" />
                <path d="M-18 3 L0 -15 L18 3" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M-13 0 V18 H13 V0" fill="none" stroke="white" strokeWidth="3" strokeLinejoin="round" />
                <rect x="-4" y="7" width="8" height="11" rx="2" fill="var(--brand)" />
            </g>

            <g>
                <circle r="9" fill="white" stroke="var(--brand)" strokeWidth="4" />
                {/* Separate elements so SMIL starts fresh when motion turns on after hydration. */}
                {motion ? (
                    <animateMotion key="drive" dur="6s" repeatCount="indefinite">
                        <mpath href={`#${id}`} />
                    </animateMotion>
                ) : (
                    <animateMotion key="still" dur="0.01s" fill="freeze" keyPoints="1;1" keyTimes="0;1" calcMode="linear">
                        <mpath href={`#${id}`} />
                    </animateMotion>
                )}
            </g>
        </svg>
    );
}

// Closing panel: a winding route from the pharmacy to the patient's door, drawn under the buttons.
// Phones get a shorter route with fewer bends so the icons stay a readable size.
export function DoorstepLine() {
    return (
        <Scene label="Delivery route from the pharmacy to the patient's front door">
            <DoorstepRoute width={420} waves={2} id="door-route-sm" className="md:hidden" />
            <DoorstepRoute width={1100} waves={4} id="door-route-lg" className="hidden md:block" />
        </Scene>
    );
}
