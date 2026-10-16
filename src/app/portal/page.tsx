"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { Button, Card, Field, Input, Notice, PageHeader, Select, Textarea } from "@/components/portal/ui";
import { usePortalSession } from "@/lib/portal/session";
import { supabase } from "@/lib/portal/supabase";
import { deliveryFlags } from "@/lib/portal/types";

type Stop = {
    key: number;
    first_name: string;
    last_name: string;
    phone: string;
    street: string;
    street2: string;
    city: string;
    province: string;
    postal_code: string;
    flags: string[];
};

const provinces = ["ON", "QC", "BC", "AB", "MB", "SK", "NS", "NB", "NL", "PE", "YT", "NT", "NU"];

let nextKey = 1;
const emptyStop = (): Stop => ({
    key: nextKey++,
    first_name: "",
    last_name: "",
    phone: "",
    street: "",
    street2: "",
    city: "",
    province: "ON",
    postal_code: "",
    flags: [],
});

function today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Replaces the old Jotform: same fields, but one block per patient that the
// pharmacy adds as needed, and the pharmacy's own details come from their login.
export default function RequestDeliveryPage() {
    const { pharmacy, session } = usePortalSession();
    const [deliveryDate, setDeliveryDate] = useState(today());
    const [stops, setStops] = useState<Stop[]>([emptyStop()]);
    const [notes, setNotes] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState<number | null>(null);

    const update = (key: number, patch: Partial<Stop>) =>
        setStops((all) => all.map((s) => (s.key === key ? { ...s, ...patch } : s)));

    const toggleFlag = (stop: Stop, flag: string) =>
        update(stop.key, {
            flags: stop.flags.includes(flag) ? stop.flags.filter((f) => f !== flag) : [...stop.flags, flag],
        });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setBusy(true);
        setError(null);
        const { error } = await supabase().rpc("submit_delivery_request", {
            p_delivery_date: deliveryDate || null,
            p_notes: notes,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            p_stops: stops.map(({ key, ...stop }) => stop),
        });
        setBusy(false);
        if (error) {
            setError(error.message || "Something went wrong. Please try again or call us.");
            return;
        }
        setSent(stops.length);
        setStops([emptyStop()]);
        setNotes("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (sent !== null) {
        return (
            <div className="max-w-2xl">
                <PageHeader eyebrow="Request sent" title="We're on it." />
                <Notice tone="success">
                    {sent === 1 ? "1 delivery" : `${sent} deliveries`} sent to QuickMed. Our team will schedule a driver
                    to pick up from your pharmacy.
                </Notice>
                <div className="mt-8 flex flex-wrap gap-3">
                    <Button onClick={() => setSent(null)}>Send another request</Button>
                    <Link
                        href="/portal/deliveries"
                        className="label-mono inline-flex items-center rounded-lg border border-ink/20 px-5 py-3.5 text-ink hover:bg-ink hover:text-white transition-colors"
                    >
                        View my deliveries
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PageHeader eyebrow="New request" title="Request a delivery" />

            <Card className="p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-3">
                    <Field label="Pharmacy">
                        <Input value={pharmacy?.name ?? ""} readOnly className="bg-surface" />
                    </Field>
                    <Field label="Email">
                        <Input value={session.user.email ?? ""} readOnly className="bg-surface" />
                    </Field>
                    <Field label="Delivery date">
                        <Input type="date" value={deliveryDate} min={today()} onChange={(e) => setDeliveryDate(e.target.value)} />
                    </Field>
                </div>
            </Card>

            {stops.map((stop, index) => (
                <Card key={stop.key} className="p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <p className="label-mono text-ink">
                            <span className="text-gray-mid">Stop {String(index + 1).padStart(2, "0")}</span> · Patient
                        </p>
                        {stops.length > 1 && (
                            <button
                                type="button"
                                onClick={() => setStops((all) => all.filter((s) => s.key !== stop.key))}
                                className="label-mono inline-flex items-center gap-1.5 text-gray-mid hover:text-red-700"
                            >
                                <Trash2 className="h-3.5 w-3.5" aria-hidden /> Remove
                            </button>
                        )}
                    </div>

                    <div className="grid gap-5 md:grid-cols-6">
                        <Field label="First name" required className="md:col-span-2">
                            <Input required autoComplete="off" value={stop.first_name} onChange={(e) => update(stop.key, { first_name: e.target.value })} />
                        </Field>
                        <Field label="Last name" required className="md:col-span-2">
                            <Input required autoComplete="off" value={stop.last_name} onChange={(e) => update(stop.key, { last_name: e.target.value })} />
                        </Field>
                        <Field label="Patient phone" required className="md:col-span-2">
                            <Input required type="tel" autoComplete="off" placeholder="(416) 555-0123" value={stop.phone} onChange={(e) => update(stop.key, { phone: e.target.value })} />
                        </Field>
                        <Field label="Street address" required className="md:col-span-4">
                            <Input required autoComplete="off" value={stop.street} onChange={(e) => update(stop.key, { street: e.target.value })} />
                        </Field>
                        <Field label="Unit / line 2" className="md:col-span-2">
                            <Input autoComplete="off" value={stop.street2} onChange={(e) => update(stop.key, { street2: e.target.value })} />
                        </Field>
                        <Field label="City" required className="md:col-span-3">
                            <Input required autoComplete="off" value={stop.city} onChange={(e) => update(stop.key, { city: e.target.value })} />
                        </Field>
                        <Field label="Province" className="md:col-span-1">
                            <Select value={stop.province} onChange={(e) => update(stop.key, { province: e.target.value })}>
                                {provinces.map((p) => <option key={p}>{p}</option>)}
                            </Select>
                        </Field>
                        <Field label="Postal code" className="md:col-span-2">
                            <Input autoComplete="off" placeholder="M5V 1A1" value={stop.postal_code} onChange={(e) => update(stop.key, { postal_code: e.target.value })} />
                        </Field>
                    </div>

                    <fieldset className="mt-6">
                        <legend className="label-mono text-gray mb-3">Special delivery (if applicable)</legend>
                        <div className="flex flex-wrap gap-2">
                            {deliveryFlags.map((flag) => {
                                const on = stop.flags.includes(flag.value);
                                return (
                                    <label
                                        key={flag.value}
                                        className={`cursor-pointer select-none rounded-lg border px-3.5 py-2.5 text-sm transition-colors ${on ? "border-ink bg-ink text-white" : "border-hairline bg-white text-ink hover:border-ink/40"}`}
                                    >
                                        <input type="checkbox" className="sr-only" checked={on} onChange={() => toggleFlag(stop, flag.value)} />
                                        {flag.label}
                                    </label>
                                );
                            })}
                        </div>
                    </fieldset>
                </Card>
            ))}

            <button
                type="button"
                onClick={() => setStops((all) => [...all, emptyStop()])}
                className="w-full rounded-lg border-2 border-dashed border-ink/15 py-5 label-mono text-ink hover:border-accent hover:bg-brand-soft transition-colors inline-flex items-center justify-center gap-2"
            >
                <Plus className="h-4 w-4" aria-hidden /> Add another patient
            </button>

            <Card className="p-6 md:p-8">
                <Field label="Special requests / notes" hint="Pickup time, access instructions, anything our driver should know.">
                    <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
                </Field>
            </Card>

            {error && <Notice tone="error">{error}</Notice>}

            <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-mid max-w-md">
                    Only your pharmacy and QuickMed can see these details. They&apos;re stored in Canada.
                </p>
                <Button type="submit" variant="accent" disabled={busy} className="sm:min-w-56">
                    {busy ? "Sending…" : `Send ${stops.length === 1 ? "delivery" : `${stops.length} deliveries`}`}
                </Button>
            </div>
        </form>
    );
}
