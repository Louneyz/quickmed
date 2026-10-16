import Image from "next/image";
import { Reveal, WordReveal } from "./motion/reveal";

const partners = [
    { src: "/images/partner_logo_color_1.png", name: "Shoppers Drug Mart" },
    { src: "/images/partner_logo_color_2.png", name: "Walmart Pharmacy" },
    { src: "/images/partner_logo_color_3.png", name: "Rexall" },
    { src: "/images/logo_pharma_final.png", name: "PharmaChoice" },
    { src: "/images/logo_ida_final.png", name: "I.D.A. Pharmacy" },
];

function Cross({ className }: { className: string }) {
    return (
        <span className={`absolute w-[11px] h-[11px] -translate-x-1/2 -translate-y-1/2 ${className}`} aria-hidden="true">
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gray-mid/70" />
            <span className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2 bg-gray-mid/70" />
        </span>
    );
}

export function Partners() {
    return (
        <section id="trusted" className="bg-white py-20 md:py-28 scroll-mt-24">
            <div className="mx-auto max-w-6xl px-5 md:px-8">
                <WordReveal
                    className="title-lg text-ink text-center max-w-3xl mx-auto mb-14 md:mb-20"
                    parts={[
                        { text: "Trusted by the pharmacies" },
                        { text: "your patients know.", className: "text-gray-light" },
                    ]}
                />

                <div className="relative grid grid-cols-2 md:grid-cols-5 border-t border-l border-hairline">
                    {partners.map((partner, index) => (
                        <div key={partner.name} className="relative h-28 md:h-36 border-r border-b border-hairline flex items-center justify-center p-6">
                            <Cross className="left-0 top-0" />
                            <Reveal delay={index * 90} className="relative w-full h-10 md:h-12">
                                <Image src={partner.src} alt={partner.name} fill sizes="200px" className="object-contain" />
                            </Reveal>
                        </div>
                    ))}
                    {/* Empty cell keeps the 2-column mobile grid even. */}
                    <div className="md:hidden h-28 border-r border-b border-hairline" aria-hidden="true" />
                </div>
            </div>
        </section>
    );
}
