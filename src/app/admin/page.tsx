"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DeliveriesList } from "@/components/portal/deliveries-list";
import { PageHeader, Stat } from "@/components/portal/ui";
import { supabase } from "@/lib/portal/supabase";

function startOfToday() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
}

export default function AdminDeliveriesPage() {
    const [counts, setCounts] = useState<{ pending: number; today: number; clients: number; partners: number } | null>(null);

    useEffect(() => {
        const db = supabase();
        // Head-only count queries: no rows are downloaded, however large the history gets.
        // Counts leave out the sales demo pharmacy.
        const deliveries = () =>
            db.from("deliveries").select("id, pharmacies!inner(is_demo)", { count: "exact", head: true }).eq("pharmacies.is_demo", false);
        Promise.all([
            deliveries().eq("status", "pending"),
            deliveries().eq("status", "completed").gte("completed_at", startOfToday()),
            db.from("pharmacies").select("id", { count: "exact", head: true }).eq("status", "active").eq("is_demo", false),
            db.from("pharmacies").select("id", { count: "exact", head: true }).eq("status", "pending"),
        ]).then(([pending, today, clients, partners]) =>
            setCounts({ pending: pending.count ?? 0, today: today.count ?? 0, clients: clients.count ?? 0, partners: partners.count ?? 0 }),
        );
    }, []);

    return (
        <>
            <PageHeader eyebrow="Operations" title="Deliveries" />
            {counts && counts.partners > 0 && (
                <Link
                    href="/admin/clients"
                    className="mb-6 flex items-center justify-between gap-4 rounded-lg bg-ink px-5 py-4 text-white hover:bg-ink-soft transition-colors"
                >
                    <span className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
                        {counts.partners === 1 ? "1 pharmacy is" : `${counts.partners} pharmacies are`} waiting for partner approval
                    </span>
                    <span className="label-mono inline-flex items-center gap-1.5 text-accent shrink-0">
                        Review <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </span>
                </Link>
            )}
            <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
                <Stat label="Waiting" value={counts?.pending ?? "–"} />
                <Stat label="Delivered today" value={counts?.today ?? "–"} />
                <Stat label="Active clients" value={counts?.clients ?? "–"} />
            </div>
            <DeliveriesList staff />
        </>
    );
}
