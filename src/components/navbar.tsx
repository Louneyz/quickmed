import Link from "next/link";
import { Button, buttonVariants, cn } from "./ui/button";
import { Menu } from "lucide-react";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full bg-primary border-b-0 shadow-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-2">
                    {/* Enhanced Logo Presentation */}
                    {/* Enhanced Logo Presentation */}
                    <div className="relative w-40 h-12">
                        <img
                            src="/images/quickmed_logo_transparent.png"
                            alt="QuickMed Logo"
                            className="w-full h-full object-contain object-left"
                        />
                    </div>
                </Link>
                <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-white">
                    <Link href="/" className="px-4 py-2 rounded-full transition-all hover:bg-white hover:text-primary">
                        Home
                    </Link>
                    <Link href="/partners" className="px-4 py-2 rounded-full transition-all hover:bg-white hover:text-primary">
                        Become A Partner
                    </Link>
                    <Link href="/drivers" className="px-4 py-2 rounded-full transition-all hover:bg-white hover:text-primary">
                        Become A Driver
                    </Link>

                </nav>
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Trigger could go here */}
                    <Link href="https://portal.quickmed.ca/login" className={cn(buttonVariants("default"), "hidden md:inline-flex bg-transparent border border-white text-white hover:bg-white hover:text-primary font-bold shadow-none")}>
                        Login
                    </Link>
                    <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10 hover:text-white">
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
