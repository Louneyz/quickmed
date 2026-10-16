"use client";

import { DeliveriesList } from "@/components/portal/deliveries-list";
import { PageHeader } from "@/components/portal/ui";

export default function MyDeliveriesPage() {
    return (
        <>
            <PageHeader eyebrow="Your pharmacy" title="My deliveries" />
            <DeliveriesList initialFilter="all" />
        </>
    );
}
