import Link from "next/link";
import { PageHeader } from "@/components/portal/ui";

const steps = [
    {
        title: "Form submission",
        body: "Log in to this secure portal and fill out a straightforward form with the delivery details: who the patient is, where they live, and any special handling such as refrigeration or narcotics.",
    },
    {
        title: "Delivery scheduling",
        body: "Once we receive your request, our team processes it and coordinates with our network of reliable drivers to schedule the most suitable one to collect the delivery from your pharmacy at the designated time.",
    },
    {
        title: "Efficient delivery",
        body: "Our professional drivers know the local routes and use modern logistics technology to deliver on time. QuickMed takes pride in its commitment to punctuality and customer satisfaction.",
    },
];

export default function HowItWorksPage() {
    return (
        <>
            <PageHeader eyebrow="How to use QuickMed" title="Three simple steps." />
            <p className="text-gray max-w-2xl mb-10">
                Thank you for choosing QuickMed as your pharmaceutical delivery partner. Here are our three simple steps to
                ensure efficient and reliable medication delivery to your patients.
            </p>
            <ol className="grid gap-4 md:grid-cols-3">
                {steps.map((step, i) => (
                    <li key={step.title} className="rounded-lg bg-white border border-hairline p-6 md:p-8 flex flex-col">
                        <span className="label-mono text-gray-mid">Step {String(i + 1).padStart(2, "0")}</span>
                        <h2 className="mt-6 text-2xl tracking-tight text-ink">{step.title}</h2>
                        <p className="mt-3 text-gray leading-relaxed">{step.body}</p>
                    </li>
                ))}
            </ol>
            <div className="mt-10 rounded-lg bg-ink text-white p-6 md:p-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="label-mono text-white/60">Questions?</p>
                    <p className="mt-2 text-xl">
                        Reach our customer support team at{" "}
                        <a href="tel:+14168349123" className="text-accent hover:underline">(416) 834-9123</a>.
                    </p>
                </div>
                <Link
                    href="/portal"
                    className="label-mono inline-flex items-center justify-center rounded-lg bg-accent px-5 py-3.5 text-ink hover:bg-white transition-colors"
                >
                    Request a delivery
                </Link>
            </div>
        </>
    );
}
