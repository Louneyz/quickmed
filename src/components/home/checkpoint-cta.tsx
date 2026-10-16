import { CtaLink } from "../ui/cta-link";
import { Reveal } from "../motion/reveal";

// Mid-page ask, placed right after the route and safeguards so the
// primary button reappears at the point a pharmacy has the full picture.
export function CheckpointCta() {
    return (
        <section className="bg-white pb-20 md:pb-28">
            <div className="mx-auto max-w-6xl px-5 md:px-8">
                <Reveal className="rounded-[20px] bg-brand text-ink px-6 py-10 md:px-12 md:py-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <p className="label-mono text-ink/70 mb-4">Next stop · Your pharmacy</p>
                        <p className="title-md max-w-xl">
                            Add same-day delivery <span className="text-ink/55">without hiring a driver.</span>
                        </p>
                    </div>
                    <CtaLink href="/partners" variant="ink" className="shrink-0">
                        Become a partner
                    </CtaLink>
                </Reveal>
            </div>
        </section>
    );
}
