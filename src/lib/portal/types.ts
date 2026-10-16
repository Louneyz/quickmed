export type Role = "pharmacy" | "staff";

export type Profile = {
    id: string;
    role: Role;
    pharmacy_id: string | null;
    full_name: string | null;
};

export type Pharmacy = {
    id: string;
    name: string;
    contact_name: string | null;
    email: string;
    phone: string | null;
    street: string | null;
    city: string | null;
    province: string;
    postal_code: string | null;
    notes: string | null;
    status: "active" | "paused";
    created_at: string;
};

export type DeliveryStatus = "pending" | "completed" | "cancelled";

export type Delivery = {
    id: string;
    request_id: string;
    pharmacy_id: string;
    patient_first_name: string | null;
    patient_last_name: string | null;
    street: string | null;
    street2: string | null;
    city: string | null;
    province: string | null;
    postal_code: string | null;
    phone: string | null;
    flags: string[];
    status: DeliveryStatus;
    completed_at: string | null;
    redacted_at: string | null;
    created_at: string;
    delivery_requests?: { delivery_date: string | null; notes: string | null } | null;
    pharmacies?: { name: string } | null;
};

export type PharmacyStats = {
    pharmacy_id: string;
    name: string;
    contact_name: string | null;
    email: string;
    phone: string | null;
    status: "active" | "paused";
    created_at: string;
    request_count: number;
    delivery_count: number;
    completed_count: number;
    pending_count: number;
    last_request_at: string | null;
};

export const deliveryFlags = [
    { value: "narcotic", label: "Narcotic" },
    { value: "refrigerated", label: "Refrigerated medication" },
    { value: "cod", label: "C.O.D." },
    { value: "reverse_pickup", label: "Reverse pick-up" },
    { value: "asap", label: "ASAP" },
] as const;

export function flagLabel(value: string) {
    return deliveryFlags.find((f) => f.value === value)?.label ?? value;
}

export function formatDate(value: string | null, withTime = false) {
    if (!value) return "—";
    // Plain dates ("2026-10-20") are calendar days, not instants; don't shift them by timezone.
    const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : new Date(value);
    return date.toLocaleString("en-CA", {
        month: "short",
        day: "numeric",
        year: "numeric",
        ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
    });
}
