import Link from "next/link";

// Split screen used by the login and set-password pages: form on white,
// QuickMed blue panel with the homepage's grid and route line on the right.
export function AuthFrame({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full grid lg:grid-cols-2">
            <div className="flex flex-col px-6 sm:px-12 lg:px-16 xl:px-24 py-8 bg-white">
                <Link href="/" aria-label="QuickMed home" className="self-start">
                    <img src="/images/brand/quickmed-logo-navy.svg" alt="QuickMed" className="h-7 w-auto" />
                </Link>
                <div className="flex-1 flex items-center py-12">
                    <div className="w-full max-w-sm mx-auto lg:mx-0">{children}</div>
                </div>
                <p className="text-sm text-gray-mid">
                    Need help? Call <a href="tel:+14168349123" className="text-ink underline">(416) 834-9123</a>
                </p>
            </div>

            <div className="hidden lg:flex relative overflow-hidden bg-brand text-ink flex-col justify-between p-16 xl:p-20">
                <div
                    aria-hidden
                    className="absolute inset-0 opacity-60"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, rgb(15 23 42 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(15 23 42 / 0.06) 1px, transparent 1px)",
                        backgroundSize: "64px 64px",
                    }}
                />
                <p className="relative label-mono text-ink/70">Pharmacy partner portal</p>
                <svg aria-hidden viewBox="0 0 400 220" className="relative w-full max-w-md self-end" fill="none">
                    <path d="M30 200 C 90 150, 110 120, 120 90 S 220 40, 290 70 S 360 60, 370 20" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    <rect x="16" y="186" width="28" height="28" rx="6" fill="#0f172a" />
                    <path d="M30 193v14M23 200h14" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="370" cy="20" r="14" fill="white" opacity="0.4" />
                    <circle cx="370" cy="20" r="7" fill="white" />
                </svg>
                <div className="relative">
                    <p className="title-lg max-w-lg">From your counter to their door.</p>
                    <p className="mt-6 max-w-md text-ink/80">
                        Send deliveries, track every stop and see our rates in one secure place. Patient information stays in Canada.
                    </p>
                </div>
            </div>
        </div>
    );
}
