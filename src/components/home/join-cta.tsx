import { CtaLink } from "../ui/cta-link";

export function JoinCta() {
    return (
        <section className="bg-white pt-20 md:pt-28">
            <div className="mx-auto max-w-6xl px-5 md:px-8">
                <div className="flex justify-center text-ink" aria-hidden="true">
                    <div className="notch" />
                </div>
                <div className="relative overflow-hidden rounded-[20px] bg-ink text-white px-6 py-16 md:px-16 md:py-24 text-center">
                    <div className="absolute inset-0 grid-pattern" aria-hidden="true" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgb(65_191_249/0.25),transparent_60%)]" aria-hidden="true" />
                    <div className="relative">
                        <p className="label-mono text-white/60 mb-6">Join QuickMed today</p>
                        <h2 className="title-lg max-w-3xl mx-auto mb-10">
                            Deliver more, <span className="text-white/40">without running a fleet<span className="text-accent">.</span></span>
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <CtaLink href="/partners" variant="accent" className="[--cta-hover:#ffffff] hover:text-ink">
                                Become a partner
                            </CtaLink>
                            <CtaLink href="/drivers" variant="outline-light">
                                Become a driver
                            </CtaLink>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
