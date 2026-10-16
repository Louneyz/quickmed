const values = [
    {
        title: "Punctuality",
        description: "We respect time. Deliveries are efficient and always on schedule.",
    },
    {
        title: "Trust",
        description: "Building reliable relationships with pharmacies and patients is our priority.",
    },
    {
        title: "Care",
        description: "We handle every package with the utmost care, as if it were for our own family.",
    },
    {
        title: "Cost Efficiency",
        description: "Striving for the highest standards in logistics and customer service.",
    },
];

export function Values() {
    return (
        <section className="bg-white py-20 md:py-28 border-t border-hairline">
            <div className="mx-auto max-w-6xl px-5 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4">
                        <p className="label-mono text-gray-mid mb-6">Why QuickMed</p>
                        <h2 className="title-md text-ink max-w-xs">
                            Four promises <span className="text-gray-light">behind every delivery.</span>
                        </h2>
                    </div>
                    <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 border-t border-hairline">
                        {values.map((value, index) => (
                            <div key={value.title} className="py-8 sm:pr-8 border-b border-hairline sm:odd:border-r sm:even:pl-8">
                                <p className="label-mono text-gray-light mb-4">{String(index + 1).padStart(2, "0")}</p>
                                <h3 className="text-2xl tracking-tight text-ink mb-2">{value.title}</h3>
                                <p className="text-gray leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
