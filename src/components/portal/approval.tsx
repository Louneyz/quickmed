"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button, Notice } from "./ui";
import { onboard } from "@/lib/portal/admin-api";
import { supabase } from "@/lib/portal/supabase";
import type { PharmacyStatus } from "@/lib/portal/types";

// Approve (creates the login and emails the invite) or deny a pending partner.
// Big, full-width buttons on phones: admins mostly do this on the go.
export function ApprovalActions({
    pharmacy,
    onChange,
}: {
    pharmacy: { id: string; name: string; email: string; contact_name: string | null };
    onChange: (status: PharmacyStatus) => void;
}) {
    const [busy, setBusy] = useState<"approve" | "deny" | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function approve() {
        setBusy("approve");
        setError(null);
        try {
            await onboard({ pharmacyId: pharmacy.id, email: pharmacy.email, contactName: pharmacy.contact_name ?? "" });
            onChange("active");
        } catch (err) {
            setError((err as Error).message);
        }
        setBusy(null);
    }

    async function deny() {
        if (!window.confirm(`Deny ${pharmacy.name}? They won't get a login. You can still approve them later.`)) return;
        setBusy("deny");
        setError(null);
        const { error } = await supabase().from("pharmacies").update({ status: "denied" }).eq("id", pharmacy.id);
        setBusy(null);
        if (error) setError("Couldn't deny this request. Try again.");
        else onChange("denied");
    }

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-[1fr_auto] gap-2">
                <Button variant="accent" onClick={approve} disabled={busy !== null} className="py-4">
                    <Check className="h-4 w-4" aria-hidden />
                    {busy === "approve" ? "Approving…" : "Approve & send login"}
                </Button>
                <Button variant="outline" onClick={deny} disabled={busy !== null} className="py-4">
                    <X className="h-4 w-4" aria-hidden />
                    {busy === "deny" ? "…" : "Deny"}
                </Button>
            </div>
            {error && <Notice tone="error">{error}</Notice>}
        </div>
    );
}
