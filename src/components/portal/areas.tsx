"use client";

import { PortalGate } from "@/lib/portal/session";
import { PortalShell } from "./shell";

const pharmacyNav = [
    { href: "/portal", label: "Request a delivery" },
    { href: "/portal/deliveries", label: "My deliveries" },
    { href: "/portal/pricing", label: "Pricing" },
    { href: "/portal/how-it-works", label: "How to use QuickMed" },
];

const staffNav = [
    { href: "/admin", label: "Deliveries" },
    { href: "/admin/clients", label: "Clients" },
    { href: "/admin/clients/new", label: "Onboard a client" },
];

export function PharmacyArea({ children }: { children: React.ReactNode }) {
    return (
        <PortalGate role="pharmacy">
            <PortalShell area="Pharmacy portal" nav={pharmacyNav}>{children}</PortalShell>
        </PortalGate>
    );
}

export function StaffArea({ children }: { children: React.ReactNode }) {
    return (
        <PortalGate role="staff">
            <PortalShell area="QuickMed admin" nav={staffNav}>{children}</PortalShell>
        </PortalGate>
    );
}
