import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

export function Hero() {
    return (
        <section className="relative bg-primary py-12 md:py-24 overflow-hidden">
            {/* Background Pattern Effects (Subtle circles/waves) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
                <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white blur-3xl"></div>
                <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full bg-blue-300 blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="w-full md:w-1/2 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
                            Fast And Reliable <br className="hidden lg:block" /> Pharmaceutical Delivery
                        </h1>
                        <p className="text-lg md:text-xl text-blue-50 mb-10 max-w-xl mx-auto md:mx-0">
                            We bridge the gap between pharmacies and patients with secure, timely, and professional medication delivery services.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Button asChild size="lg" className="bg-white text-primary hover:bg-blue-50 border-none font-bold shadow-lg text-base px-8">
                                <Link href="/partners">Become A Partner</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary font-bold text-base px-8 bg-transparent">
                                <Link href="/drivers">Apply as Driver</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 flex justify-center">
                        <div className="relative w-full max-w-lg aspect-square">
                            <div className="relative w-full max-w-sm aspect-square rounded-full overflow-hidden border-4 border-white shadow-2xl">
                                <Image
                                    src="/images/hero_illustration_1770207656274.png"
                                    alt="QuickMed Delivery Professional"
                                    fill
                                    className="object-cover scale-[1.6]"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
