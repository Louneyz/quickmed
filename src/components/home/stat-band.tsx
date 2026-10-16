'use client';

import { useEffect, useState } from "react";
import { useInView, useReducedMotion } from "../motion/use-in-view";
import { WordReveal } from "../motion/reveal";

// Industry figures on why pharmacy delivery matters. These are not QuickMed's own numbers.
// Each line stays within what its source says; swap or edit entries here.
const stats = [
    {
        prefix: "1 in ",
        to: 20,
        decimals: 0,
        suffix: "",
        label: "prescriptions a pharmacy fills is never picked up.",
        source: "Li et al., Exploratory Research in Clinical and Social Pharmacy, 2024 (US, 91 community pharmacies)",
        href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11345311",
    },
    {
        prefix: "1 in ",
        to: 3,
        decimals: 0,
        suffix: "",
        label: "new prescriptions in a Canadian study were never filled at all.",
        source: "Tamblyn et al., Annals of Internal Medicine, 2014 (Quebec primary care)",
        href: "https://doi.org/10.7326/M13-1705",
    },
    {
        prefix: "",
        to: 85,
        decimals: 0,
        suffix: "%",
        label: "of new statin patients who got them delivered reached their cholesterol target, vs 74% who picked up in store.",
        source: "Schmittdiel et al., Journal of General Internal Medicine, 2011 (Kaiser Permanente, US)",
        href: "https://divisionofresearch.kaiserpermanente.org/study-finds-that-patients-using-statins-for-the-first-time-and-who-used-mail-order-pharmacies-are-more-likely-to-have-good-cholesterol-control/",
    },
    {
        prefix: "1 in ",
        to: 4,
        decimals: 0,
        suffix: "",
        label: "Canadian seniors is on 10 or more medications.",
        source: "Canadian Institute for Health Information, Changes in drug prescribing to seniors in Canada, 2022",
        href: "https://www.cihi.ca/en/changes-in-drug-prescribing-to-seniors-in-canada",
    },
];

// Counts up from zero the first time the band scrolls into view.
// Server render and reduced motion show the final figure.
function useCountUp(inView: boolean, duration = 1600) {
    const reduced = useReducedMotion();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (reduced || !inView) return;
        let frame = 0;
        const start = performance.now();
        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            setProgress(1 - Math.pow(1 - t, 4));
            if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [reduced, inView, duration]);

    return reduced ? 1 : progress;
}

export function StatBand() {
    const [ref, inView] = useInView<HTMLDListElement>();
    const progress = useCountUp(inView);

    return (
        <section id="why" className="bg-white pb-16 md:pb-24 scroll-mt-24">
            <div className="mx-auto max-w-6xl px-5 md:px-8">
                <div className="relative overflow-hidden rounded-[20px] bg-ink text-white px-6 py-10 md:px-12 md:py-14">
                    <div className="absolute inset-0 grid-pattern" aria-hidden="true" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgb(65_191_249/0.25),transparent_55%)]" aria-hidden="true" />
                    <div className="relative">
                        <WordReveal
                            className="title-lg max-w-3xl mb-10"
                            parts={[
                                { text: "A prescription can't help" },
                                { text: "if it never leaves the shelf.", className: "text-brand" },
                            ]}
                        />

                        <dl ref={ref} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 border-t border-white/15">
                            {stats.map((stat, index) => (
                                <div key={stat.source + index} className="pt-8 pb-2 xl:pr-6 sm:even:pl-6 xl:even:pl-0 xl:[&:not(:first-child)]:pl-6 xl:[&:not(:last-child)]:border-r border-white/15">
                                    <dt className="title-lg text-accent mb-4 tabular-nums">
                                        {stat.prefix}
                                        {(stat.to * progress).toFixed(stat.decimals)}
                                        {stat.suffix}
                                    </dt>
                                    <dd className="text-white leading-snug mb-4 text-balance">
                                        {stat.label}
                                    </dd>
                                </div>
                            ))}
                        </dl>

                        {/* One small link; the full source list opens on demand. */}
                        <details className="group mt-10">
                            <summary className="label-mono inline-flex cursor-pointer list-none items-center gap-2 text-white hover:text-white [&::-webkit-details-marker]:hidden">
                                Sources
                                <span className="transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                            </summary>
                            <ol className="mt-4 space-y-1 text-xs text-white">
                                {stats.map((stat) => (
                                    <li key={stat.source}>
                                        <a href={stat.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">
                                            {stat.source}
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </details>
                    </div>
                </div>
            </div>
        </section>
    );
}
