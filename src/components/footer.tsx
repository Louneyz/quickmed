import Link from "next/link";

const columns = [
    {
        heading: "Services",
        links: [
            { href: "/", label: "Home" },
            { href: "/partners", label: "Become A Partner" },
            { href: "/drivers", label: "Become A Driver" },
        ],
    },
];

export function Footer() {
    return (
        <footer className="bg-ink text-white mt-20 md:mt-28">
            <div className="mx-auto max-w-6xl px-5 md:px-8 pt-20 md:pt-28 pb-10">
                <p className="title-lg max-w-3xl mb-16 md:mb-24">
                    Medication, delivered<span className="text-accent">.</span>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                    <div className="md:col-span-4 space-y-4">
                        <img src="/images/brand/quickmed-logo-white.svg" alt="QuickMed" className="h-7 w-auto" />
                        <p className="text-white/60 max-w-xs">
                            Fast and reliable pharmaceutical delivery services for pharmacies and patients.
                        </p>
                    </div>
                    {columns.map((column) => (
                        <div key={column.heading} className="md:col-span-3">
                            <h4 className="label-mono text-white/60 mb-5">{column.heading}</h4>
                            <ul className="space-y-2 text-lg">
                                {column.links.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="hover:text-accent transition-colors">{link.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <div className="md:col-span-3">
                        <h4 className="label-mono text-white/60 mb-5">Customer support</h4>
                        <a href="tel:+14168349123" className="text-lg hover:text-accent transition-colors">(416) 834-9123</a>
                    </div>
                </div>

                <div className="mt-16 pt-6 border-t border-white/10 text-sm text-white/40">
                    © {new Date().getFullYear()} QuickMed. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
