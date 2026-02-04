import Image from "next/image";

export function Partners() {
    const partners = [
        "/images/partner_logo_color_1.png", // Shoppers
        "/images/partner_logo_color_2.png", // Walmart
        "/images/partner_logo_color_3.png", // Rexall
        "/images/logo_pharma_final.png", // PharmaChoice
        "/images/logo_ida_final.png", // IDA
    ];

    return (
        <section className="py-16 bg-white border-y border-slate-100">
            <div className="container mx-auto px-4">
                <h2 className="text-center text-2xl font-bold text-slate-800 mb-10">Trusted Partners</h2>

                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-100 hover:opacity-100 transition-opacity duration-300">
                    {partners.map((logo, index) => (
                        <div key={index} className="relative w-32 h-16 md:w-40 md:h-20 transition-all duration-300 transform hover:scale-105">
                            <Image
                                src={logo}
                                alt={`Partner ${index + 1}`}
                                fill
                                className="object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
