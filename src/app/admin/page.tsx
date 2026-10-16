"use client";

import { useEffect, useState } from "react";
import { DeliveriesList } from "@/components/portal/deliveries-list";
import { PageHeader, Stat } from "@/components/portal/ui";
import { supabase } from "@/lib/portal/supabase";

function startOfToday() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
}

export default function AdminDeliveriesPage() {
    const [counts, setCounts] = useState<{ pending: number; today: number; clients: number } | null>(null);

    useEffect(() => {
        const db = supabase();
        // Head-only count queries: no rows are downloaded, however large the history gets.
        Promise.all([
            db.from("deliveries").select("id", { count: "exact", head: true }).eq("status", "pending"),
            db.from("deliveries").select("id", { count: "exact", head: true }).eq("status", "completed").gte("completed_at", startOfToday()),
            db.from("pharmacies").select("id", { count: "exact", head: true }).eq("status", "active"),
        ]).then(([pending, today, clients]) =>
            setCounts({ pending: pending.count ?? 0, today: today.count ?? 0, clients: clients.count ?? 0 }),
        );
    }, []);

    return (
        <>
            <PageHeader eyebrow="Operations" title="Deliveries" />
            <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
                <Stat label="Waiting" value={counts?.pending ?? "–"} />
                <Stat label="Delivered today" value={counts?.today ?? "–"} />
                <Stat label="Active clients" value={counts?.clients ?? "–"} />
            </div>
            <DeliveriesList staff />
        </>
    );
}
