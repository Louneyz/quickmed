'use client';

import { useEffect, useRef } from "react";
import { CtaLink } from "./ui/cta-link";
import { WordReveal } from "./motion/reveal";
import { useReducedMotion } from "./motion/use-in-view";
import { cn } from "./ui/button";

// Three hero directions for Georgio to compare. Shown together on /hero-preview; not used on the homepage yet.

const BODY =
    "They get their medication at home, and you get back to patient care. Book a pickup online and a trained driver takes it from your counter to their door.";

// One long S from the pharmacy (left) to the patient's home (right).
function sRoute(width: number, height: number, inset = 70) {
    const x0 = inset;
    const x1 = width - inset;
    const mid = height / 2;
    const amp = height * 0.32;
    const span = x1 - x0;
    return `M${x0} ${mid} C ${x0 + span * 0.3} ${mid - amp * 2}, ${x0 + span * 0.45} ${mid - amp * 2}, ${x0 + span * 0.5} ${mid} S ${x0 + span * 0.7} ${mid + amp * 2}, ${x1} ${mid}`;
}

// Moves the courier dot along the route as the section scrolls past.
function useScrollRide(sectionRef: React.RefObject<HTMLElement | null>, pathRef: React.RefObject<SVGPathElement | null>, dotRef: React.RefObject<SVGGElement | null>) {
    const reduced = useReducedMotion();
    useEffect(() => {
        const section = sectionRef.current;
        const path = pathRef.current;
        const dot = dotRef.current;
        if (!section || !path || !dot) return;
        const length = path.getTotalLength();
        const place = (progress: number) => {
            const point = path.getPointAtLength(length * progress);
            dot.setAttribute("transform", `translate(${point.x} ${point.y})`);
        };
        if (reduced) {
            place(1);
            return;
        }
        let frame = 0;
        const update = () => {
            frame = 0;
            const rect = section.getBoundingClientRect();
            // Start a little way along so the dot reads as "on its way", arrive as the hero leaves the screen.
            const progress = Math.min(1, Math.max(0, 0.08 + (-rect.top / (rect.height * 0.7)) * 0.92));
            place(progress);
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [reduced, sectionRef, pathRef, dotRef]);
}

function Pharmacy({ x, y, tone = "brand" }: { x: number; y: number; tone?: "brand" | "ink" }) {
    return (
        <g transform={`translate(${x} ${y})`}>
            <rect x="-24" y="-24" width="48" height="48" rx="12" fill={tone === "brand" ? "var(--brand)" : "var(--ink)"} />
            <path d="M-4 -12h8v8h8v8h-8v8h-8v-8h-8v-8h8z" fill={tone === "brand" ? "var(--ink)" : "white"} />
        </g>
    );
}

function Home({ x, y, stroke = "white", door = "var(--brand)", glow = "var(--brand)" }: { x: number; y: number; stroke?: string; door?: string; glow?: string }) {
    return (
        <g transform={`translate(${x} ${y})`}>
            <circle r="34" fill={glow} opacity="0.18" className="pin-pulse" />
            <path d="M-22 4 L0 -18 L22 4" fill="none" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M-16 0 V22 H16 V0" fill="none" stroke={stroke} strokeWidth="3.5" strokeLinejoin="round" />
            <rect x="-5" y="8" width="10" height="14" rx="2" fill={door} />
        </g>
    );
}

// A full-width S route with the courier dot riding it on scroll.
function RideRoute({
    sectionRef,
    width,
    height,
    track,
    line,
    pharmacyTone,
    homeStroke,
    homeDoor,
    dotFill,
    dotStroke,
    labels,
    labelClass,
    className,
}: {
    sectionRef: React.RefObject<HTMLElement | null>;
    width: number;
    height: number;
    track: string;
    line: string;
    pharmacyTone: "brand" | "ink";
    homeStroke: string;
    homeDoor: string;
    dotFill: string;
    dotStroke: string;
    labels?: boolean;
    labelClass?: string;
    className?: string;
}) {
    const pathRef = useRef<SVGPathElement>(null);
    const dotRef = useRef<SVGGElement>(null);
    useScrollRide(sectionRef, pathRef, dotRef);
    const d = sRoute(width, height);
    return (
        <div className={cn("relative", className)}>
            <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" aria-hidden="true">
                <path d={d} fill="none" stroke={track} strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
                <path ref={pathRef} d={d} pathLength={1} fill="none" stroke={line} strokeWidth="5" strokeLinecap="round" className="route-draw" />
                <Pharmacy x={34} y={height / 2} tone={pharmacyTone} />
                <Home x={width - 34} y={height / 2} stroke={homeStroke} door={homeDoor} />
                <g ref={dotRef}>
                    <circle r="11" fill={dotFill} stroke={dotStroke} strokeWidth="5" />
                </g>
            </svg>
            {labels && (
                <div className={cn("label-mono mt-2 flex justify-between", labelClass)} aria-hidden="true">
                    <span>Your counter</span>
                    <span>Their door</span>
                </div>
            )}
        </div>
    );
}

// 1. Navy hero; the route runs the full width and the dot drives it as you scroll.
export function HeroNavy() {
    const ref = useRef<HTMLElement>(null);
    return (
        <section ref={ref} id="option-1" className="relative overflow-hidden bg-ink text-white">
            <div className="absolute inset-0 grid-pattern" aria-hidden="true" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgb(65_191_249/0.28),transparent_60%)]" aria-hidden="true" />
            <div className="relative mx-auto max-w-6xl px-5 md:px-8 pt-32 md:pt-44 pb-12 md:pb-16">
                <WordReveal
                    as="h1"
                    className="title-lg mb-8 max-w-4xl"
                    parts={[{ text: "Your patients, cared for" }, { text: "all the way home.", className: "text-brand" }]}
                />
                <p className="text-lg md:text-xl leading-snug text-white max-w-xl mb-10">{BODY}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <CtaLink href="/partners" variant="accent" className="[--cta-hover:#ffffff] hover:text-ink">
                        Become a partner
                    </CtaLink>
                    <CtaLink href="/drivers" variant="outline-light">
                        Drive with QuickMed
                    </CtaLink>
                </div>
                <RideRoute
                    sectionRef={ref}
                    width={1100}
                    height={170}
                    track="rgb(255 255 255 / 0.2)"
                    line="var(--brand)"
                    pharmacyTone="brand"
                    homeStroke="white"
                    homeDoor="var(--brand)"
                    dotFill="white"
                    dotStroke="var(--brand)"
                    labels
                    labelClass="text-white"
                    className="mt-14 md:mt-16 md:-mx-4"
                />
            </div>
        </section>
    );
}

// 2. Centred headline on blue, no map card; the long S route sits under the buttons.
export function HeroCentred() {
    const ref = useRef<HTMLElement>(null);
    return (
        <section ref={ref} id="option-2" className="relative overflow-hidden bg-brand text-ink">
            <div
                className="absolute inset-0 [background-image:linear-gradient(to_right,rgb(255_255_255/0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.18)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
                aria-hidden="true"
            />
            <div className="relative mx-auto max-w-6xl px-5 md:px-8 pt-32 md:pt-44 pb-12 md:pb-16 text-center">
                <WordReveal
                    as="h1"
                    className="title-lg mb-8 mx-auto max-w-5xl"
                    parts={[{ text: "Your patients, cared for" }, { text: "all the way home.", className: "text-white font-semibold" }]}
                />
                <p className="text-lg md:text-xl leading-snug text-ink max-w-2xl mx-auto mb-10">{BODY}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <CtaLink href="/partners" variant="ink">
                        Become a partner
                    </CtaLink>
                    <CtaLink href="/drivers" variant="light">
                        Drive with QuickMed
                    </CtaLink>
                </div>
                <RideRoute
                    sectionRef={ref}
                    width={1100}
                    height={170}
                    track="rgb(255 255 255 / 0.5)"
                    line="var(--ink)"
                    pharmacyTone="ink"
                    homeStroke="var(--ink)"
                    homeDoor="white"
                    dotFill="white"
                    dotStroke="var(--ink)"
                    className="mt-14 md:mt-16 md:-mx-4"
                />
            </div>
        </section>
    );
}

// 3. Split: your counter on the white half, their home on the blue half, one route across the line.
export function HeroSplit() {
    const ref = useRef<HTMLElement>(null);
    return (
        <section ref={ref} id="option-3" className="relative overflow-hidden bg-white text-ink">
            <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-brand lg:block" aria-hidden="true" />
            <div
                className="absolute inset-y-0 right-0 hidden w-[42%] lg:block [background-image:linear-gradient(to_right,rgb(255_255_255/0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.2)_1px,transparent_1px)] [background-size:64px_64px]"
                aria-hidden="true"
            />
            <div className="relative mx-auto max-w-6xl px-5 md:px-8 pt-32 md:pt-44 pb-12 md:pb-16">
                <div className="lg:max-w-[52%]">
                    <WordReveal
                        as="h1"
                        className="title-lg mb-8"
                        parts={[{ text: "Your patients, cared for" }, { text: "all the way home.", className: "text-brand-deep font-semibold" }]}
                    />
                    <p className="text-lg md:text-xl leading-snug text-ink max-w-xl mb-10">{BODY}</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <CtaLink href="/partners" variant="ink">
                            Become a partner
                        </CtaLink>
                        <CtaLink href="/drivers" variant="outline-ink">
                            Drive with QuickMed
                        </CtaLink>
                    </div>
                </div>
                <div className="relative mt-14 md:mt-16 -mx-5 md:-mx-8 rounded-none bg-brand px-5 py-6 md:px-8 lg:bg-transparent lg:p-0 lg:mx-0">
                    <RideRoute
                        sectionRef={ref}
                        width={1100}
                        height={170}
                        track="rgb(15 23 42 / 0.25)"
                        line="var(--ink)"
                        pharmacyTone="ink"
                        homeStroke="var(--ink)"
                        homeDoor="white"
                        dotFill="white"
                        dotStroke="var(--ink)"
                        labels
                        labelClass="text-ink"
                    />
                </div>
            </div>
        </section>
    );
}
