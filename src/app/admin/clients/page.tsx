"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { cn } from "@/components/ui/button";
import { Input, Notice, PageHeader } from "@/components/portal/ui";
import { supabase } from "@/lib/portal/supabase";
import { formatDate, type PharmacyStats } from "@/lib/portal/types";

type SortKey = "name" | "request_count" | "delivery_count" | "completed_count" | "pending_count" | "last_request_at";

const columns: { key: SortKey; label: string; className?: string }[] = [
    { key: "name", label: "Client", className: "col-span-4" },
    { key: "request_count", label: "Requests", className: "col-span-1 text-right" },
    { key: "delivery_count", label: "Stops", className: "col-span-1 text-right" },
    { key: "completed_count", label: "Done", className: "col-span-1 text-right" },
    { key: "pending_count", label: "Pending", className: "col-span-2 text-right" },
    { key: "last_request_at", label: "Last request", className: "col-span-3 text-right" },
];

// Mini CRM: one row per client pharmacy with its request and completion counts.
export default function ClientsPage() {
    const [rows, setRows] = useState<PharmacyStats[] | null>(null);
    const [error, setError] = useState(false);
    const [query, setQuery] = useState("");
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

    const visible = useMemo(() => {
        const term = query.trim().toLowerCase();
        const filtered = (rows ?? []).filter(
            (r) => !term || [r.name, r.contact_name, r.email, r.phone].some((v) => v?.toLowerCase().includes(term)),
        );
        return [...filtered].sort((a, b) => {
            const av = a[sort.key] ?? "";
            const bv = b[sort.key] ?? "";
            const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
            return sort.desc ? -cmp : cmp;
        });
    }, [rows, query, sort]);

    const totals = useMemo(
        () =>
            (rows ?? []).reduce(
                (t, r) => ({ requests: t.requests + r.request_count, completed: t.completed + r.completed_count }),
                { requests: 0, completed: 0 },
            ),
        [rows],
    );

    return (
        <>
            <PageHeader eyebrow="Mini CRM" title="Clients">
                <Link
                    href="/admin/clients/new"
                    className="cta label-mono inline-flex items-center gap-2 self-start rounded-lg bg-ink px-5 py-3.5 text-white hover:text-ink transition-colors [--cta-hover:var(--brand)]"
                >
                    <Plus className="h-4 w-4" aria-hidden /> Onboard a client
                </Link>
            </PageHeader>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
                <p className="text-sm text-gray">
                    {rows ? `${rows.length} clients · ${totals.requests} requests · ${totals.completed} deliveries completed` : " "}
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

            {error && <Notice tone="error">Couldn&apos;t load clients. Refresh to try again.</Notice>}
            {!rows && !error && <p className="label-mono text-gray-mid py-4" role="status">Loading…</p>}

            {rows && rows.length === 0 && (
                <div className="rounded-lg border border-dashed border-ink/15 bg-white px-6 py-16 text-center">
                    <p className="label-mono text-gray-mid">No clients yet</p>
                    <p className="mt-3 text-ink">Onboard your first pharmacy to send them a login.</p>
                </div>
            )}

            {visible.length > 0 && (
                <div className="rounded-lg bg-white border border-hairline overflow-hidden">
                    <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-surface/60">
                        {columns.map((c) => (
                            <button
                                key={c.key}
                                type="button"
                                onClick={() => setSort((s) => ({ key: c.key, desc: s.key === c.key ? !s.desc : c.key !== "name" }))}
                                className={cn("label-mono text-gray-mid hover:text-ink", c.className)}
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
                                    className="grid grid-cols-2 md:grid-cols-12 gap-x-4 gap-y-1 px-5 py-4 items-center hover:bg-brand-soft/50 transition-colors"
                                >
                                    <div className="col-span-2 md:col-span-4 min-w-0">
                                        <p className="text-ink truncate">
                                            {r.name}
                                            {r.status === "paused" && <span className="ml-2 label-mono text-gray-mid">Paused</span>}
                                        </p>
                                        <p className="text-sm text-gray truncate">{r.contact_name ?? r.email}</p>
                                    </div>
                                    <Num label="Requests" value={r.request_count} className="md:col-span-1" />
                                    <Num label="Stops" value={r.delivery_count} className="md:col-span-1" />
                                    <Num label="Done" value={r.completed_count} className="md:col-span-1" />
                                    <Num label="Pending" value={r.pending_count} className="md:col-span-2" highlight={r.pending_count > 0} />
                                    <p className="col-span-2 md:col-span-3 text-sm text-gray md:text-right">
                                        <span className="md:hidden label-mono text-gray-mid mr-2">Last request</span>
                                        {formatDate(r.last_request_at)}
                                    </p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}

function Num({ label, value, className, highlight }: { label: string; value: number; className?: string; highlight?: boolean }) {
    return (
        <p className={cn("text-sm md:text-right tabular-nums", className)}>
            <span className="md:hidden label-mono text-gray-mid mr-2">{label}</span>
            <span className={cn("text-ink", highlight && "rounded bg-brand-soft px-1.5 py-0.5")}>{value}</span>
        </p>
    );
}
