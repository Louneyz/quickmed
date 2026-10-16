"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Mail, Phone, Plus, Search } from "lucide-react";
import { cn } from "@/components/ui/button";
import { ApprovalActions } from "@/components/portal/approval";
import { Input, Notice, PageHeader } from "@/components/portal/ui";
import { supabase } from "@/lib/portal/supabase";
import { daysSince, formatDate, timeAgo, type PharmacyStats, type PharmacyStatus } from "@/lib/portal/types";

type SortKey = "name" | "request_count" | "delivery_count" | "completed_count" | "pending_count" | "last_request_at" | "last_delivery_at";

const columns: { key: SortKey; label: string; className?: string }[] = [
    { key: "name", label: "Client", className: "col-span-3" },
    { key: "request_count", label: "Requests", className: "col-span-1 text-right" },
    { key: "delivery_count", label: "Stops", className: "col-span-1 text-right" },
    { key: "completed_count", label: "Done", className: "col-span-1 text-right" },
    { key: "pending_count", label: "Pending", className: "col-span-1 text-right" },
    { key: "last_request_at", label: "Last request", className: "col-span-2 text-right" },
    { key: "last_delivery_at", label: "Last delivery", className: "col-span-3 text-right" },
];

// A client counts as active if a delivery was completed in the last 14 days.
const ACTIVE_DAYS = 14;

// Mini CRM: pending partner requests to approve, then one row per client with
// its request and completion counts and when it last had a delivery.
export default function ClientsPage() {
    const [rows, setRows] = useState<PharmacyStats[] | null>(null);
    const [error, setError] = useState(false);
    const [query, setQuery] = useState("");
    const [showDenied, setShowDenied] = useState(false);
    const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: "last_request_at", desc: true });

    useEffect(() => {
        supabase()
            .from("pharmacy_stats")
            .select("*")
            .then(({ data, error }) => {
                if (error) setError(true);
                else setRows((data ?? []) as PharmacyStats[]);
            });
    }, []);

    const setStatus = (id: string, status: PharmacyStatus) =>
        setRows((all) => all?.map((r) => (r.pharmacy_id === id ? { ...r, status } : r)) ?? null);

    const pending = useMemo(
        () => (rows ?? []).filter((r) => r.status === "pending").sort((a, b) => a.created_at.localeCompare(b.created_at)),
        [rows],
    );
    const denied = (rows ?? []).filter((r) => r.status === "denied").length;

    const visible = useMemo(() => {
        const term = query.trim().toLowerCase();
        const filtered = (rows ?? []).filter(
            (r) =>
                r.status !== "pending" &&
                (showDenied || r.status !== "denied") &&
                (!term || [r.name, r.contact_name, r.email, r.phone].some((v) => v?.toLowerCase().includes(term))),
        );
        return [...filtered].sort((a, b) => {
            const av = a[sort.key] ?? "";
            const bv = b[sort.key] ?? "";
            const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
            return sort.desc ? -cmp : cmp;
        });
    }, [rows, query, sort, showDenied]);

    const clients = (rows ?? []).filter((r) => r.status === "active" || r.status === "paused");
    const activeCount = clients.filter((r) => daysSince(r.last_delivery_at) <= ACTIVE_DAYS).length;

    return (
        <>
            <PageHeader eyebrow="Mini CRM" title="Clients">
                <Link
                    href="/admin/clients/new"
                    className="cta label-mono inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-5 py-4 text-white hover:text-ink transition-colors [--cta-hover:var(--brand)] w-full md:w-auto"
                >
                    <Plus className="h-4 w-4" aria-hidden /> Onboard a client
                </Link>
            </PageHeader>

            {error && <Notice tone="error">Couldn&apos;t load clients. Refresh to try again.</Notice>}
            {!rows && !error && <p className="label-mono text-gray-mid py-4" role="status">Loading…</p>}

            {pending.length > 0 && (
                <section className="mb-12" aria-labelledby="pending-title">
                    <h2 id="pending-title" className="label-mono text-ink mb-4 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
                        Pending partners · {pending.length}
                    </h2>
                    <ul className="grid gap-3 lg:grid-cols-2">
                        {pending.map((p) => (
                            <li key={p.pharmacy_id} className="rounded-lg bg-white border border-accent/50 p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <Link href={`/admin/clients/${p.pharmacy_id}`} className="text-lg text-ink hover:underline">
                                            {p.name}
                                        </Link>
                                        <p className="text-sm text-gray">{p.contact_name}</p>
                                    </div>
                                    <span className="label-mono shrink-0 text-gray-mid">{timeAgo(p.created_at)}</span>
                                </div>
                                <div className="mt-3 space-y-1.5 text-sm">
                                    {p.phone && (
                                        <a href={`tel:${p.phone}`} className="flex items-center gap-2 text-ink">
                                            <Phone className="h-4 w-4 text-gray-mid" aria-hidden /> {p.phone}
                                        </a>
                                    )}
                                    <a href={`mailto:${p.email}`} className="flex items-center gap-2 text-ink break-all">
                                        <Mail className="h-4 w-4 shrink-0 text-gray-mid" aria-hidden /> {p.email}
                                    </a>
                                    {(p.street || p.city) && (
                                        <p className="text-gray">{[p.street, p.city].filter(Boolean).join(", ")}</p>
                                    )}
                                </div>
                                <div className="mt-5">
                                    <ApprovalActions
                                        pharmacy={{ id: p.pharmacy_id, name: p.name, email: p.email, contact_name: p.contact_name }}
                                        onChange={(s) => setStatus(p.pharmacy_id, s)}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {rows && (
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
                    <p className="text-sm text-gray">
                        {clients.length} clients · <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" aria-hidden />{activeCount} delivered in the last {ACTIVE_DAYS} days</span>
                        {denied > 0 && (
                            <>
                                {" · "}
                                <button type="button" className="underline underline-offset-4 hover:text-ink" onClick={() => setShowDenied(!showDenied)}>
                                    {showDenied ? "Hide" : "Show"} {denied} denied
                                </button>
                            </>
                        )}
                    </p>
                    <div className="relative md:w-80">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-mid" aria-hidden />
                        <Input
                            type="search"
                            placeholder="Search clients"
                            aria-label="Search clients"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="pl-11"
                        />
                    </div>
                </div>
            )}

            {rows && visible.length === 0 && pending.length === 0 && (
                <div className="rounded-lg border border-dashed border-ink/15 bg-white px-6 py-16 text-center">
                    <p className="label-mono text-gray-mid">No clients yet</p>
                    <p className="mt-3 text-ink">Onboard your first pharmacy to send them a login.</p>
                </div>
            )}

            {visible.length > 0 && (
                <div className="rounded-lg bg-white border border-hairline overflow-hidden">
                    <div className="hidden lg:grid grid-cols-12 gap-4 px-5 py-3 bg-surface/60">
                        {columns.map((c) => (
                            <button
                                key={c.key}
                                type="button"
                                onClick={() => setSort((s) => ({ key: c.key, desc: s.key === c.key ? !s.desc : c.key !== "name" }))}
                                className={cn("label-mono text-left text-gray-mid hover:text-ink", c.className)}
                                aria-sort={sort.key === c.key ? (sort.desc ? "descending" : "ascending") : undefined}
                            >
                                {c.label}
                                {sort.key === c.key && (sort.desc ? " ↓" : " ↑")}
                            </button>
                        ))}
                    </div>
                    <ul className="divide-y divide-hairline">
                        {visible.map((r) => (
                            <li key={r.pharmacy_id}>
                                <Link
                                    href={`/admin/clients/${r.pharmacy_id}`}
                                    className="grid grid-cols-2 lg:grid-cols-12 gap-x-4 gap-y-1.5 px-5 py-4 items-center hover:bg-brand-soft/50 transition-colors"
                                >
                                    <div className="col-span-2 lg:col-span-3 min-w-0">
                                        <p className="text-ink truncate">
                                            {r.name}
                                            {r.is_demo && <span className="ml-2 label-mono rounded bg-brand-soft px-1.5 py-0.5 text-ink">Demo</span>}
                                            {r.status === "paused" && <span className="ml-2 label-mono text-gray-mid">Paused</span>}
                                            {r.status === "denied" && <span className="ml-2 label-mono text-gray-mid">Denied</span>}
                                        </p>
                                        <p className="text-sm text-gray truncate">{r.contact_name ?? r.email}</p>
                                    </div>
                                    <Num label="Requests" value={r.request_count} className="lg:col-span-1" />
                                    <Num label="Stops" value={r.delivery_count} className="lg:col-span-1" />
                                    <Num label="Done" value={r.completed_count} className="lg:col-span-1" />
                                    <Num label="Pending" value={r.pending_count} className="lg:col-span-1" highlight={r.pending_count > 0} />
                                    <p className="col-span-2 lg:col-span-2 text-sm text-gray lg:text-right">
                                        <span className="lg:hidden label-mono text-gray-mid mr-2">Last request</span>
                                        {formatDate(r.last_request_at)}
                                    </p>
                                    <LastDelivery value={r.last_delivery_at} />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}

function LastDelivery({ value }: { value: string | null }) {
    const days = daysSince(value);
    return (
        <p className="col-span-2 lg:col-span-3 text-sm lg:text-right flex items-center gap-2 lg:justify-end">
            <span className="lg:hidden label-mono text-gray-mid">Last delivery</span>
            <span
                className={cn("h-2 w-2 rounded-full shrink-0", days <= ACTIVE_DAYS ? "bg-accent" : days <= 60 ? "bg-gray-light" : "bg-transparent border border-gray-light")}
                aria-hidden
            />
            <span className={days <= ACTIVE_DAYS ? "text-ink" : "text-gray-mid"}>
                {value ? `${formatDate(value)} · ${timeAgo(value)}` : "Never"}
            </span>
        </p>
    );
}

function Num({ label, value, className, highlight }: { label: string; value: number; className?: string; highlight?: boolean }) {
    return (
        <p className={cn("text-sm lg:text-right tabular-nums", className)}>
            <span className="lg:hidden label-mono text-gray-mid mr-2">{label}</span>
            <span className={cn("text-ink", highlight && "rounded bg-brand-soft px-1.5 py-0.5")}>{value}</span>
        </p>
    );
}
