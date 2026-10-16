import { Reveal, WordReveal } from "./motion/reveal";
import { CounterScene, PackageScene, PrivacyScene, RouteScene, SupportScene } from "./home/scenes";

const services = [
    {
        eyebrow: "01 Speedy",
        title: "Pickup on your schedule",
        description: "Tell us when the order is ready. A driver is at your counter at that time.",
        scene: CounterScene,
    },
    {
        eyebrow: "02 Reliable",
        title: "Drivers who know the area",
        description: "Our drivers are trained for medication delivery and know the local routes.",
        scene: RouteScene,
    },
    {
        eyebrow: "03 Discreet",
        title: "Plain, sealed packaging",
        description: "Orders travel sealed and discreet, with temperature control when the medication needs it.",
        scene: PackageScene,
    },
    {
        eyebrow: "04 Secure",
        title: "Patient privacy, protected",
        description: "We handle patient information under Ontario's PHIPA and Canada's PIPEDA. Requests only go through a login-protected portal.",
        scene: PrivacyScene,
    },
    {
        eyebrow: "05 Customer first",
        title: "Here for you",
        description: "Your customer-first delivery partner in Ontario. We put your pharmacy's needs at the centre of everything, with reliable deliveries and friendly service from a real person at (416)\u00a0834-9123.",
        scene: SupportScene,
    },
];

export function Services() {
    return (
        <section id="safeguards" className="bg-white py-20 md:py-32 scroll-mt-24">
            <div className="mx-auto max-w-6xl xl:max-w-7xl px-5 md:px-8">
                <div className="max-w-3xl mb-12 md:mb-16">
                    <WordReveal
                        className="title-lg text-ink"
                        parts={[
                            { text: "Handled with care," },
                            { text: "pharmacy to patient.", className: "text-brand-deep font-semibold" },
                        ]}
                    />
                    <p className="mt-6 text-lg text-ink max-w-xl">
                        Every delivery runs the same way, from your counter to your patient&apos;s door.
                    </p>
                </div>

                {/* One row of five on wide screens; three or two per row below that, with the last row centred at the same card size. */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-5">
                    {services.map(({ scene: SceneArt, ...service }, index) => (
                        <Reveal key={service.title} delay={index * 80} className="bg-surface rounded-[20px] p-6 xl:p-5 flex flex-col w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.84rem)] xl:w-[calc(20%-1rem)]">
                            <p className="label-mono text-ink mb-4">{service.eyebrow}</p>
                            <h3 className="text-2xl xl:text-xl tracking-tight text-ink mb-3">{service.title}</h3>
                            <p className="text-ink leading-relaxed mb-6 xl:text-[15px]">{service.description}</p>
                            <div className="relative mt-auto aspect-[16/9] xl:aspect-[4/3] rounded-xl overflow-hidden bg-white">
                                <SceneArt />
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
