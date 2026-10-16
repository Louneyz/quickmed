import { CtaLink } from "../ui/cta-link";
import { Reveal } from "../motion/reveal";

// Mid-page ask, placed right after the route and safeguards so the
// primary button reappears at the point a pharmacy has the full picture.
export function CheckpointCta() {
    return (
        <section className="bg-white pb-20 md:pb-28">
            <div className="mx-auto max-w-6xl px-5 md:px-8">
                <Reveal className="rounded-[20px] bg-brand text-ink px-6 py-10 md:px-12 md:py-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="max-w-2xl">
                        <p className="title-md">
                            Don&apos;t lose the patients who can&apos;t make it in.
                        </p>
                        <p className="mt-4 text-lg leading-snug">
                            When getting to the pharmacy gets hard, patients go looking for one that delivers.
                        </p>
                    </div>
                    <div className="shrink-0 flex flex-col items-start md:items-end gap-3">
                        <CtaLink href="/partners" variant="ink">
                            Become a partner
                        </CtaLink>
                        <a href="tel:+14168349123" className="label-mono text-ink hover:text-ink">or call (416) 834-9123</a>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
