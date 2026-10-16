import { cn } from "@/components/ui/button";
import type { DeliveryStatus } from "@/lib/portal/types";

// Form and layout pieces for the portal, in the homepage's language:
// mono uppercase labels, light tracked headlines, 8px radius, navy on white/blue.

type ButtonVariant = "ink" | "accent" | "ghost" | "outline";

const buttonVariants: Record<ButtonVariant, string> = {
    ink: "bg-ink text-white hover:text-ink [--cta-hover:var(--brand)]",
    accent: "bg-accent text-ink hover:text-white [--cta-hover:var(--ink)]",
    ghost: "bg-ink/5 text-ink hover:text-white [--cta-hover:var(--ink)]",
    outline: "border border-ink/20 text-ink hover:text-white [--cta-hover:var(--ink)]",
};

export function Button({
    variant = "ink",
    className,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
    return (
        <button
            type="button"
            {...props}
            className={cn(
                "cta label-mono inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3.5 transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                buttonVariants[variant],
                className,
            )}
        />
    );
}

export function Field({
    label,
    hint,
    required,
    className,
    children,
}: {
    label: string;
    hint?: string;
    required?: boolean;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <label className={cn("flex flex-col gap-2", className)}>
            <span className="label-mono text-gray">
                {label}
                {required && <span className="text-accent"> *</span>}
            </span>
            {children}
            {hint && <span className="text-xs text-gray-mid">{hint}</span>}
        </label>
    );
}

const inputClass =
    "w-full rounded-lg border border-hairline bg-white px-4 py-3 text-ink placeholder:text-gray-mid/70 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return <input {...props} className={cn(inputClass, props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <textarea rows={3} {...props} className={cn(inputClass, "resize-y", props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={cn(inputClass, "appearance-none pr-10", props.className)} />;
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn("rounded-lg bg-white border border-hairline", className)}>{children}</div>
    );
}

export function PageHeader({
    eyebrow,
    title,
    children,
}: {
    eyebrow: string;
    title: string;
    children?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
            <div>
                <p className="label-mono text-gray-mid">{eyebrow}</p>
                <h1 className="title-md text-ink mt-3">{title}</h1>
            </div>
            {children}
        </div>
    );
}

const statusStyles: Record<DeliveryStatus, string> = {
    pending: "bg-brand-soft text-ink",
    completed: "bg-ink text-white",
    cancelled: "bg-surface text-gray-mid line-through",
};

const statusLabels: Record<DeliveryStatus, string> = {
    pending: "Pending",
    completed: "Delivered",
    cancelled: "Cancelled",
};

export function StatusBadge({ status }: { status: DeliveryStatus }) {
    return (
        <span className={cn("label-mono inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 whitespace-nowrap", statusStyles[status])}>
            {status === "pending" && <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />}
            {statusLabels[status]}
        </span>
    );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "error" | "success"; children: React.ReactNode }) {
    return (
        <div
            role={tone === "error" ? "alert" : "status"}
            className={cn(
                "rounded-lg px-4 py-3 text-sm",
                tone === "error" && "bg-red-50 text-red-800 border border-red-200",
                tone === "success" && "bg-brand-soft text-ink border border-accent/40",
                tone === "info" && "bg-surface text-gray border border-hairline",
            )}
        >
            {children}
        </div>
    );
}

export function Stat({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="rounded-lg bg-white border border-hairline p-5">
            <p className="label-mono text-gray-mid">{label}</p>
            <p className="mt-3 text-3xl tracking-tight text-ink tabular-nums">{value}</p>
        </div>
    );
}
