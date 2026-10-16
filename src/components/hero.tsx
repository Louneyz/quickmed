import Image from "next/image";
import { CtaLink } from "./ui/cta-link";

export function Hero() {
    return (
        <section className="relative bg-ink text-white overflow-hidden">
            <div className="absolute inset-0 grid-pattern [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" aria-hidden="true" />
            <div className="absolute -top-40 right-0 w-[40rem] h-[40rem] rounded-full bg-accent/15 blur-3xl" aria-hidden="true" />

            <div className="relative mx-auto max-w-6xl px-5 md:px-8 pt-36 md:pt-44 pb-24 md:pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    <div className="lg:col-span-7 text-center lg:text-left">
                        <p className="label-mono text-white/60 mb-8">Pharmacy delivery partner</p>
                        <h1 className="title-xl mb-8">
                            Fast and reliable pharmaceutical delivery<span className="text-accent">.</span>
                        </h1>
                        <p className="text-lg md:text-xl leading-snug text-white/70 max-w-xl mx-auto lg:mx-0 mb-10">
                            We bridge the gap between pharmacies and patients with secure, timely, and professional medication delivery services.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                            <CtaLink href="/partners" variant="accent" className="[--cta-hover:#ffffff] hover:text-ink">
                                Become a partner
                            </CtaLink>
                            <CtaLink href="/drivers" variant="outline-light">
                                Apply as driver
                            </CtaLink>
                        </div>
                    </div>

                    <div className="lg:col-span-5 flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-sm aspect-square rounded-[20px] bg-white/[0.04] border border-white/10 overflow-hidden">
                            <Image
                                src="/images/hero_illustration_transparent.png"
                                alt="QuickMed courier carrying a pharmacy delivery bag"
                                fill
                                sizes="(min-width: 1024px) 384px, 90vw"
                                className="object-contain scale-110"
                                priority
                            />
                            <span className="label-mono absolute left-4 top-4 text-white/50">01</span>
                            <span className="label-mono absolute right-4 bottom-4 text-white/50">Same-day</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative flex justify-center text-white" aria-hidden="true">
                <div className="notch" />
            </div>
        </section>
    );
}
