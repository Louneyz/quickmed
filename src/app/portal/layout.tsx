import type { Metadata } from "next";
import { PharmacyArea } from "@/components/portal/areas";

export const metadata: Metadata = {
    title: "Pharmacy portal | QuickMed",
    robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
    return <PharmacyArea>{children}</PharmacyArea>;
}
