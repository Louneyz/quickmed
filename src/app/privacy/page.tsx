import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
    title: "Privacy Policy | QuickMed",
    description: "How QuickMed protects patient and pharmacy information under PHIPA and PIPEDA.",
};

const sections = [
    {
        title: "Who we are",
        body: [
            "QuickMed delivers medication from partner pharmacies to their patients in Ontario. When we deliver for a pharmacy, the pharmacy is the health information custodian under Ontario's Personal Health Information Protection Act (PHIPA), and QuickMed acts as its agent. We also follow Canada's Personal Information Protection and Electronic Documents Act (PIPEDA) for the business information we hold about our partners.",
        ],
    },
    {
        title: "What we collect",
        body: [
            "Patient information, from our partner pharmacies only: name, delivery address, phone number and handling instructions (for example, refrigerated or signature required). We do not collect medication names, diagnoses or health card numbers.",
            "Pharmacy information: business name, contact name, email, phone and address, and records of the deliveries we perform.",
            "Website visitors: if you contact us through this site we keep what you send us so we can reply.",
        ],
    },
    {
        title: "How we use it",
        body: [
            "Patient information is used only to schedule and complete the delivery the pharmacy asked for and to answer questions about that delivery. We never sell it, use it for marketing, or share it with anyone other than the driver assigned to the delivery.",
            "Pharmacy information is used to run our partner portal, keep delivery records and contact you about your account.",
        ],
    },
    {
        title: "Where it is stored and how it is protected",
        body: [
            "Delivery and patient information is stored in Canada, encrypted in transit and at rest. Each pharmacy can only see its own deliveries, and only QuickMed staff who schedule deliveries can see across pharmacies. Accounts are created by invitation only, sessions end automatically after inactivity, and every submission and status change is logged.",
        ],
    },
    {
        title: "How long we keep it",
        body: [
            "Patient names, addresses and phone numbers are removed from our systems a set period after a delivery is completed. We keep anonymous delivery counts for billing and reporting. The pharmacy keeps its own patient records under its own obligations.",
        ],
    },
    {
        title: "If something goes wrong",
        body: [
            "If patient information is lost, stolen or accessed without authorization, we notify the pharmacy at the first reasonable opportunity so it can notify the patient and the Information and Privacy Commissioner of Ontario as PHIPA requires. We keep a record of every privacy breach.",
        ],
    },
    {
        title: "Your choices and questions",
        body: [
            "Patients who want to see or correct their information should contact their pharmacy, which controls it. Pharmacies and anyone else with a privacy question or complaint can contact our privacy contact at info@quickmed.ca or (416) 834-9123. You can also contact the Information and Privacy Commissioner of Ontario (ipc.on.ca) or the Office of the Privacy Commissioner of Canada (priv.gc.ca).",
        ],
    },
];

export default function PrivacyPage() {
    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />
            <article className="flex-1 mx-auto w-full max-w-3xl px-5 md:px-8 py-16 md:py-24">
                <p className="label-mono text-gray-mid">Privacy</p>
                <h1 className="title-lg text-ink mt-4">Privacy policy</h1>
                <p className="mt-6 text-gray">Last updated October 2026</p>
                <div className="mt-14 space-y-12">
                    {sections.map((s) => (
                        <section key={s.title}>
                            <h2 className="title-md text-ink">{s.title}</h2>
                            {s.body.map((p) => (
                                <p key={p.slice(0, 32)} className="mt-4 text-lg leading-relaxed text-gray">{p}</p>
                            ))}
                        </section>
                    ))}
                </div>
            </article>
            <Footer />
        </main>
    );
}
