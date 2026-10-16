"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ApprovalActions } from "@/components/portal/approval";
import { DeliveriesList } from "@/components/portal/deliveries-list";
import { Button, Card, Field, Input, Notice, PageHeader, Select, Stat, Textarea } from "@/components/portal/ui";
import { onboard } from "@/lib/portal/admin-api";
import { supabase } from "@/lib/portal/supabase";
import { formatDate, timeAgo, type Pharmacy, type PharmacyStats, type Profile } from "@/lib/portal/types";

type Login = Pick<Profile, "id" | "full_name"> & { email: string | null; created_at: string };

export default function ClientPage() {
    const { id } = useParams<{ id: string }>();
    const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
    const [stats, setStats] = useState<PharmacyStats | null>(null);
    const [logins, setLogins] = useState<Login[]>([]);
    const [missing, setMissing] = useState(false);
    const [invited, setInvited] = useState<string | null>(null);

    useEffect(() => {
        setInvited(new URLSearchParams(window.location.search).get("invited"));
        const db = supabase();
        db.from("pharmacies").select("*").eq("id", id).maybeSingle<Pharmacy>().then(({ data }) => {
            if (data) setPharmacy(data);
            else setMissing(true);
        });
        db.from("pharmacy_stats").select("*").eq("pharmacy_id", id).maybeSingle<PharmacyStats>().then(({ data }) => setStats(data));
        loadLogins();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    function loadLogins() {
        supabase()
            .from("profiles")
            .select("id, full_name, email, created_at")
            .eq("pharmacy_id", id)
            .order("created_at")
            .then(({ data }) => setLogins((data ?? []) as Login[]));
    }

    if (missing) return <Notice tone="error">This client doesn&apos;t exist or was removed.</Notice>;
    if (!pharmacy) return <p className="label-mono text-ink" role="status">Loading…</p>;

    return (
        <>
            <Link href="/admin/clients" className="label-mono inline-flex items-center gap-2 text-ink hover:text-ink mb-6">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> All clients
            </Link>
            <PageHeader eyebrow={`Client since ${formatDate(pharmacy.created_at)}`} title={pharmacy.name}>
                {stats && (
                    <p className="text-sm text-ink">
                        Last delivery: <span className="text-ink">{stats.last_delivery_at ? `${formatDate(stats.last_delivery_at)} · ${timeAgo(stats.last_delivery_at)}` : "Never"}</span>
                    </p>
                )}
            </PageHeader>

            {(pharmacy.status === "pending" || pharmacy.status === "denied") && (
                <Card className="p-5 md:p-6 mb-6 border-accent/50">
                    <p className="label-mono text-ink">
                        {pharmacy.status === "pending" ? "Pending partner" : "Denied partner request"}
                    </p>
                    <p className="mt-2 mb-5 text-sm text-ink">
                        {pharmacy.contact_name ?? "Someone"} asked to become a partner {timeAgo(pharmacy.created_at).toLowerCase()}.
                        Approving creates their login and emails it to {pharmacy.email}.
                    </p>
                    <div className="md:max-w-md">
                        <ApprovalActions
                            pharmacy={pharmacy}
                            onChange={(status) => {
                                setPharmacy({ ...pharmacy, status });
                                if (status === "active") {
                                    setInvited(pharmacy.email);
                                    loadLogins();
                                }
                            }}
                        />
                    </div>
                </Card>
            )}

            {invited && (
                <div className="mb-6">
                    <Notice tone="success">Invite sent to {invited}. They&apos;ll get an email to set their password.</Notice>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
                <Stat label="Requests" value={stats?.request_count ?? "–"} />
                <Stat label="Stops sent" value={stats?.delivery_count ?? "–"} />
                <Stat label="Completed" value={stats?.completed_count ?? "–"} />
                <Stat label="Pending" value={stats?.pending_count ?? "–"} />
            </div>

            <div className="grid gap-6 lg:grid-cols-3 mb-12">
                <ClientDetails key={pharmacy.status} pharmacy={pharmacy} onSaved={setPharmacy} />
                <Logins pharmacyId={pharmacy.id} logins={logins} onAdded={loadLogins} />
            </div>

            <p className="label-mono text-ink mb-4">Delivery history</p>
            <DeliveriesList staff pharmacyId={pharmacy.id} initialFilter="all" />
        </>
    );
}

function ClientDetails({ pharmacy, onSaved }: { pharmacy: Pharmacy; onSaved: (p: Pharmacy) => void }) {
    const [form, setForm] = useState(pharmacy);
    const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

    const set = (key: keyof Pharmacy) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm((f) => ({ ...f, [key]: e.target.value }));
        setState("idle");
    };

    async function save(e: React.FormEvent) {
        e.preventDefault();
        setState("saving");
        const { contact_name, phone, street, city, province, postal_code, notes, status } = form;
        const { data, error } = await supabase()
            .from("pharmacies")
            .update({ contact_name, phone, street, city, province, postal_code, notes, status })
            .eq("id", pharmacy.id)
            .select("*")
            .single<Pharmacy>();
        if (error || !data) return setState("error");
        onSaved(data);
        setState("saved");
    }

    return (
        <Card className="p-6 md:p-8 lg:col-span-2">
            <form onSubmit={save}>
                <p className="label-mono text-ink mb-6">Details</p>
                <div className="grid gap-5 md:grid-cols-6">
                    <Field label="Contact name" className="md:col-span-3">
                        <Input value={form.contact_name ?? ""} onChange={set("contact_name")} />
                    </Field>
                    <Field label="Phone" className="md:col-span-3">
                        <Input value={form.phone ?? ""} onChange={set("phone")} />
                    </Field>
                    <Field label="Street address" className="md:col-span-6">
                        <Input value={form.street ?? ""} onChange={set("street")} />
                    </Field>
                    <Field label="City" className="md:col-span-3">
                        <Input value={form.city ?? ""} onChange={set("city")} />
                    </Field>
                    <Field label="Province" className="md:col-span-1">
                        <Input value={form.province} onChange={set("province")} maxLength={2} />
                    </Field>
                    <Field label="Postal code" className="md:col-span-2">
                        <Input value={form.postal_code ?? ""} onChange={set("postal_code")} />
                    </Field>
                    <Field label="Status" className="md:col-span-2" hint="Paused clients can log in but can't send new requests.">
                        <Select value={form.status} onChange={set("status")}>
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            {form.status === "pending" && <option value="pending" disabled>Pending approval</option>}
                            {form.status === "denied" && <option value="denied" disabled>Denied</option>}
                        </Select>
                    </Field>
                    <Field label="Internal notes" className="md:col-span-4">
                        <Textarea value={form.notes ?? ""} onChange={set("notes")} />
                    </Field>
                </div>
                <div className="mt-6 flex items-center justify-end gap-4">
                    {state === "saved" && <span className="text-sm text-ink">Saved.</span>}
                    {state === "error" && <span className="text-sm text-red-700">Couldn&apos;t save. Try again.</span>}
                    <Button type="submit" disabled={state === "saving"}>
                        {state === "saving" ? "Saving…" : "Save details"}
                    </Button>
                </div>
            </form>
        </Card>
    );
}

function Logins({ pharmacyId, logins, onAdded }: { pharmacyId: string; logins: Login[]; onAdded: () => void }) {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);

    async function add(e: React.FormEvent) {
        e.preventDefault();
        setBusy(true);
        setMessage(null);
        try {
            await onboard({ pharmacyId, email, contactName: name });
            setMessage({ tone: "success", text: `Invite sent to ${email}.` });
            setEmail("");
            setName("");
            onAdded();
        } catch (err) {
            setMessage({ tone: "error", text: (err as Error).message });
        }
        setBusy(false);
    }

    return (
        <Card className="p-6 md:p-8">
            <p className="label-mono text-ink mb-6">Logins</p>
            <ul className="space-y-3 mb-6">
                {logins.map((l) => (
                    <li key={l.id} className="text-sm">
                        <p className="text-ink">{l.full_name ?? l.email}</p>
                        {l.full_name && <p className="text-ink">{l.email}</p>}
                    </li>
                ))}
                {logins.length === 0 && <li className="text-sm text-ink">No logins yet.</li>}
            </ul>
            <form onSubmit={add} className="space-y-4 border-t border-hairline pt-6">
                <p className="label-mono text-ink">Add a login</p>
                <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} aria-label="Name" />
                <Input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" />
                {message && <Notice tone={message.tone}>{message.text}</Notice>}
                <Button type="submit" variant="outline" className="w-full" disabled={busy}>
                    {busy ? "Sending…" : "Send invite"}
                </Button>
            </form>
        </Card>
    );
}
