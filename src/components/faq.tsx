'use client';

import { useState } from "react";
import { clsx } from "clsx";

const faqs = [
    {
        question: "How do I book a delivery?",
        answer: "Log in to your QuickMed account and fill out a short form with the patient's address and what's being delivered. That's it.",
    },
    {
        question: "How do you protect patient information?",
        answer: "We follow Ontario's PHIPA and Canada's PIPEDA. Requests only come in through your password-protected account, and our drivers are trained to keep patient details private.",
    },
    {
        question: "What happens after I book?",
        answer: "We assign a driver, who picks up the order at your pharmacy at the time you chose and takes it to your patient.",
    },
    {
        question: "How do I become a partner?",
        answer: "Fill out the partner form. We set up your pharmacy's account and email you your login.",
    },
    {
        question: "Who do I call with a question?",
        answer: "Call us at (416) 834-9123. You'll reach a person on our team.",
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
