import { Reveal, WordReveal } from "./motion/reveal";
import { CounterScene, PackageScene, PrivacyScene, RouteScene } from "./home/scenes";

const services = [
    {
        eyebrow: "01 Collaboration",
        title: "Seamless Collaboration",
        description: "We work directly with pharmacies to fit delivery into your existing workflow.",
        scene: CounterScene,
    },
    {
        eyebrow: "02 Privacy",
        title: "Patient Privacy",
        description: "Patient information is handled in line with Ontario's PHIPA and Canada's PIPEDA, and requests go through our secure member area.",
        scene: PrivacyScene,
    },
    {
        eyebrow: "03 Drivers",
        title: "Trained Drivers",
        description: "Professional drivers who are trained for medication delivery and know the local routes.",
        scene: RouteScene,
    },
    {
        eyebrow: "04 Handling",
        title: "Discreet and Secure",
        description: "Secure, discreet packaging, with temperature control when a medication needs it.",
        scene: PackageScene,
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
                        QuickMed provides a comprehensive logistics solution tailored specifically for the pharmaceutical industry.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                    {services.map(({ scene: SceneArt, ...service }, index) => (
                        <Reveal key={service.title} delay={index * 100} className="bg-surface rounded-[20px] p-6 md:p-7 flex flex-col">
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
