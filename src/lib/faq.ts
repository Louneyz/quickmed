import { feeTiers } from "./pricing";

// Homepage FAQ. The same text feeds the accordion and the FAQPage structured data,
// so search engines and AI answers quote exactly what visitors read.
// Only facts QuickMed has confirmed belong here; the portal and privacy policy are the source.

function priceList() {
    const parts = feeTiers.map((tier, i) => {
        const fee = tier.fee.replace(/\.(\d)$/, (_, d) => `.${d}0`);
        const upTo = tier.radius.match(/to (\d+(?:\.\d+)?)km/);
        if (upTo) return `${fee} up to ${Number(upTo[1])} km`;
        const from = tier.radius.match(/From (\d+(?:\.\d+)?)km/);
        return `${i === feeTiers.length - 1 ? "and from " : ""}${fee} beyond ${Number(from?.[1] ?? 0)} km`;
    });
    return parts.join(", ");
}

export const faqGroups: { heading: string; items: { question: string; answer: string }[] }[] = [
    {
        heading: "About QuickMed",
        items: [
            {
                question: "What is QuickMed?",
                answer: "QuickMed is a prescription delivery service for pharmacies in Ontario. We pick up orders at your pharmacy and deliver them to your patients' homes, so you can offer delivery without hiring drivers.",
            },
            {
                question: "Who uses QuickMed?",
                answer: "Pharmacies. Patients don't book with us directly. If you're a patient and want your prescription delivered, ask your pharmacy whether it delivers with QuickMed.",
            },
            {
                question: "How much does delivery cost?",
                answer: `Delivery is priced by distance from your pharmacy: ${priceList()}. Partner pharmacies see the same fee table in their portal.`,
            },
        ],
    },
    {
        heading: "Booking a delivery",
        items: [
            {
                question: "How do I book a delivery?",
                answer: "Log in to your QuickMed portal and fill out a short form with the patient's name, address and phone number, plus any handling instructions. Our team schedules a driver to pick it up at your pharmacy.",
            },
            {
                question: "Do I need to install anything?",
                answer: "No. The portal runs in your web browser on a computer, tablet or phone.",
            },
            {
                question: "Can you deliver refrigerated medication?",
                answer: "Yes. Mark the order as refrigerated medication when you book, and it travels with temperature control.",
            },
            {
                question: "Can you deliver narcotics?",
                answer: "Yes. Mark the order as a narcotic when you book so the driver knows how it needs to be handled.",
            },
            {
                question: "Can the patient pay when the order arrives?",
                answer: "Yes. Choose C.O.D. (cash on delivery) when you book and the driver collects payment from the patient at the door.",
            },
            {
                question: "Can you pick something up from a patient?",
                answer: "Yes. Book a reverse pick-up and a driver collects the item from the patient and brings it back to your pharmacy.",
            },
            {
                question: "What if a delivery is urgent?",
                answer: "Mark the request as ASAP when you book, and our team will schedule it first.",
            },
        ],
    },
    {
        heading: "Privacy and security",
        items: [
            {
                question: "How do you protect patient information?",
                answer: "We follow Ontario's Personal Health Information Protection Act (PHIPA) and Canada's PIPEDA. Patient information is stored in Canada and encrypted, each pharmacy sees only its own deliveries, and accounts are by invitation only.",
            },
            {
                question: "What patient information do you collect?",
                answer: "Only what a driver needs to deliver: the patient's name, address, phone number and handling instructions. We don't collect medication names, diagnoses or health card numbers.",
            },
        ],
    },
    {
        heading: "Joining QuickMed",
        items: [
            {
                question: "How do I become a partner pharmacy?",
                answer: "Fill out the Become a partner form. Our team reviews your request, and once it's approved we email you a login for the partner portal.",
            },
            {
                question: "How do I become a QuickMed driver?",
                answer: "Fill out the Become a driver form and attach your resume. Our team reviews every application and gets in touch.",
            },
            {
                question: "Who do I call with a question?",
                answer: "Call us at (416)\u00a0834-9123 or email info@quickmed.ca. You'll reach a person on our team.",
            },
        ],
    },
];

export function faqJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqGroups.flatMap((group) =>
            group.items.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
        ),
    };
}
