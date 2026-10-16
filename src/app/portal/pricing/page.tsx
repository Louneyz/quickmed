import { PageHeader } from "@/components/portal/ui";
import { feeTiers } from "@/lib/pricing";

export default function PricingPage() {
    return (
        <>
            <PageHeader eyebrow="Pricing" title="KM fee structure" />
            <p className="text-gray max-w-2xl mb-8">
                Each delivery is priced by the distance from your pharmacy to the patient. QuickMed never handles payment
                from patients.
            </p>
            <div className="rounded-lg bg-white border border-hairline overflow-hidden max-w-3xl">
                <div className="grid grid-cols-12 gap-4 px-5 md:px-8 py-4 bg-ink text-white label-mono">
                    <span className="col-span-3">Sector</span>
                    <span className="col-span-6">Radius</span>
                    <span className="col-span-3 text-right">Fee</span>
                </div>
                {feeTiers.map((tier) => (
                    <div key={tier.name} className="grid grid-cols-12 gap-4 px-5 md:px-8 py-4 border-t border-hairline items-center">
                        <span className="col-span-3 label-mono text-gray-mid">{tier.name}</span>
                        <span className="col-span-6 text-ink">{tier.radius}</span>
                        <span className="col-span-3 text-right text-xl tracking-tight text-ink tabular-nums">{tier.fee}</span>
                    </div>
                ))}
            </div>
        </>
    );
}
