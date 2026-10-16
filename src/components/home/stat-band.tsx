'use client';

import { useEffect, useState } from "react";
import { useInView, useReducedMotion } from "../motion/use-in-view";
import { WordReveal } from "../motion/reveal";

// Industry figures on why pharmacy delivery matters. These are not QuickMed's own numbers.
// Each line stays within what its source says; swap or edit entries here.
const stats = [
    {
        prefix: "1 in ",
        to: 7,
        decimals: 0,
        suffix: "",
        label: "prescriptions for chronic conditions is never filled.",
        source: "Lemstra et al., Patient Preference and Adherence, 2018",
        href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5944464",
    },
    {
        prefix: "",
        to: 5.4,
        decimals: 1,
        suffix: "%",
        label: "of hospitalizations in Canada are estimated to be due to patients not taking their medication.",
        source: "Iskedjian et al., Value in Health, 2002, cited in Lemstra et al., 2018",
        href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5944464",
    },
    {
        prefix: "",
        to: 59,
        decimals: 0,
        suffix: "%",
        label: "more likely to stay on their medication when patients use home delivery.",
        source: "Iyengar et al., J Manag Care Spec Pharm, 2016 (US data)",
        href: "https://amcp.org/node/35904",
    },
    {
        prefix: "",
        to: 4.6,
        decimals: 1,
        suffix: "M",
        label: "Ontarians aged 65+ by 2051, up from 3.1 million today.",
        source: "Ontario Ministry of Finance, Population Projections 2025–2051",
        href: "https://www.ontario.ca/page/ontario-population-projections",
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
        <section id="why" className="bg-white pb-20 md:pb-32 scroll-mt-24">
            <div className="mx-auto max-w-6xl px-5 md:px-8">
                <div className="relative overflow-hidden rounded-[20px] bg-ink text-white px-6 py-14 md:px-12 md:py-20">
                    <div className="absolute inset-0 grid-pattern" aria-hidden="true" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgb(65_191_249/0.25),transparent_55%)]" aria-hidden="true" />
                    <div className="relative">
                        <p className="label-mono text-white/60 mb-6">Stop 02 · Why delivery matters</p>
                        <WordReveal
                            className="title-lg max-w-3xl mb-14"
                            parts={[
                                { text: "The prescription only works" },
                                { text: "if it reaches the patient.", className: "text-white/40" },
                            ]}
                        />

                        <dl ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-white/15">
                            {stats.map((stat, index) => (
                                <div key={stat.source + index} className="pt-8 pb-2 lg:pr-6 sm:even:pl-6 lg:even:pl-0 lg:[&:not(:first-child)]:pl-6 lg:[&:not(:last-child)]:border-r border-white/15">
                                    <dt className="title-lg text-accent mb-4 tabular-nums">
                                        {stat.prefix}
                                        {(stat.to * progress).toFixed(stat.decimals)}
                                        {stat.suffix}
                                    </dt>
                                    <dd className="text-white/80 leading-snug mb-4">
                                        {stat.label}
                                        <sup className="label-mono text-white/40 ml-1">{index + 1}</sup>
                                    </dd>
                                </div>
                            ))}
                        </dl>

                        <ol className="mt-10 pt-6 border-t border-white/10 space-y-1 text-xs text-white/40">
                            {stats.map((stat, index) => (
                                <li key={stat.source + index}>
                                    {index + 1}.{" "}
                                    <a href={stat.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">
                                        {stat.source}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </section>
    );
}
