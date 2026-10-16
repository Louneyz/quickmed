'use client';

import { useEffect, useState } from "react";
import { CtaLink } from "./ui/cta-link";
import { WordReveal } from "./motion/reveal";
import { useReducedMotion } from "./motion/use-in-view";

// A stylised street grid with the delivery route drawn from the pharmacy to the patient's door.
const ROUTE = "M70 380 C 70 300, 150 300, 150 240 S 230 150, 300 170 S 380 230, 410 110";

const statuses = ["Order received", "Picked up", "On the road", "Delivered"];

function RouteMap() {
    const motion = !useReducedMotion();
    const [tick, setTick] = useState(0);

    useEffect(() => {
        if (!motion) return;
        // Step the tracker label in time with the courier's 6s loop.
        const timer = setInterval(() => setTick((t) => t + 1), 1500);
        return () => clearInterval(timer);
    }, [motion]);

    const status = motion ? tick % statuses.length : statuses.length - 1;

    return (
        <div className="relative w-full max-w-md aspect-square rounded-[20px] bg-white shadow-[0_8px_32px_rgb(15_23_42/0.12)] overflow-hidden">
            <svg viewBox="0 0 480 480" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <defs>
                    <pattern id="streets" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M60 0H0V60" fill="none" stroke="var(--hairline)" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="480" height="480" fill="url(#streets)" />
                <path d="M0 300 H480 M240 0 V480" stroke="var(--brand-soft)" strokeWidth="18" />

                <path d={ROUTE} fill="none" stroke="var(--gray-light)" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
                <path id="hero-route" d={ROUTE} pathLength={1} fill="none" stroke="var(--brand)" strokeWidth="4" strokeLinecap="round" className="route-draw" />

                {/* Pharmacy */}
                <g transform="translate(70 380)">
                    <rect x="-16" y="-16" width="32" height="32" rx="8" fill="var(--ink)" />
                    <path d="M-2 -8h4v6h6v4h-6v6h-4v-6h-6v-4h6z" fill="white" />
                </g>

                {/* Patient's door */}
                <g transform="translate(410 110)">
                    <circle r="10" fill="var(--brand)" className="pin-pulse" />
                    <circle r="10" fill="var(--brand)" stroke="white" strokeWidth="3" />
                </g>

                {/* Courier */}
                <g>
                    <circle r="9" fill="var(--ink)" stroke="white" strokeWidth="3" />
                    {motion ? (
                        <animateMotion dur="6s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.45 0 0.55 1">
                            <mpath href="#hero-route" />
                        </animateMotion>
                    ) : (
                        <animateMotion dur="0.01s" fill="freeze" keyPoints="1;1" keyTimes="0;1" calcMode="linear">
                            <mpath href="#hero-route" />
                        </animateMotion>
                    )}
                </g>
            </svg>

            <span className="label-mono absolute left-5 bottom-5 text-ink">Pharmacy</span>
            <span className="label-mono absolute right-5 top-5 text-ink">Patient</span>

            <div className="absolute left-5 top-5 rounded-lg bg-ink text-white px-4 py-3 min-w-44">
                <p className="label-mono text-white mb-1">Status</p>
                <p className="text-lg tracking-tight" aria-live="off">
                    <span className="inline-block h-2 w-2 rounded-full bg-brand mr-2 align-middle" />
                    {statuses[status]}
                </p>
            </div>
        </div>
    );
}

export function Hero() {
    return (
        <section id="pickup" className="relative bg-brand text-ink overflow-hidden">
            <div
                className="absolute inset-0 [background-image:linear-gradient(to_right,rgb(255_255_255/0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.18)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-6xl px-5 md:px-8 pt-32 md:pt-44 pb-16 md:pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    <div className="lg:col-span-7">
                        <WordReveal
                            as="h1"
                            className="title-lg mb-8"
                            parts={[
                                { text: "You fill it." },
                                { text: "We deliver it.", className: "text-white" },
                            ]}
                        />
                        <p className="text-lg md:text-xl leading-snug text-ink max-w-xl mb-10">
                            QuickMed picks up prescriptions from your pharmacy and brings them to your patients&apos; homes. You offer delivery without hiring drivers or planning routes.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <CtaLink href="/partners" variant="ink">
                                Become a partner
                            </CtaLink>
                            <CtaLink href="/drivers" variant="light">
                                Drive with QuickMed
                            </CtaLink>
                        </div>
                    </div>

                    <div className="lg:col-span-5 flex justify-center lg:justify-end">
                        <RouteMap />
                    </div>
                </div>

            </div>

            <div className="relative flex justify-center text-white" aria-hidden="true">
                <div className="notch" />
            </div>
        </section>
    );
}
