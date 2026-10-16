const steps = [
    {
        title: "Create Your Profile",
        description: "Sign up in seconds and verify your pharmacy credentials.",
    },
    {
        title: "Upload Delivery Info",
        description: "Upload your patients' delivery details via our secure portal.",
    },
    {
        title: "Driver Pickup",
        description: "A specially trained driver arrives to pick up your orders.",
    },
    {
        title: "Delivery Complete",
        description: "Your patient receives their delivery the very same day.",
    },
];

export function Process() {
    return (
        <section className="bg-surface py-20 md:py-32">
            <div className="mx-auto max-w-6xl px-5 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-5">
                    <div className="lg:sticky lg:top-36">
                        <p className="label-mono text-gray-mid mb-6">How it works</p>
                        <h2 className="title-lg text-ink">
                            Four steps <span className="text-gray-light">from shelf to doorstep.</span>
                        </h2>
                        <p className="mt-6 text-lg text-gray max-w-md">
                            Our streamlined process ensures that medications reach patients quickly, safely, and securely.
                        </p>
                    </div>
                </div>

                <ol className="lg:col-span-7 lg:col-start-6">
                    {steps.map((step, index) => (
                        <li key={step.title} className="grid grid-cols-[3rem_1fr] gap-4 py-10 border-t border-ink/15 first:border-t-0 lg:first:pt-0">
                            <span className="label-mono text-gray-light pt-3">{String(index + 1).padStart(2, "0")}</span>
                            <div>
                                <h3 className="title-md text-ink mb-3">{step.title}</h3>
                                <p className="text-lg text-gray leading-snug max-w-md">{step.description}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
