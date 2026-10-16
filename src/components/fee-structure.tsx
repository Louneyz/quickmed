import { feeTiers as tiers } from "@/lib/pricing";

export function FeeStructure() {
    return (
        <section className="w-full max-w-5xl mx-auto py-16 px-4">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-[#4A86C6] mb-8 uppercase text-left tracking-wide">
                    QuickMed KM Fee Structure
                </h2>

                {/* Header Row */}
                <div className="grid grid-cols-12 gap-4 mb-4 text-white font-semibold text-center text-lg">
                    <div className="col-span-3 bg-[#5B89BD] py-3 rounded-full flex items-center justify-center shadow-sm">
                        Sector
                    </div>
                    <div className="col-span-6 bg-[#5B89BD] py-3 rounded-full flex items-center justify-center shadow-sm">
                        Radius
                    </div>
                    <div className="col-span-3 bg-[#5B89BD] py-3 rounded-full flex items-center justify-center shadow-sm">
                        Fee $
                    </div>
                </div>

                {/* Data Rows */}
                <div className="space-y-4">
                    {tiers.map((tier, index) => (
                        <div key={index} className="grid grid-cols-12 gap-4 text-[#333333] font-medium text-center">
                            <div className="col-span-3 bg-[#89C2D9] py-3 rounded-full flex items-center justify-center shadow-sm">
                                {tier.name}
                            </div>
                            <div className="col-span-6 bg-[#89C2D9] py-3 rounded-full flex items-center justify-center shadow-sm">
                                {tier.radius}
                            </div>
                            <div className="col-span-3 bg-[#89C2D9] py-3 rounded-full flex items-center justify-center shadow-sm">
                                {tier.fee}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
