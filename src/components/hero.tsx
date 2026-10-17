'use client';

import { useEffect, useRef } from "react";
import { CtaLink } from "./ui/cta-link";
import { WordReveal } from "./motion/reveal";
import { useReducedMotion } from "./motion/use-in-view";

const BODY =
    "They get their medication at home, and you get back to patient care. Book a pickup online and a trained driver takes it from your counter to their door.";

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

// The patient's home, filled navy so the bird disappears once it is through the door.
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
        // Where the long bottom run under the buttons starts along the route, and how long it is.
        let bottomAt = 0;
        let bottomLen = 0;
        const layout = () => {
            const box = section.getBoundingClientRect();
            bottomAt = 0;
            bottomLen = 0;
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
                    const low = under.getBoundingClientRect().bottom - box.top + 72;
                    // On phones the icons sit over the text column, so the sides of the loop run out in the margins.
                    const xs = Math.min(x0, under.getBoundingClientRect().left - box.left - 8);
                    const xe = Math.max(x1, under.getBoundingClientRect().right - box.left + 8);
                    const r = Math.min(90, (low - Math.max(y0, y1)) / 2, (xe - xs) / 4);
                    const left = xs < x0 ? `C ${x0} ${y0 + 24}, ${xs} ${y0 + 8}, ${xs} ${y0 + 40} ` : "";
                    const right = xe > x1 ? ` V${y1 + 40} C ${xe} ${y1 + 8}, ${x1} ${y1 + 24}, ${x1} ${y1}` : ` V${y1}`;
                    d = `M${x0} ${y0} ${left}V${low - r} Q${xs} ${low} ${xs + r} ${low} H${xe - r} Q${xe} ${low} ${xe} ${low - r}${right}`;
                    // The drop plus the rounded corner (a quadratic quarter turn is about 1.15r long).
                    bottomAt = left ? 0 : low - r - y0 + 1.15 * r;
                    bottomLen = left ? 0 : xe - xs - 2 * r;
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

        // The trip loops on its own: drive (about 6.4s, longer when there's a bottom run), pause while
        // the bird is inside, start again. The bottom run under the buttons goes at 70% of the speed.
        const DRIVE = 6430;
        const WAIT = 1500;
        const SLOW = 0.7;
        let frame = 0;
        let start = 0;
        const tick = (now: number) => {
            if (!start) start = now;
            const extra = bottomLen * (1 / SLOW - 1);
            const drive = length ? DRIVE * ((length + extra) / length) : DRIVE;
            const t = (now - start) % (drive + WAIT);
            const x = Math.min(1, t / drive);
            const eased = x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
            // Walk a stretched copy of the route, then squeeze the bottom run back to its real length.
            const e = eased * (length + extra);
            const end = bottomAt + bottomLen / SLOW;
            const dist = e < bottomAt ? e : e < end ? bottomAt + (e - bottomAt) * SLOW : e - extra;
            place(length ? Math.min(1, dist / length) : eased);
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

// Navy hero: the pharmacy on one side of the headline, the patient's home on the other, and the
// QuickMed bird driving the route between them on a loop, down and under the buttons.
export function Hero() {
    const ref = useRef<HTMLElement>(null);
    const pharmacySideRef = useRef<HTMLDivElement>(null);
    const homeSideRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    return (
        <section ref={ref} id="pickup" className="relative overflow-hidden bg-ink text-white">
            <div className="absolute inset-0 grid-pattern" aria-hidden="true" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(65_191_249/0.22),transparent_60%)]" aria-hidden="true" />
            <ConnectedRoute sectionRef={ref} fromRef={pharmacySideRef} toRef={homeSideRef} underRef={ctaRef} shape="sag" />
            <div className="relative mx-auto max-w-6xl px-4 sm:px-5 md:px-8 pt-32 md:pt-44 pb-14 md:pb-40 text-center">
                {/* Pharmacy on the left of the title, the patient's home on the right. On phones both sit
                    level with "Your Care." so the two sides mirror. */}
                <div className="flex items-end justify-center gap-1.5 sm:gap-4 md:gap-20 lg:gap-28">
                    <div ref={pharmacySideRef} className="shrink-0 self-center md:self-end">
                        <PharmacyFront className="h-12 w-12 sm:h-20 sm:w-20 md:h-28 md:w-28 lg:h-32 lg:w-32" />
                    </div>
                    <WordReveal
                        as="h1"
                        className="title-lg text-center whitespace-nowrap"
                        parts={[{ text: "Your Patients." }, { text: "Your Care." }, { text: "Delivered.", className: "text-brand font-semibold" }]}
                    />
                    <div ref={homeSideRef} className="shrink-0 self-center md:self-end">
                        <HomeFront className="h-12 w-[3.25rem] sm:h-20 sm:w-24 md:h-32 md:w-36 lg:h-36 lg:w-40" />
                    </div>
                </div>
                <p className="mt-16 md:mt-12 text-lg md:text-xl leading-snug text-white max-w-xl md:max-w-md lg:max-w-xl mx-auto mb-10">{BODY}</p>
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
