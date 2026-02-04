'use client';

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { clsx } from "clsx";

const faqs = [
    {
        question: "How fast is the delivery?",
        answer: "Most deliveries are completed within 2-4 hours of pickup, depending on the distance and urgency level selected by the pharmacy.",
    },
    {
        question: "Is the service HIPAA compliant?",
        answer: "Yes, all our drivers are trained in HIPAA compliance and we use secure technology to ensure patient data privacy.",
    },
    {
        question: "How can I become a partner pharmacy?",
        answer: "You can click on the 'Become A Partner' button in the menu, fill out the form, and our team will get back to you within 24 hours.",
    },
    {
        question: "Do you deliver on weekends?",
        answer: "Yes, QuickMed operates 7 days a week to ensure patients receive their medications when they need them.",
    },
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                            <button
                                className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none hover:bg-slate-50 transition-colors"
                                onClick={() => toggleFAQ(index)}
                            >
                                <span className="font-semibold text-slate-800">{faq.question}</span>
                                {openIndex === index ? (
                                    <ChevronUp className="h-5 w-5 text-primary" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                )}
                            </button>
                            <div
                                className={clsx(
                                    "px-6 overflow-hidden transition-all duration-300 ease-in-out",
                                    openIndex === index ? "max-h-40 py-4 opacity-100" : "max-h-0 py-0 opacity-0"
                                )}
                            >
                                <p className="text-muted-foreground text-sm">{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
