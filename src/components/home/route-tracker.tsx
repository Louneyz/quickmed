'use client';

import { useEffect, useState } from "react";
import { cn } from "../ui/button";

const stops = [
    { id: "pickup", label: "Pickup" },
    { id: "trusted", label: "Trusted" },
    { id: "why", label: "Why it matters" },
    { id: "route", label: "How it works" },
    { id: "safeguards", label: "Safeguards" },
    { id: "questions", label: "Questions" },
    { id: "doorstep", label: "Doorstep" },
];

// Parcel-tracker rail on the left edge (wide screens only): shows which stop of
// the page you're at and fills toward the final call to action.
export function RouteTracker() {
    const [active, setActive] = useState(0);

    useEffect(() => {
        let frame = 0;
        const update = () => {
            frame = 0;
            const mid = window.innerHeight * 0.5;
            let current = 0;
            stops.forEach((stop, index) => {
                const el = document.getElementById(stop.id);
                if (el && el.getBoundingClientRect().top < mid) current = index;
            });
            setActive(current);
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(frame);
        };
    }, []);

    const fill = active / (stops.length - 1);

    return (
        <nav
            aria-label="Page sections"
            className="hidden 2xl:flex fixed left-8 top-1/2 -translate-y-1/2 z-40 rounded-lg bg-white/80 backdrop-blur-[30px] shadow-[0_4px_24px_rgb(15_23_42/0.08)] px-4 py-5"
        >
            <ol className="relative flex flex-col gap-5">
                <span className="absolute left-[5px] top-1.5 bottom-1.5 w-px bg-hairline" aria-hidden="true">
                    <span
                        className="absolute inset-x-0 top-0 h-full bg-brand origin-top transition-transform duration-700 ease-[var(--ease-expo)]"
                        style={{ transform: `scaleY(${fill})` }}
                    />
                </span>
                {stops.map((stop, index) => (
                    <li key={stop.id} className="relative">
                        <a
                            href={`#${stop.id}`}
                            aria-current={index === active ? "step" : undefined}
                            className={cn(
                                "group flex items-center gap-3 label-mono transition-colors",
                                index === active ? "text-ink" : index < active ? "text-gray-mid" : "text-gray-light hover:text-gray-mid",
                            )}
                        >
                            <span
                                className={cn(
                                    "h-[11px] w-[11px] rounded-full border-2 transition-colors",
                                    index <= active ? "bg-brand border-brand" : "bg-white border-gray-light",
                                )}
                            />
                            {stop.label}
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
