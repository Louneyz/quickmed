import Link from "next/link";
import { PageHeader } from "@/components/portal/ui";

const steps = [
    {
        title: "Send a request",
        body: "Fill out the delivery form in this portal: the patient's name, address and phone number, plus any special handling such as refrigeration or narcotics.",
    },
    {
        title: "We schedule a driver",
        body: "Our team assigns a driver, who picks up the order at your pharmacy at the time you chose.",
    },
    {
        title: "Your patient gets it",
        body: "The driver takes the order straight to your patient's door. You can follow each request's status on your Deliveries page.",
    },
];

export default function HowItWorksPage() {
    return (
        <>
            <PageHeader eyebrow="How to use QuickMed" title="Three steps." />
            <p className="text-ink max-w-2xl mb-10">
                Here&apos;s how a delivery works, from your request to your patient&apos;s door.
            </p>
            <ol className="grid gap-4 md:grid-cols-3">
                {steps.map((step, i) => (
                    <li key={step.title} className="rounded-lg bg-white border border-hairline p-6 md:p-8 flex flex-col">
                        <span className="label-mono text-ink">Step {String(i + 1).padStart(2, "0")}</span>
                        <h2 className="mt-6 text-2xl tracking-tight text-ink">{step.title}</h2>
                        <p className="mt-3 text-ink leading-relaxed">{step.body}</p>
                    </li>
                ))}
            </ol>
            <div className="mt-10 rounded-lg bg-ink text-white p-6 md:p-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="label-mono text-white">Questions?</p>
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
