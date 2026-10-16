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
            <path d="M36 62 L80 22 L124 62 V128 H36 Z" fill="var(--ink)" />
            <path d="M22 72 L80 20 L138 72" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M36 62 V128 H124 V62" fill="none" stroke="white" strokeWidth="7" strokeLinejoin="round" />
            <rect x="68" y="88" width="24" height="40" rx="3" fill="var(--brand)" />
            <circle cx="86" cy="109" r="2" fill="var(--ink)" />
            <rect x="46" y="78" width="14" height="14" rx="2" fill="white" opacity="0.85" />
            <rect x="100" y="78" width="14" height="14" rx="2" fill="white" opacity="0.85" />
            <rect x="26" y="128" width="108" height="5" rx="2.5" fill="white" opacity="0.35" />
        </svg>
    );
}

// The QuickMed bird from the logo, used as the courier. A white outline layer sits under the colour
// so it stands out on navy and blue.
const BIRD_PATHS = [
    { d: "M60.5 78C60 70 63 64 68.6 58.6C71 56 70.6 54 69.5 52L88 51.5L90.6 45.6L92.2 47C98 47.2 104 47.7 110.6 48.5C100 51 92.5 55.5 86 58.6C74 64 63.5 69 60.5 78Z", fill: "url(#qmLower)" },
    { d: "M50.4 28.6C56 31 61 35 66 38C72 41.2 79 41.8 84 44.5C87 46.2 89.5 48.5 91.2 50.8L69.5 52.2C62 49.5 55 44.5 51.6 37.5C50.2 34.5 49.9 31.2 50.4 28.6Z", fill: "url(#qmUpper)" },
    { d: "M106.8 22C99 22.4 91 27 87 32.5C84 36.6 82.6 40.6 83.5 43.1C84.4 45.1 86.5 46.1 88.6 45.8C91 44 92.5 41.5 93.8 38.5C96 33 99.5 27 106.8 22Z", fill: "url(#qmHeadL)" },
];

function BirdDefs() {
    return (
        <defs>
            <linearGradient id="qmUpper" gradientUnits="userSpaceOnUse" x1="50" y1="29" x2="91" y2="51">
                <stop offset="0" stopColor="#1499bd" />
                <stop offset=".55" stopColor="#18eef8" />
                <stop offset="1" stopColor="#12a6c4" />
            </linearGradient>
            <linearGradient id="qmLower" gradientUnits="userSpaceOnUse" x1="61" y1="74" x2="110" y2="48">
                <stop offset="0" stopColor="#1f447a" />
                <stop offset=".3" stopColor="#1a5a88" />
                <stop offset=".6" stopColor="#079ab6" />
                <stop offset="1" stopColor="#10dceb" />
            </linearGradient>
            <linearGradient id="qmHeadL" gradientUnits="userSpaceOnUse" x1="104" y1="22" x2="86" y2="46">
                <stop offset="0" stopColor="#9fe3f2" />
                <stop offset="1" stopColor="#4fb3d6" />
            </linearGradient>
        </defs>
    );
}

// Centred on the route point; the bird's own artwork spans roughly x 50-111, y 22-78.
function BirdCourier({ size = 58 }: { size?: number }) {
    const scale = size / 62;
    return (
        <g transform={`scale(${scale}) translate(-80 -50)`}>
            {BIRD_PATHS.map((p) => (
                <path key={`o${p.fill}`} d={p.d} fill="white" stroke="white" strokeWidth={6} strokeLinejoin="round" />
            ))}
            {BIRD_PATHS.map((p) => (
                <path key={p.fill} d={p.d} fill={p.fill} />
            ))}
        </g>
    );
}

// Draws the route between two elements in page pixels, so it follows the layout at every screen size,
// and loops the courier dot from the pharmacy to the door.
function ConnectedRoute({
    sectionRef,
    fromRef,
    toRef,
    shape = "s",
    underRef,
}: {
    shape?: "s" | "sag";
    /** With shape "sag": the route scoops below this element (e.g. the buttons) on its way across. */
    underRef?: React.RefObject<HTMLElement | null>;
    sectionRef: React.RefObject<HTMLElement | null>;
    fromRef: React.RefObject<HTMLElement | null> | React.RefObject<HTMLElement | null>[];
    toRef: React.RefObject<HTMLElement | null> | React.RefObject<HTMLElement | null>[];
}) {
    const svgRef = useRef<SVGSVGElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const trackRef = useRef<SVGPathElement>(null);
    const dotRef = useRef<SVGGElement>(null);
    const reduced = useReducedMotion();

    useEffect(() => {
        const section = sectionRef.current;
        const pick = (refs: typeof toRef) => (Array.isArray(refs) ? refs : [refs]).map((r) => r.current).filter((el): el is HTMLElement => !!el);
        const sources = pick(fromRef);
        const targets = pick(toRef);
        const svg = svgRef.current;
        const path = pathRef.current;
        const track = trackRef.current;
        const dot = dotRef.current;
        if (!section || !sources.length || !targets.length || !svg || !path || !track || !dot) return;

        let length = 0;
        let birdScale = 1;
        const layout = () => {
            const box = section.getBoundingClientRect();
            // A smaller bird on phones so it stays in proportion with the smaller icons.
            birdScale = box.width < 640 ? 0.62 : 1;
            // Phones and laptops can use different copies of the icons; follow whichever is showing.
            const from = sources.find((el) => el.offsetParent !== null) ?? sources[0];
            const to = targets.find((el) => el.offsetParent !== null) ?? targets[0];
            const a = from.getBoundingClientRect();
            const b = to.getBoundingClientRect();
            svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
            let d: string;
            if (shape === "sag") {
                // Pharmacy and home sit either side of the title: leave the pharmacy door, dip under the
                // headline, and come up to the home's front door.
                const x0 = a.left + a.width * 0.5 - box.left;
                // Start and end inside the doorways; the icons are drawn over the route, so the bird
                // comes out of the pharmacy and goes in at the patient's door.
                const y0 = a.top + a.height * 0.76 - box.top;
                const x1 = b.left + b.width * 0.5 - box.left;
                const y1 = b.top + b.height * 0.72 - box.top;
                const dx = x1 - x0;
                const under = underRef?.current;
                // Phones keep the trip up by the title; the loop under the buttons is for wider screens.
                if (under && box.width >= 768 && under.offsetParent !== null && under.getBoundingClientRect().bottom > Math.max(a.bottom, b.bottom)) {
                    // Drop straight down from the pharmacy, run under the body and buttons, and climb to the door.
                    const low = under.getBoundingClientRect().bottom - box.top + 56;
                    // On phones the icons sit over the text column, so the sides of the loop run out in the margins.
                    const xs = Math.min(x0, under.getBoundingClientRect().left - box.left - 8);
                    const xe = Math.max(x1, under.getBoundingClientRect().right - box.left + 8);
                    const r = Math.min(90, (low - Math.max(y0, y1)) / 2, (xe - xs) / 4);
                    const left = xs < x0 ? `C ${x0} ${y0 + 24}, ${xs} ${y0 + 8}, ${xs} ${y0 + 40} ` : "";
                    const right = xe > x1 ? ` V${y1 + 40} C ${xe} ${y1 + 8}, ${x1} ${y1 + 24}, ${x1} ${y1}` : ` V${y1}`;
                    d = `M${x0} ${y0} ${left}V${low - r} Q${xs} ${low} ${xs + r} ${low} H${xe - r} Q${xe} ${low} ${xe} ${low - r}${right}`;
                } else {
                    // Dip below the title row (on phones the icons sit beside the lines, so clear "Delivered.").
                    const row = from.parentElement?.getBoundingClientRect();
                    const floor = row ? row.bottom - box.top + 12 : 0;
                    const low = Math.max(Math.max(y0, y1) + Math.max(36, Math.min(80, dx * 0.09)), floor + 12);
                    // Straight down out of the door, level under the title, straight up into the home.
                    const r = Math.min(28, (low - Math.max(y0, y1)), dx / 4);
                    d = `M${x0} ${y0} V${low - r} Q${x0} ${low} ${x0 + r} ${low} H${x1 - r} Q${x1} ${low} ${x1} ${low - r} V${y1}`;
                }
            } else {
                // End at the home's front step and leave and arrive level, so the route reads as one long S
                // whether the home sits up and to the right (laptops) or below (phones).
                const x0 = a.right - box.left + 6;
                const y0 = a.top + a.height * 0.62 - box.top;
                const x1 = b.left + b.width * 0.24 - box.left;
                const y1 = b.top + b.height * 0.84 - box.top;
                const dx = x1 - x0;
                d = `M${x0} ${y0} C ${x0 + dx * 0.6} ${y0}, ${x1 - dx * 0.6} ${y1}, ${x1} ${y1}`;
            }
            path.setAttribute("d", d);
            track.setAttribute("d", d);
            length = path.getTotalLength();
        };
        const place = (progress: number, fade = true) => {
            const point = path.getPointAtLength(length * progress);
            // Shrink and fade over the last stretch so the bird goes in through the door, and come
            // out of the pharmacy the same way at the start of each loop.
            const edge = Math.min(length * progress, length * (1 - progress));
            const seen = fade ? Math.max(0, Math.min(1, edge / 50)) : 1;
            dot.setAttribute("transform", `translate(${point.x} ${point.y}) scale(${birdScale * (0.25 + 0.75 * seen)})`);
            dot.setAttribute("opacity", String(seen));
        };

        // The trip loops on its own: drive for about 6.4s, pause while the bird is inside, start again.
        const DRIVE = 6430;
        const WAIT = 1500;
        let frame = 0;
        let start = 0;
        const tick = (now: number) => {
            if (!start) start = now;
            const t = (now - start) % (DRIVE + WAIT);
            const x = Math.min(1, t / DRIVE);
            place(x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
            frame = requestAnimationFrame(tick);
        };
        const onResize = () => {
            layout();
            if (reduced) place(1, false);
        };
        onResize();
        const observer = new ResizeObserver(onResize);
        observer.observe(section);
        if (!reduced) frame = requestAnimationFrame(tick);
        return () => {
            observer.disconnect();
            if (frame) cancelAnimationFrame(frame);
        };
    }, [reduced, shape, underRef, sectionRef, fromRef, toRef]);

    return (
        <svg ref={svgRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
            <BirdDefs />
            <path ref={trackRef} fill="none" stroke="rgb(255 255 255 / 0.2)" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
            <path ref={pathRef} pathLength={1} fill="none" stroke="var(--brand)" strokeWidth="5" strokeLinecap="round" className="route-draw" />
            <g ref={dotRef}>
                <BirdCourier />
            </g>
        </svg>
    );
}

// 1. Navy hero. A little pharmacy under the buttons, the patient's home large in the right column,
// and the route between them that the courier drives on a loop.
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

// 1b. Same idea, centred: the home sits beside the title, the pharmacy under the buttons.
export function HeroNavyCentred() {
    const ref = useRef<HTMLElement>(null);
    const pharmacySideRef = useRef<HTMLDivElement>(null);
    const homeSideRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    return (
        <section ref={ref} id="option-1b" className="relative overflow-hidden bg-ink text-white">
            <div className="absolute inset-0 grid-pattern" aria-hidden="true" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(65_191_249/0.22),transparent_60%)]" aria-hidden="true" />
            <ConnectedRoute sectionRef={ref} fromRef={pharmacySideRef} toRef={homeSideRef} underRef={ctaRef} shape="sag" />
            <div className="relative mx-auto max-w-6xl px-4 sm:px-5 md:px-8 pt-32 md:pt-44 pb-14 md:pb-36 text-center">
                {/* Pharmacy on the left of the title, the patient's home on the right. On phones the pharmacy
                    sits level with "Your Care." and the home with "Delivered." */}
                <div className="flex items-end justify-center gap-1.5 sm:gap-4 md:gap-8 lg:gap-14">
                    <div ref={pharmacySideRef} className="shrink-0 self-center md:self-end">
                        <PharmacyFront className="h-12 w-12 sm:h-20 sm:w-20 md:h-28 md:w-28 lg:h-32 lg:w-32" />
                    </div>
                    <WordReveal
                        as="h1"
                        className="title-lg text-center whitespace-nowrap"
                        parts={[{ text: "Your Patients." }, { text: "Your Care." }, { text: "Delivered.", className: "text-brand font-semibold" }]}
                    />
                    <div ref={homeSideRef} className="shrink-0">
                        <HomeFront className="h-12 w-14 sm:h-20 sm:w-24 md:h-32 md:w-36 lg:h-36 lg:w-40" />
                    </div>
                </div>
                <p className="mt-10 md:mt-12 text-lg md:text-xl leading-snug text-white max-w-xl mx-auto mb-10">{BODY}</p>
                <div ref={ctaRef} className="flex flex-col sm:flex-row sm:w-fit sm:mx-auto gap-3 justify-center">
                    <CtaLink href="/partners" variant="accent" className="[--cta-hover:#ffffff] hover:text-ink">
                        Become a partner
                    </CtaLink>
                    <CtaLink href="/drivers" variant="outline-light">
                        Drive with QuickMed
                    </CtaLink>
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
