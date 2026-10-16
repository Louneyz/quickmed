'use client';

import { useState } from "react";
import { clsx } from "clsx";
import { faqGroups, faqJsonLd } from "@/lib/faq";

export function FAQ() {
    const [openKey, setOpenKey] = useState<string | null>(null);

    return (
        <section id="questions" className="bg-white py-20 md:py-32 scroll-mt-24">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()).replace(/</g, "\\u003c") }} />
            <div className="mx-auto max-w-6xl px-5 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4">
                    <div className="lg:sticky lg:top-28">
                        <h2 className="title-md text-ink max-w-xs">
                            Frequently asked <span className="text-brand-deep">questions.</span>
                        </h2>
                        <p className="mt-6 text-lg text-ink max-w-xs">
                            Don&apos;t see your question? Call{" "}
                            <a href="tel:+14168349123" className="underline underline-offset-4 hover:text-brand-deep">(416) 834-9123</a>.
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-8 space-y-12">
                    {faqGroups.map((group) => (
                        <div key={group.heading}>
                            <h3 className="label-mono text-ink mb-4">{group.heading}</h3>
                            <div className="border-t border-ink/15">
                                {group.items.map((faq) => {
                                    const open = openKey === faq.question;
                                    return (
                                        <div key={faq.question} className="border-b border-ink/15">
                                            <button
                                                className="w-full py-6 text-left flex items-center justify-between gap-6 focus:outline-none focus-visible:text-accent"
                                                aria-expanded={open}
                                                onClick={() => setOpenKey(open ? null : faq.question)}
                                            >
                                                <span className="text-xl md:text-2xl tracking-tight text-ink text-balance">{faq.question}</span>
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
                                                    <p className="text-ink text-lg leading-snug pb-6 max-w-2xl text-pretty">{faq.answer}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
