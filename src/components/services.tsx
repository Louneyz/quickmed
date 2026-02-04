import Image from "next/image";

const services = [
    {
        title: "Seamless Collaboration",
        description: "We work directly with pharmacies to integrate smooth delivery workflows.",
        image: "/images/service_collaboration_1770207670910.png",
    },
    {
        title: "Secure Delivery",
        description: "HIPAA-compliant, temperature-controlled transport for sensitive medications.",
        image: "/images/service_delivery_1770207689182.png",
    },
    {
        title: "Real-Time Tracking",
        description: "Patients and pharmacies can track deliveries every step of the way.",
        image: "/images/service_scooter_1770207705372.png",
    },
    {
        title: "Proof of Delivery",
        description: "Digital signatures and photo verification ensure successful handoffs.",
        image: "/images/service_team_1770207719832.png",
    },
];

export function Services() {
    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">What We Do</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        QuickMed provides a comprehensive logistics solution tailored specifically for the pharmaceutical industry.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 flex flex-col items-center text-center group hover:-translate-y-1">
                            <div className="w-full aspect-[4/3] relative mb-6 rounded-lg overflow-hidden bg-slate-50">
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">{service.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
