'use client';

import { useState } from "react";
import { clsx } from "clsx";

const faqs = [
    {
        question: "How do I request a delivery?",
        answer: "Partner pharmacies log in to our secure member area and fill out a short form with the recipient's information and the medication details.",
    },
    {
        question: "How is patient information protected?",
        answer: "We handle personal health information in line with Ontario's Personal Health Information Protection Act (PHIPA) and Canada's PIPEDA. Requests are submitted through a secure, login-only member area, and our drivers are trained in confidentiality.",
    },
    {
        question: "What happens after I submit a request?",
        answer: "Our team processes the request and schedules a driver from our network to collect the delivery from your pharmacy at the designated time.",
    },
    {
        question: "How can I become a partner pharmacy?",
        answer: "Fill out the Become a Partner form. Our team sets up your pharmacy's account and emails you your login details.",
    },
    {
        question: "Who do I contact with questions?",
        answer: "Call our customer support team at (416) 834-9123.",
    },
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="questions" className="bg-white py-20 md:py-32 scroll-mt-24">
            <div className="mx-auto max-w-6xl px-5 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4">
                    <h2 className="title-md text-ink max-w-xs">
                        Frequently asked <span className="text-gray-light">questions.</span>
                    </h2>
                </div>

                <div className="lg:col-span-8 border-t border-ink/15">
                    {faqs.map((faq, index) => {
                        const open = openIndex === index;
                        return (
                            <div key={index} className="border-b border-ink/15">
                                <button
                                    className="w-full py-6 text-left flex items-center justify-between gap-6 focus:outline-none focus-visible:text-accent"
                                    aria-expanded={open}
                                    onClick={() => toggleFAQ(index)}
                                >
                                    <span className="text-xl md:text-2xl tracking-tight text-ink">{faq.question}</span>
                                    <span className={clsx("relative h-4 w-4 shrink-0 transition-transform duration-300", open && "rotate-45")} aria-hidden="true">
                                        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink" />
                                        <span className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2 bg-ink" />
                                    </span>
                                </button>
                                <div
                                    className={clsx(
                                        "grid transition-all duration-300 ease-out",
                                        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                    )}
                                >
                                    <div className="overflow-hidden">
                                        <p className="text-gray text-lg leading-snug pb-6 max-w-2xl">{faq.answer}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
