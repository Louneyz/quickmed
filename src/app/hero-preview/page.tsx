import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { HeroCentred, HeroNavy, HeroNavyCentred, HeroSplit } from "@/components/hero-options";

export const metadata: Metadata = {
    title: "Hero options",
    robots: { index: false, follow: false },
};

// Temporary page so the three hero directions can be compared on a real phone and laptop.
function Divider({ label }: { label: string }) {
    return <div className="label-mono bg-white text-ink px-5 py-6 text-center border-y border-hairline">{label}</div>;
}

export default function HeroPreview() {
    return (
        <main className="min-h-screen flex flex-col">
            <Navbar overlay />
            <HeroNavy />
            <Divider label="Option 1b · Centred, home beside the title" />
            <HeroNavyCentred />
            <Divider label="Option 2 · Centred headline" />
            <HeroCentred />
            <Divider label="Option 3 · Split screen" />
            <HeroSplit />
            <div className="h-[60vh] bg-white" />
        </main>
    );
}
