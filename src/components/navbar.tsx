'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "./ui/button";
import { CtaLink } from "./ui/cta-link";

const links = [
    { href: "/", label: "Home" },
    { href: "/partners", label: "Become A Partner" },
    { href: "/drivers", label: "Become A Driver" },
];

// Floating frosted-glass bar. `overlay` lets it sit over the blue hero (homepage);
// other pages keep it in the flow on a blue background.
export function Navbar({ overlay = false }: { overlay?: boolean }) {
    const [open, setOpen] = useState(false);

    return (
        <header
            className={cn(
                "z-50 w-full px-4 md:px-8 pt-4 md:pt-6",
                overlay ? "fixed top-0 left-0" : "sticky top-0 bg-accent pb-4 md:pb-6",
            )}
        >
            <div className="mx-auto max-w-6xl flex h-16 items-center justify-between rounded-lg bg-white/15 border border-white/25 backdrop-blur-[30px] pl-5 pr-2">
                <Link href="/" className="flex items-center" aria-label="QuickMed home">
                    <Image
                        src="/brand/quickmed-logo-white.svg"
                        alt="QuickMed"
                        width={175}
                        height={32}
                        className="h-8 w-auto"
                        unoptimized
                        priority
                    />
                </Link>

                <nav className="hidden md:flex items-center gap-1 text-sm text-white">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="px-3 py-2 rounded-md transition-colors hover:text-white hover:bg-white/10"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-2">
                    <CtaLink href="/partners" variant="light" className="py-3.5 px-4">
                        Partner with us
                    </CtaLink>
                    <CtaLink href="/login" variant="outline-light" className="py-3.5 px-4">
                        Login
                    </CtaLink>
                </div>

                <button
                    type="button"
                    className="md:hidden h-12 w-12 flex items-center justify-center rounded-lg text-white hover:bg-white/10"
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                    onClick={() => setOpen(!open)}
                >
                    {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {open && (
                <div className="md:hidden mx-auto mt-2 max-w-6xl rounded-lg bg-accent/95 border border-white/25 backdrop-blur-[30px] p-5 flex flex-col gap-1">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="py-3 text-lg text-white border-b border-white/15"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="grid grid-cols-2 gap-2 pt-4">
                        <CtaLink href="/partners" variant="light">Partner with us</CtaLink>
                        <CtaLink href="/login" variant="outline-light">Login</CtaLink>
                    </div>
                </div>
            )}
        </header>
    );
}
