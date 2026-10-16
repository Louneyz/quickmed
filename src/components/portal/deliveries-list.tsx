"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/components/ui/button";
import { Button, Input, Notice, StatusBadge } from "./ui";
import { supabase } from "@/lib/portal/supabase";
import { flagLabel, formatDate, type Delivery, type DeliveryStatus } from "@/lib/portal/types";

const PAGE_SIZE = 50;

type Filter = "pending" | "completed" | "all";

const filters: { value: Filter; label: string }[] = [
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Delivered" },
    { value: "all", label: "All" },
];

// One list for both sides. Pharmacies only ever receive their own rows (the
// database filters them); staff see every pharmacy and can change status.
// Rows load a page at a time, so a long history never slows the page down.
export function DeliveriesList({
    staff = false,
    pharmacyId,
    initialFilter = "pending",
}: {
    staff?: boolean;
    pharmacyId?: string;
    initialFilter?: Filter;
}) {
    const [filter, setFilter] = useState<Filter>(initialFilter);
    const [query, setQuery] = useState("");
    const [search, setSearch] = useState("");
    const [rows, setRows] = useState<Delivery[]>([]);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [savingId, setSavingId] = useState<string | null>(null);

    const fetchPage = useCallback(
        async (offset: number) => {
            // The staff board leaves out the sales demo pharmacy; its client page still shows it.
            const hideDemo = staff && !pharmacyId;
            let q = supabase()
                .from("deliveries")
                .select(`*, delivery_requests(delivery_date, notes), pharmacies${hideDemo ? "!inner" : ""}(name, is_demo)`)
                .order("created_at", { ascending: false })
                .range(offset, offset + PAGE_SIZE - 1);
            if (filter !== "all") q = q.eq("status", filter);
            if (pharmacyId) q = q.eq("pharmacy_id", pharmacyId);
            if (hideDemo) q = q.eq("pharmacies.is_demo", false);
            // Strip characters that have meaning in PostgREST filter syntax.
            const term = search.replace(/[%,()*\\]/g, " ").trim();
            if (term) {
                q = q.or(
                    ["patient_first_name", "patient_last_name", "street", "city", "phone", "postal_code"]
                        .map((col) => `${col}.ilike.*${term}*`)
                        .join(","),
                );
            }
            const { data, error } = await q;
            if (error) throw error;
            return (data ?? []) as Delivery[];
        },
        [filter, search, pharmacyId, staff],
    );

    useEffect(() => {
        let cancelled = false;
        fetchPage(0)
            .then((data) => {
                if (cancelled) return;
                setRows(data);
                setHasMore(data.length === PAGE_SIZE);
            })
            .catch(() => !cancelled && setError("Couldn't load deliveries. Refresh to try again."))
            .finally(() => !cancelled && setLoading(false));
        return () => {
            cancelled = true;
        };
    }, [fetchPage]);

    // Changing what's shown starts a fresh load; the effect below fetches it.
    function show(next: { filter?: Filter; search?: string }) {
        setLoading(true);
        setError(null);
        if (next.filter !== undefined) setFilter(next.filter);
        if (next.search !== undefined) setSearch(next.search);
    }

    async function loadMore() {
        setLoading(true);
        try {
            const data = await fetchPage(rows.length);
            setRows((r) => [...r, ...data]);
            setHasMore(data.length === PAGE_SIZE);
        } catch {
            setError("Couldn't load more deliveries.");
        }
        setLoading(false);
    }

    async function setStatus(row: Delivery, status: DeliveryStatus) {
        setSavingId(row.id);
        const { data, error } = await supabase()
            .from("deliveries")
            .update({ status })
            .eq("id", row.id)
            .select("status, completed_at")
            .single();
        setSavingId(null);
        if (error || !data) {
            setError("Couldn't update that delivery. Try again.");
            return;
        }
        setRows((all) =>
            all
                .map((r) => (r.id === row.id ? { ...r, ...data } : r))
                // Drop it from a filtered view once it no longer matches.
                .filter((r) => filter === "all" || r.status === filter),
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="inline-flex rounded-lg bg-white border border-hairline p-1 self-start" role="tablist">
                    {filters.map((f) => (
                        <button
                            key={f.value}
                            type="button"
                            role="tab"
                            aria-selected={filter === f.value}
                            onClick={() => f.value !== filter && show({ filter: f.value })}
                            className={cn(
                                "label-mono rounded-md px-4 py-2.5 transition-colors",
                                filter === f.value ? "bg-ink text-white" : "text-gray hover:text-ink",
                            )}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
                <form
                    className="relative md:w-80"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (query !== search) show({ search: query });
                    }}
                >
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-mid" aria-hidden />
                    <Input
                        type="search"
                        placeholder="Search patient, street, phone"
                        aria-label="Search deliveries"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            if (!e.target.value && search) show({ search: "" });
                        }}
                        className="pl-11"
                    />
                </form>
            </div>

            {error && <Notice tone="error">{error}</Notice>}

            {!loading && rows.length === 0 && !error && (
                <div className="rounded-lg border border-dashed border-ink/15 bg-white px-6 py-16 text-center">
                    <p className="label-mono text-gray-mid">Nothing here</p>
                    <p className="mt-3 text-ink">
                        {filter === "pending" ? "No deliveries waiting." : "No deliveries match."}
                    </p>
                </div>
            )}

            {rows.length > 0 && (
                <div className="rounded-lg bg-white border border-hairline divide-y divide-hairline overflow-hidden">
                    <div className="hidden lg:grid grid-cols-12 gap-4 px-5 py-3 label-mono text-gray-mid bg-surface/60">
                        <span className="col-span-3">Patient</span>
                        <span className="col-span-3">Address</span>
                        <span className="col-span-2">{staff ? "Pharmacy" : "Delivery date"}</span>
                        <span className="col-span-2">Status</span>
                        <span className="col-span-2 text-right">{staff ? "Action" : "Sent"}</span>
                    </div>
                    {rows.map((row) => (
                        <DeliveryRow
                            key={row.id}
                            row={row}
                            staff={staff}
                            saving={savingId === row.id}
                            onStatus={(s) => setStatus(row, s)}
                        />
                    ))}
                </div>
            )}

            {loading && <p className="label-mono text-gray-mid py-4" role="status">Loading…</p>}

            {hasMore && !loading && (
                <div className="flex justify-center pt-2">
                    <Button variant="outline" onClick={loadMore}>Load more</Button>
                </div>
            )}
        </div>
    );
}

function DeliveryRow({
    row,
    staff,
    saving,
    onStatus,
}: {
    row: Delivery;
    staff: boolean;
    saving: boolean;
    onStatus: (status: DeliveryStatus) => void;
}) {
    const name = row.redacted_at
        ? "Details removed (retention)"
        : `${row.patient_first_name ?? ""} ${row.patient_last_name ?? ""}`.trim();
    const address = row.redacted_at
        ? row.city ?? ""
        : [row.street, row.street2, row.city, row.postal_code].filter(Boolean).join(", ");

    return (
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-x-4 gap-y-2 px-5 py-4 items-start md:items-center">
            <div className="md:col-span-3 lg:col-span-3 min-w-0">
                <p className={cn("text-ink", row.redacted_at && "text-gray-mid italic")}>{name}</p>
                {!row.redacted_at && row.phone && (
                    <a href={`tel:${row.phone}`} className="text-sm text-gray hover:text-ink">{row.phone}</a>
                )}
                {row.flags.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                        {row.flags.map((f) => (
                            <span key={f} className="rounded bg-brand-soft px-1.5 py-0.5 text-[11px] font-medium text-ink">
                                {flagLabel(f)}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <p className="md:col-span-3 lg:col-span-3 text-sm text-gray">{address}</p>
            <div className="md:col-span-2 lg:col-span-2 text-sm">
                {staff ? (
                    <Link href={`/admin/clients/${row.pharmacy_id}`} className="text-ink hover:underline">
                        {row.pharmacies?.name}
                    </Link>
                ) : (
                    <span className="text-gray">{formatDate(row.delivery_requests?.delivery_date ?? null)}</span>
                )}
                {staff && row.delivery_requests?.delivery_date && (
                    <p className="text-gray-mid">For {formatDate(row.delivery_requests.delivery_date)}</p>
                )}
            </div>
            <div className="md:col-span-2 lg:col-span-2">
                <StatusBadge status={row.status} />
                {row.completed_at && <p className="mt-1 text-xs text-gray-mid">{formatDate(row.completed_at, true)}</p>}
            </div>
            <div className="md:col-span-2 lg:col-span-2 md:text-right">
                {staff ? (
                    row.status === "pending" ? (
                        <Button variant="accent" className="px-4 py-3" disabled={saving} onClick={() => onStatus("completed")}>
                            {saving ? "Saving…" : "Mark complete"}
                        </Button>
                    ) : (
                        <button
                            type="button"
                            disabled={saving}
                            onClick={() => onStatus("pending")}
                            className="label-mono text-gray-mid hover:text-ink underline underline-offset-4"
                        >
                            {saving ? "Saving…" : "Undo"}
                        </button>
                    )
                ) : (
                    <span className="text-sm text-gray-mid">{formatDate(row.created_at, true)}</span>
                )}
            </div>
            {row.delivery_requests?.notes && (
                <p className="md:col-span-6 lg:col-span-12 text-sm text-gray bg-surface rounded-md px-3 py-2">
                    <span className="label-mono text-gray-mid mr-2">Note</span>
                    {row.delivery_requests.notes}
                </p>
            )}
        </div>
    );
}
