import type { Metadata } from "next";
import { StaffArea } from "@/components/portal/areas";

export const metadata: Metadata = {
    title: "Admin | QuickMed",
    robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <StaffArea>{children}</StaffArea>;
}
