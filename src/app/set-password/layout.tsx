import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Set your password | QuickMed",
    robots: { index: false, follow: false },
};

export default function SetPasswordLayout({ children }: { children: React.ReactNode }) {
    return children;
}
