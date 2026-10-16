"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/components/ui/button";
import { signOut, usePortalSession } from "@/lib/portal/session";

type NavItem = { href: string; label: string };

// Shared frame for the pharmacy portal and the admin app: the homepage's floating
// frosted bar on a light surface, with the section links underneath.
export function PortalShell({
    area,
    nav,
    children,
}: {
    area: string;
    nav: NavItem[];
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { profile, pharmacy, session } = usePortalSession();
    const who = pharmacy?.name ?? profile.full_name ?? session.user.email;

    const isActive = (href: string) =>
        href === nav[0].href ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

    return (
        <div className="min-h-screen bg-surface">
            <header className="sticky top-0 z-40 px-4 md:px-8 pt-4 md:pt-6 pb-2 bg-surface/80 backdrop-blur-md">
                <div className="mx-auto max-w-6xl rounded-lg bg-white/90 backdrop-blur-[30px] shadow-[0_4px_24px_rgb(15_23_42/0.08)]">
                    <div className="flex h-16 items-center justify-between gap-4 pl-5 pr-2">
                        <div className="flex items-center gap-4 min-w-0">
                            <Link href={nav[0].href} aria-label={`${area} home`} className="shrink-0">
                                <img src="/images/brand/quickmed-logo-navy.svg" alt="QuickMed" className="h-6 md:h-7 w-auto" />
                            </Link>
                            <span className="hidden sm:inline label-mono text-gray-mid border-l border-hairline pl-4">{area}</span>
                        </div>
                        <div className="flex items-center gap-3 min-w-0">
                            <span className="hidden md:inline text-sm text-gray truncate max-w-[16rem]">{who}</span>
                            <button
                                type="button"
                                onClick={signOut}
                                className="label-mono inline-flex items-center gap-2 rounded-lg bg-ink/5 px-4 py-3.5 text-ink transition-colors hover:bg-ink hover:text-white"
                            >
                                <LogOut className="h-3.5 w-3.5" aria-hidden />
                                Sign out
                            </button>
                        </div>
                    </div>
                    <nav className="flex gap-1 overflow-x-auto border-t border-hairline px-2 py-2" aria-label={area}>
                        {nav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={isActive(item.href) ? "page" : undefined}
                                className={cn(
                                    "whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors",
                                    isActive(item.href) ? "bg-ink text-white" : "text-ink/80 hover:bg-ink/5 hover:text-ink",
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>
            <main className="mx-auto max-w-6xl px-4 md:px-8 py-8 md:py-12">{children}</main>
            <footer className="mx-auto max-w-6xl px-4 md:px-8 pb-10 text-xs text-gray-mid flex flex-wrap gap-x-6 gap-y-2">
                <span>Questions? Call <a href="tel:+14168349123" className="text-ink underline">(416) 834-9123</a></span>
                <span>Patient information is stored in Canada and only visible to your pharmacy and QuickMed.</span>
            </footer>
        </div>
    );
}
