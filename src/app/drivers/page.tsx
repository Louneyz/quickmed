import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DriversPage() {
    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />
            <section className="flex-1 flex flex-col items-center justify-center py-20 bg-slate-50 text-center px-4">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Drive With QuickMed</h1>
                <p className="text-lg text-slate-600 max-w-2xl mb-10">
                    Flexible hours, competitive pay, and the chance to make a difference in your community.
                </p>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-md w-full">
                    <h2 className="text-xl font-semibold mb-4">Apply Now</h2>
                    <form className="space-y-4">
                        <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" />
                        <input type="email" placeholder="Email Address" className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" />
                        <input type="tel" placeholder="Phone Number" className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" />
                        <Button className="w-full">Start Application</Button>
                    </form>
                </div>
                <div className="mt-12">
                    <Button asChild variant="link">
                        <Link href="/">Back to Home</Link>
                    </Button>
                </div>
            </section>
            <Footer />
        </main>
    );
}
