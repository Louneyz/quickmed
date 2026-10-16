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

// A small pharmacy storefront: sign with a cross, striped awning, windows and a door.
function PharmacyFront({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
            <rect x="30" y="2" width="36" height="20" rx="5" fill="white" />
            <path d="M45 6h6v5h5v6h-5v5h-6v-5h-5v-6h5z" transform="translate(0 -1.5) scale(1 0.9)" fill="var(--ink)" />
            <rect x="14" y="38" width="68" height="52" rx="4" fill="var(--brand)" />
            <path d="M10 26h76v10a6 6 0 0 1-12 0a6 6 0 0 1-13 0a6 6 0 0 1-13 0a6 6 0 0 1-13 0a6 6 0 0 1-13 0a6 6 0 0 1-12 0z" fill="white" />
            <path d="M22.7 26h12.7v10a6 6 0 0 1-12.7 0zM48.1 26h12.7v10a6 6 0 0 1-12.7 0zM73.5 26h12.5v10a6 6 0 0 1-12.5 0z" fill="var(--brand-deep)" />
            <rect x="20" y="50" width="16" height="16" rx="2" fill="white" opacity="0.9" />
            <rect x="60" y="50" width="16" height="16" rx="2" fill="white" opacity="0.9" />
            <rect x="40" y="56" width="16" height="34" rx="2" fill="var(--ink)" />
            <circle cx="52" cy="74" r="1.6" fill="var(--brand)" />
            <rect x="6" y="88" width="84" height="4" rx="2" fill="white" opacity="0.35" />
        </svg>
    );
}

// The patient's home, drawn large, with a soft glow and a sealed bag waiting at the step.
function HomeFront({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 160 150" className={className} overflow="visible" aria-hidden="true">
            <circle cx="80" cy="82" r="58" fill="var(--brand)" opacity="0.1" className="pin-pulse" />
            <path d="M22 72 L80 20 L138 72" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M36 62 V128 H124 V62" fill="none" stroke="white" strokeWidth="7" strokeLinejoin="round" />
            <rect x="68" y="88" width="24" height="40" rx="3" fill="var(--brand)" />
            <circle cx="86" cy="109" r="2" fill="var(--ink)" />
            <rect x="46" y="78" width="14" height="14" rx="2" fill="white" opacity="0.85" />
            <rect x="100" y="78" width="14" height="14" rx="2" fill="white" opacity="0.85" />
            <path d="M98 122 h14 l-1.5 -11 h-11z" fill="white" />
            <path d="M101 111 a4 4 0 0 1 8 0" fill="none" stroke="white" strokeWidth="1.6" />
            <rect x="26" y="128" width="108" height="5" rx="2.5" fill="white" opacity="0.35" />
        </svg>
    );
}

// Draws the route between two elements in page pixels, so it follows the layout at every screen size,
// and moves the courier dot along it as the hero scrolls away.
function ConnectedRoute({
    sectionRef,
    fromRef,
    toRef,
}: {
    sectionRef: React.RefObject<HTMLElement | null>;
    fromRef: React.RefObject<HTMLElement | null>;
    toRef: React.RefObject<HTMLElement | null>;
}) {
    const svgRef = useRef<SVGSVGElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const trackRef = useRef<SVGPathElement>(null);
    const dotRef = useRef<SVGGElement>(null);
    const reduced = useReducedMotion();

    useEffect(() => {
        const section = sectionRef.current;
        const from = fromRef.current;
        const to = toRef.current;
        const svg = svgRef.current;
        const path = pathRef.current;
        const track = trackRef.current;
        const dot = dotRef.current;
        if (!section || !from || !to || !svg || !path || !track || !dot) return;

        let length = 0;
        const layout = () => {
            const box = section.getBoundingClientRect();
            const a = from.getBoundingClientRect();
            const b = to.getBoundingClientRect();
            svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
            const x0 = a.right - box.left + 6;
            const y0 = a.top + a.height * 0.62 - box.top;
            // End at the home's front step and leave and arrive level, so the route reads as one long S
            // whether the home sits up and to the right (laptops) or below (phones).
            const x1 = b.left + b.width * 0.24 - box.left;
            const y1 = b.top + b.height * 0.84 - box.top;
            const dx = x1 - x0;
            const d = `M${x0} ${y0} C ${x0 + dx * 0.6} ${y0}, ${x1 - dx * 0.6} ${y1}, ${x1} ${y1}`;
            path.setAttribute("d", d);
            track.setAttribute("d", d);
            length = path.getTotalLength();
        };
        const place = () => {
            let progress = 1;
            if (!reduced) {
                const rect = section.getBoundingClientRect();
                progress = Math.min(1, Math.max(0, 0.06 + (-rect.top / (rect.height * 0.6)) * 0.94));
            }
            const point = path.getPointAtLength(length * progress);
            dot.setAttribute("transform", `translate(${point.x} ${point.y})`);
        };

        let frame = 0;
        const onScroll = () => {
            if (!frame)
                frame = requestAnimationFrame(() => {
                    frame = 0;
                    place();
                });
        };
        const onResize = () => {
            layout();
            place();
        };
        onResize();
        const observer = new ResizeObserver(onResize);
        observer.observe(section);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", onScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [reduced, sectionRef, fromRef, toRef]);

    return (
        <svg ref={svgRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
            <path ref={trackRef} fill="none" stroke="rgb(255 255 255 / 0.2)" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
            <path ref={pathRef} pathLength={1} fill="none" stroke="var(--brand)" strokeWidth="5" strokeLinecap="round" className="route-draw" />
            <g ref={dotRef}>
                <circle r="11" fill="white" stroke="var(--brand)" strokeWidth="5" />
            </g>
        </svg>
    );
}

// 1. Navy hero. A little pharmacy under the buttons, the patient's home large in the right column,
// and the route between them that the courier drives as you scroll.
export function HeroNavy() {
    const ref = useRef<HTMLElement>(null);
    const pharmacyRef = useRef<HTMLDivElement>(null);
    const homeRef = useRef<HTMLDivElement>(null);
    return (
        <section ref={ref} id="option-1" className="relative overflow-hidden bg-ink text-white">
            <div className="absolute inset-0 grid-pattern" aria-hidden="true" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgb(65_191_249/0.25),transparent_55%)]" aria-hidden="true" />
            <ConnectedRoute sectionRef={ref} fromRef={pharmacyRef} toRef={homeRef} />
            <div className="relative mx-auto max-w-6xl px-5 md:px-8 pt-32 md:pt-44 pb-14 md:pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
                    <div className="lg:col-span-8">
                        <WordReveal
                            as="h1"
                            className="title-lg mb-8"
                            parts={[{ text: "Your patients." }, { text: "Your care." }, { text: "Delivered.", className: "text-brand" }]}
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
                        <div className="mt-12 md:mt-16 inline-flex flex-col items-center gap-2">
                            <div ref={pharmacyRef}>
                                <PharmacyFront className="h-20 w-20 md:h-28 md:w-28" />
                            </div>
                            <span className="label-mono text-white">Your counter</span>
                        </div>
                    </div>
                    <div className="lg:col-span-4 flex justify-end lg:justify-center lg:items-start lg:pt-36">
                        <div className="flex flex-col items-center gap-3">
                            <div ref={homeRef}>
                                <HomeFront className="h-36 w-40 md:h-48 md:w-52 lg:h-60 lg:w-64" />
                            </div>
                            <span className="label-mono text-white" style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.2rem)" }}>
                                Their door
                            </span>
                        </div>
                    </div>
                </div>
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
