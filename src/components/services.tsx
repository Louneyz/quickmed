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
        title: "A real person on the phone",
        description: "Questions about a delivery? Call (416) 834-9123 and talk to our team.",
        scene: SupportScene,
    },
];

export function Services() {
    return (
        <section id="safeguards" className="bg-white py-20 md:py-32 scroll-mt-24">
            <div className="mx-auto max-w-6xl px-5 md:px-8">
                <div className="max-w-3xl mb-12 md:mb-16">
                    <WordReveal
                        className="title-lg text-ink"
                        parts={[
                            { text: "Handled with care," },
                            { text: "pharmacy to patient.", className: "text-gray-light" },
                        ]}
                    />
                    <p className="mt-6 text-lg text-gray max-w-xl">
                        Every delivery runs the same way, from your counter to your patient&apos;s door.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-5">
                    {services.map(({ scene: SceneArt, ...service }, index) => (
                        <Reveal key={service.title} delay={(index % 3) * 100} className={`bg-surface rounded-[20px] p-6 md:p-7 flex flex-col ${index < 3 ? "lg:col-span-2" : "lg:col-span-3"} ${index === 4 ? "sm:col-span-2 lg:col-span-3" : ""}`}>
                            <p className="label-mono text-gray-mid mb-4">{service.eyebrow}</p>
                            <h3 className="text-2xl tracking-tight text-ink mb-3">{service.title}</h3>
                            <p className="text-gray leading-relaxed mb-6">{service.description}</p>
                            <div className="relative mt-auto aspect-[16/9] sm:aspect-[4/3] rounded-xl overflow-hidden bg-white">
                                <SceneArt />
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
