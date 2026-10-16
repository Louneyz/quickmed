'use client';

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "./ui/button";
import { CtaLink } from "./ui/cta-link";

const links = [
    { href: "/", label: "Home" },
    { href: "/partners", label: "Become a partner" },
    { href: "/drivers", label: "Become a driver" },
];

// Floating frosted-glass bar. `overlay` lets it sit over a dark hero (homepage);
// other pages keep it in the flow on an ink background.
export function Navbar({ overlay = false }: { overlay?: boolean }) {
    const [open, setOpen] = useState(false);

    return (
        <header
            className={cn(
                "z-50 w-full px-4 md:px-8 pt-4 md:pt-6",
                overlay ? "fixed top-0 left-0" : "sticky top-0 bg-white border-b border-hairline pb-4 md:pb-6",
            )}
        >
            <div className="mx-auto max-w-6xl flex h-16 items-center justify-between rounded-lg bg-white/75 backdrop-blur-[30px] shadow-[0_4px_24px_rgb(15_23_42/0.08)] pl-5 pr-2">
                <Link href="/" className="flex items-center" aria-label="QuickMed home">
                    <img
                        src="/images/brand/quickmed-logo-navy.svg"
                        alt="QuickMed"
                        className="h-7 w-auto"
                    />
                </Link>

                <nav className="hidden lg:flex items-center gap-1 text-sm text-ink/80">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="px-3 py-2 rounded-md transition-colors hover:text-ink hover:bg-ink/5"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden lg:flex items-center gap-2">
                    <CtaLink href="/partners" variant="ink" className="py-3.5 px-4">
                        Partner with us
                    </CtaLink>
                    <CtaLink href="/login" variant="ghost" className="py-3.5 px-4">
                        Login
                    </CtaLink>
                </div>

                <button
                    type="button"
                    className="lg:hidden h-12 w-12 flex items-center justify-center rounded-lg text-ink hover:bg-ink/5"
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                    onClick={() => setOpen(!open)}
                >
                    {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {open && (
                <div className="lg:hidden mx-auto mt-2 max-w-6xl rounded-lg bg-white/90 backdrop-blur-[30px] shadow-[0_4px_24px_rgb(15_23_42/0.08)] p-5 flex flex-col gap-1">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="py-3 text-lg text-ink border-b border-ink/10"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="grid grid-cols-2 gap-2 pt-4">
                        <CtaLink href="/partners" variant="ink">Partner with us</CtaLink>
                        <CtaLink href="/login" variant="ghost">Login</CtaLink>
                    </div>
                </div>
            )}
        </header>
    );
}
