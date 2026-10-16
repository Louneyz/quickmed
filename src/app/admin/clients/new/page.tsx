"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Field, Input, Notice, PageHeader, Select, Textarea } from "@/components/portal/ui";
import { onboard } from "@/lib/portal/admin-api";

const provinces = ["ON", "QC", "BC", "AB", "MB", "SK", "NS", "NB", "NL", "PE", "YT", "NT", "NU"];

export default function OnboardClientPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        contactName: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        province: "ON",
        postal_code: "",
        notes: "",
    });
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value }));

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setBusy(true);
        setError(null);
        try {
            const { name, contactName, email, ...rest } = form;
            const { pharmacyId } = await onboard({ pharmacy: { name, ...rest }, contactName, email });
            router.push(`/admin/clients/${pharmacyId}?invited=${encodeURIComponent(email)}`);
        } catch (err) {
            setError((err as Error).message);
            setBusy(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
            <PageHeader eyebrow="New client" title="Onboard a pharmacy" />
            <p className="text-gray -mt-4">
                We&apos;ll email the contact an invite to set their password and log in to the pharmacy portal.
            </p>

            <Card className="p-6 md:p-8">
                <p className="label-mono text-ink mb-6">Pharmacy</p>
                <div className="grid gap-5 md:grid-cols-6">
                    <Field label="Pharmacy name" required className="md:col-span-4">
                        <Input required value={form.name} onChange={set("name")} />
                    </Field>
                    <Field label="Pharmacy phone" className="md:col-span-2">
                        <Input type="tel" value={form.phone} onChange={set("phone")} />
                    </Field>
                    <Field label="Street address" className="md:col-span-6">
                        <Input value={form.street} onChange={set("street")} />
                    </Field>
                    <Field label="City" className="md:col-span-3">
                        <Input value={form.city} onChange={set("city")} />
                    </Field>
                    <Field label="Province" className="md:col-span-1">
                        <Select value={form.province} onChange={set("province")}>
                            {provinces.map((p) => <option key={p}>{p}</option>)}
                        </Select>
                    </Field>
                    <Field label="Postal code" className="md:col-span-2">
                        <Input value={form.postal_code} onChange={set("postal_code")} />
                    </Field>
                </div>
            </Card>

            <Card className="p-6 md:p-8">
                <p className="label-mono text-ink mb-6">Login</p>
                <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Contact name">
                        <Input value={form.contactName} onChange={set("contactName")} />
                    </Field>
                    <Field label="Contact email" required hint="The invite goes here. This becomes their login.">
                        <Input type="email" required value={form.email} onChange={set("email")} />
                    </Field>
                </div>
            </Card>

            <Card className="p-6 md:p-8">
                <Field label="Internal notes" hint="Only QuickMed staff see these.">
                    <Textarea value={form.notes} onChange={set("notes")} />
                </Field>
            </Card>

            {error && <Notice tone="error">{error}</Notice>}

            <div className="flex justify-end">
                <Button type="submit" variant="accent" disabled={busy} className="sm:min-w-56">
                    {busy ? "Sending invite…" : "Create client and send invite"}
                </Button>
            </div>
        </form>
    );
}
