import { Clock, Handshake, HeartHandshake, Wallet } from "lucide-react";
import { Reveal, WordReveal } from "../motion/reveal";

// What QuickMed commits to, carried over from the old site's "Our promise to you".
const promises = [
    {
        icon: Clock,
        title: "Punctual",
        description: "Your time matters, and so does your patient's. We show up when we say we will.",
    },
    {
        icon: Handshake,
        title: "Trusted partner",
        description: "We build lasting relationships with the pharmacies we work with and the patients they serve.",
    },
    {
        icon: HeartHandshake,
        title: "Dedicated care",
        description: "Every package is handled as if it were going to our own family.",
    },
    {
        icon: Wallet,
        title: "Cost-conscious",
        description: "Simple pricing by distance, from $5 a delivery, with no drivers or vehicles for you to pay for.",
    },
];

export function OurPromise() {
    return (
        <section id="promise" className="bg-white pb-20 md:pb-28 scroll-mt-24">
            <div className="mx-auto max-w-6xl px-5 md:px-8">
                <WordReveal
                    className="title-lg text-ink mb-12 md:mb-16"
                    parts={[{ text: "Our promise" }, { text: "to you.", className: "text-brand-deep font-semibold" }]}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                    {promises.map(({ icon: Icon, ...promise }, index) => (
                        <Reveal key={promise.title} delay={index * 100} className="rounded-[20px] bg-surface p-6 md:p-7 text-center">
                            <span className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-brand text-ink">
                                <Icon className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <h3 className="text-2xl tracking-tight text-ink mb-3">{promise.title}</h3>
                            <p className="text-ink leading-relaxed">{promise.description}</p>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
