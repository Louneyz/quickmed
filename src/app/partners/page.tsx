import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { FeeStructure } from "@/components/fee-structure";
import Link from "next/link";

export default function PartnersPage() {
    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />
            <section className="flex-1 flex flex-col items-center justify-center py-20 bg-slate-50 text-center px-4">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Become a partner</h1>
                <p className="text-lg text-slate-600 max-w-2xl mb-10">
                    Tell us about your pharmacy and we&apos;ll set up your account. You&apos;ll get your login by email.
                </p>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-md w-full">
                    <h2 className="text-xl font-semibold mb-4">Tell us about your pharmacy</h2>
                    <form className="space-y-4">
                        <input type="text" placeholder="Pharmacy name" className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" />
                        <input type="email" placeholder="Email address" className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" />
                        <Button className="w-full">Send</Button>
                    </form>
                </div>
                <div className="mt-12">
                    <Button asChild variant="link">
                        <Link href="/">Back to home</Link>
                    </Button>
                </div>
            </section>

            {/* Fee Structure Section */}
            <div className="bg-white pb-20">
                <FeeStructure />
            </div>

            <Footer />
        </main>
    );
}
