import Image from "next/image";

const values = [
    {
        title: "Punctuality",
        description: "We respect time. Deliveries are efficient and always on schedule.",
        icon: "/images/icon_clock_1770207742509.png",
    },
    {
        title: "Trust",
        description: "Building reliable relationships with pharmacies and patients is our priority.",
        icon: "/images/icon_handshake_1770207872415.png",
    },
    {
        title: "Care",
        description: "We handle every package with the utmost care, as if it were for our own family.",
        icon: "/images/icon_heart_1770207761225.png",
    },
    {
        title: "Cost Efficiency",
        description: "Striving for the highest standards in logistics and customer service.",
        icon: "/images/icon_coin_1770207774840.png",
    },
];

export function Values() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Why QuickMed</h2>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    {values.map((value, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-6 shadow-md border border-slate-100 p-4">
                                <div className="relative w-full h-full">
                                    <Image
                                        src={value.icon}
                                        alt={value.title}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">{value.title}</h3>
                            <p className="text-sm text-muted-foreground">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
