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

// 01 Collaboration: an order ticket slides across the counter from pharmacy to courier.
export function CounterScene() {
    return (
        <Scene label="Order passing from the pharmacy to a QuickMed courier">
            <svg viewBox="0 0 320 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                {STREETS}
                <line x1="30" y1="168" x2="290" y2="168" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
                <PharmacyMark x={62} y={128} />
                <g transform="translate(258 128)">
                    <circle r="18" fill="var(--brand)" />
                    <circle r="6" fill="var(--ink)" />
                </g>
                <g className="s-ticket">
                    <rect x="-26" y="-34" width="52" height="34" rx="6" fill="white" stroke="var(--ink)" strokeWidth="1.5" transform="translate(160 166)" />
                    <rect x="-26" y="-34" width="52" height="9" rx="4" fill="var(--brand)" transform="translate(160 166)" />
                    <path d="M144 146h32M144 154h22" stroke="var(--gray-light)" strokeWidth="3" strokeLinecap="round" />
                </g>
                <text x="62" y="196" textAnchor="middle" className="scene-label">Pharmacy</text>
                <text x="258" y="196" textAnchor="middle" className="scene-label">Courier</text>
            </svg>
        </Scene>
    );
}

// 02 Privacy: the request form fills in, then a lock closes over it.
export function PrivacyScene() {
    return (
        <Scene label="Delivery request form secured with a lock">
            <svg viewBox="0 0 320 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                {STREETS}
                <rect x="90" y="44" width="140" height="152" rx="12" fill="white" stroke="var(--hairline)" strokeWidth="1.5" />
                <rect x="90" y="44" width="140" height="26" rx="12" fill="var(--ink)" />
                <rect x="90" y="58" width="140" height="12" fill="var(--ink)" />
                <circle cx="106" cy="57" r="3" fill="var(--brand)" />
                {[92, 122, 152].map((y, i) => (
                    <g key={y}>
                        <rect x="106" y={y - 8} width="40" height="4" rx="2" fill="var(--gray-light)" />
                        <rect x="106" y={y} width="108" height="12" rx="4" fill="var(--surface)" />
                        <rect x="110" y={y + 4} width="80" height="4" rx="2" fill="var(--brand)" className="s-field" style={{ animationDelay: `${i * 350}ms` }} />
                    </g>
                ))}
                <g transform="translate(226 186)"><g className="s-lock">
                    <circle r="22" fill="var(--brand)" stroke="white" strokeWidth="4" />
                    <rect x="-8" y="-3" width="16" height="12" rx="2.5" fill="var(--ink)" />
                    <path d="M-5 -3v-4a5 5 0 0 1 10 0v4" fill="none" stroke="var(--ink)" strokeWidth="2.5" />
                </g></g>
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

// Last stop: a wide route that ends at the patient's door, drawn for the dark panel.
const DOOR_ROUTE = "M60 240 C 140 240, 160 140, 260 140 S 400 200, 470 150 S 540 90, 572 112";

export function DoorstepScene() {
    const motion = !useReducedMotion();
    return (
        <Scene label="Delivery route ending at the patient's front door" >
            <svg viewBox="0 30 640 256" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                <defs>
                    <pattern id="door-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M40 0H0V40" fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="640" height="320" fill="url(#door-grid)" />
                <path d={DOOR_ROUTE} fill="none" stroke="rgb(255 255 255 / 0.2)" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
                <path id="door-route" d={DOOR_ROUTE} pathLength={1} fill="none" stroke="var(--brand)" strokeWidth="4" strokeLinecap="round" className="s-draw" />

                <g transform="translate(60 240)">
                    <rect x="-20" y="-20" width="40" height="40" rx="10" fill="var(--brand)" />
                    <path d="M-3 -10h6v7h7v6h-7v7h-6v-7h-7v-6h7z" fill="var(--ink)" />
                </g>

                {/* The patient's home */}
                <g transform="translate(572 112)">
                    <circle r="34" fill="var(--brand)" opacity="0.15" className="pin-pulse" />
                    <path d="M-22 4 L0 -18 L22 4" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M-16 0 V22 H16 V0" fill="none" stroke="white" strokeWidth="3" strokeLinejoin="round" />
                    <rect x="-5" y="8" width="10" height="14" rx="2" fill="var(--brand)" />
                </g>

                <g>
                    <circle r="10" fill="white" stroke="var(--brand)" strokeWidth="4" />
                    {/* Separate elements so SMIL starts fresh when motion turns on after hydration. */}
                    {motion ? (
                        <animateMotion key="drive" dur="6s" repeatCount="indefinite">
                            <mpath href="#door-route" />
                        </animateMotion>
                    ) : (
                        <animateMotion key="still" dur="0.01s" fill="freeze" keyPoints="1;1" keyTimes="0;1" calcMode="linear">
                            <mpath href="#door-route" />
                        </animateMotion>
                    )}
                </g>

                <g transform="translate(472 210)"><g className="s-delivered">
                    <rect x="-62" y="-20" width="124" height="40" rx="10" fill="white" />
                    <circle cx="-40" cy="0" r="5" fill="var(--brand)" />
                    <text x="-28" y="5" className="scene-chip">Delivered</text>
                </g></g>
            </svg>
        </Scene>
    );
}
