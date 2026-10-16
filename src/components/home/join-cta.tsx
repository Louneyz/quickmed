import { CtaLink } from "../ui/cta-link";
import { WordReveal } from "../motion/reveal";
import { DoorstepLine } from "./scenes";

// Last stop of the route: the patient's door, and the page's final ask.
export function JoinCta() {
    return (
        <section id="doorstep" className="bg-white pt-20 md:pt-28 scroll-mt-24">
            <div className="mx-auto max-w-6xl px-5 md:px-8">
                <div className="flex justify-center text-ink" aria-hidden="true">
                    <div className="notch" />
                </div>
                <div className="relative overflow-hidden rounded-[20px] bg-ink text-white px-6 py-12 md:px-16 md:py-16 text-center">
                    <div className="absolute inset-0 grid-pattern" aria-hidden="true" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgb(65_191_249/0.35),transparent_60%)]" aria-hidden="true" />
                    <div className="relative">
                        <p className="label-mono text-white mb-5 inline-flex items-center gap-3">
                            <span className="relative inline-flex h-2.5 w-2.5" aria-hidden="true">
                                <span className="pin-pulse absolute inset-0 rounded-full bg-brand" />
                                <span className="relative h-2.5 w-2.5 rounded-full bg-brand" />
                            </span>
                            Join QuickMed
                        </p>
                        <WordReveal
                            className="title-md max-w-3xl mx-auto mb-8"
                            parts={[
                                { text: "Your patients stay home." },
                                { text: "We bring the prescription.", className: "text-brand" },
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
                        <div className="-mx-2 mt-10 md:-mx-10 md:mt-12">
                            <DoorstepLine />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
