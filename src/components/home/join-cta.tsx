import Image from "next/image";
import { CtaLink } from "../ui/cta-link";
import { Reveal, WordReveal } from "../motion/reveal";

// Last stop of the route: the patient's door, and the page's final ask.
export function JoinCta() {
    return (
        <section id="doorstep" className="bg-white pt-20 md:pt-28 scroll-mt-24">
            <div className="mx-auto max-w-6xl px-5 md:px-8">
                <div className="flex justify-center text-ink" aria-hidden="true">
                    <div className="notch" />
                </div>
                <div className="relative overflow-hidden rounded-[20px] bg-ink text-white px-6 pt-16 md:px-16 md:pt-24 text-center">
                    <div className="absolute inset-0 grid-pattern" aria-hidden="true" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgb(65_191_249/0.35),transparent_60%)]" aria-hidden="true" />
                    <div className="relative">
                        <p className="label-mono text-white/60 mb-6 inline-flex items-center gap-3">
                            <span className="relative inline-flex h-2.5 w-2.5" aria-hidden="true">
                                <span className="pin-pulse absolute inset-0 rounded-full bg-brand" />
                                <span className="relative h-2.5 w-2.5 rounded-full bg-brand" />
                            </span>
                            Last stop · Join QuickMed today
                        </p>
                        <WordReveal
                            className="title-lg max-w-3xl mx-auto mb-10"
                            parts={[
                                { text: "Deliver more," },
                                { text: "without running a fleet.", className: "text-white/40" },
                            ]}
                        />
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <CtaLink href="/partners" variant="accent" className="[--cta-hover:#ffffff] hover:text-ink">
                                Become a partner
                            </CtaLink>
                            <CtaLink href="/drivers" variant="outline-light">
                                Become a driver
                            </CtaLink>
                        </div>
                        <Reveal className="relative mx-auto mt-14 w-56 md:w-72 aspect-square translate-y-6">
                            <Image
                                src="/images/hero_illustration_transparent.png"
                                alt="QuickMed courier carrying a pharmacy delivery bag"
                                fill
                                sizes="288px"
                                className="object-contain object-bottom"
                            />
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
