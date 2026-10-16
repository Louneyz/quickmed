import Image from "next/image";

const services = [
    {
        eyebrow: "01 Collaboration",
        title: "Seamless Collaboration",
        description: "We work directly with pharmacies to integrate smooth delivery workflows.",
        image: "/images/service_collaboration_1770207670910.png",
        alt: "Pharmacist handing a bag to a courier",
    },
    {
        eyebrow: "02 Security",
        title: "Secure Delivery",
        description: "HIPAA-compliant, temperature-controlled transport for sensitive medications.",
        image: "/images/service_delivery_1770207689182.png",
        alt: "Delivery status on a phone screen",
    },
    {
        eyebrow: "03 Visibility",
        title: "Real-Time Tracking",
        description: "Patients and pharmacies can track deliveries every step of the way.",
        image: "/images/service_scooter_1770207705372.png",
        alt: "Courier on a scooter following a route",
    },
    {
        eyebrow: "04 Verification",
        title: "Proof of Delivery",
        description: "Digital signatures and photo verification ensure successful handoffs.",
        image: "/images/service_team_1770207719832.png",
        alt: "QuickMed team under a row of stars",
    },
];

export function Services() {
    return (
        <section className="bg-white pb-20 md:pb-32">
            <div className="mx-auto max-w-6xl px-5 md:px-8">
                <div className="max-w-3xl mb-12 md:mb-16">
                    <p className="label-mono text-gray-mid mb-6">What we do</p>
                    <h2 className="title-lg text-ink">
                        Logistics built for pharmacies. <span className="text-gray-light">Nothing else.</span>
                    </h2>
                    <p className="mt-6 text-lg text-gray max-w-xl">
                        QuickMed provides a comprehensive logistics solution tailored specifically for the pharmaceutical industry.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                    {services.map((service) => (
                        <article key={service.title} className="bg-surface rounded-[20px] p-6 md:p-7 flex flex-col">
                            <p className="label-mono text-gray-mid mb-4">{service.eyebrow}</p>
                            <h3 className="text-2xl tracking-tight text-ink mb-3">{service.title}</h3>
                            <p className="text-gray leading-relaxed mb-6">{service.description}</p>
                            <div className="relative mt-auto aspect-[16/9] sm:aspect-[4/3] rounded-xl overflow-hidden bg-white">
                                <Image src={service.image} alt={service.alt} fill sizes="(min-width: 1024px) 270px, (min-width: 640px) 45vw, 90vw" className="object-cover" />
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
