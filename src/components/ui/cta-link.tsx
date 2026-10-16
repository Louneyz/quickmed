import Link from "next/link";
import { cn } from "./button";

type Variant = "accent" | "light" | "ghost" | "outline-light";

const variants: Record<Variant, string> = {
    accent: "bg-accent text-ink hover:text-white [--cta-hover:var(--ink)]",
    light: "bg-white text-ink hover:text-white [--cta-hover:var(--ink)]",
    ghost: "bg-ink/5 text-ink hover:text-accent [--cta-hover:var(--ink)]",
    "outline-light": "border border-white/40 text-white hover:text-ink [--cta-hover:#ffffff]",
};

export function CtaLink({
    href,
    variant = "accent",
    className,
    children,
}: {
    href: string;
    variant?: Variant;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className={cn(
                "cta label-mono inline-flex items-center justify-center rounded-lg px-6 py-4 transition-colors duration-300",
                variants[variant],
                className,
            )}
        >
            {children}
        </Link>
    );
}
