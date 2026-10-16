'use client';

import { useEffect, useRef, useState } from "react";
import { Building2, Upload, Car, House } from "lucide-react";
import { cn } from "./ui/button";
import { WordReveal } from "./motion/reveal";

const steps = [
    {
        title: "Join QuickMed",
        description: "Apply as a partner. We set up your pharmacy's account and email you secure login details.",
        status: "Pharmacy onboarded",
        icon: Building2,
    },
    {
        title: "Submit a Request",
        description: "Fill out a short form in our secure member area with the recipient's information and medication details.",
        status: "Order received",
        icon: Upload,
    },
    {
        title: "Driver Pickup",
        description: "Our team schedules a trained driver to collect the delivery from your pharmacy at the designated time.",
        status: "On the road",
        icon: Car,
    },
    {
        title: "Delivered",
        description: "Our drivers know the local routes and bring the medication to your patient's door.",
        status: "Delivered",
        icon: House,
    },
];

// The four steps as a route: the line fills and each stop lights up as it
// crosses the middle of the screen. Tied to native scroll, nothing is pinned.
function useRouteProgress() {
    const listRef = useRef<HTMLOListElement>(null);
    const [progress, setProgress] = useState(0);
    const [active, setActive] = useState(0);

    useEffect(() => {
        let frame = 0;
        const update = () => {
            frame = 0;
            const list = listRef.current;
            if (!list) return;
            const mid = window.innerHeight * 0.55;
            const rect = list.getBoundingClientRect();
            setProgress(Math.min(1, Math.max(0, (mid - rect.top) / rect.height)));
            // A stop is reached once its icon passes the line, in step with the courier.
            const icons = Array.from(list.querySelectorAll<HTMLElement>("[data-stop]"));
            let current = 0;
            icons.forEach((icon, index) => {
                if (icon.getBoundingClientRect().top + icon.offsetHeight / 2 < mid) current = index;
            });
            setActive(current);
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            cancelAnimationFrame(frame);
        };
    }, []);

    return { listRef, progress, active };
}

export function Process() {
    const { listRef, progress, active } = useRouteProgress();
    const ActiveIcon = steps[active].icon;

    return (
        <section id="route" className="bg-surface py-20 md:py-32 scroll-mt-24">
            <div className="mx-auto max-w-6xl px-5 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-5">
                    <div className="lg:sticky lg:top-36">
                        <WordReveal
                            className="title-lg text-ink"
                            parts={[
                                { text: "Four steps" },
                                { text: "from shelf to doorstep.", className: "text-gray-light" },
                            ]}
                        />
                        <p className="mt-6 text-lg text-gray max-w-md">
                            A simple process that gets medication from your pharmacy to your patients quickly and securely.
                        </p>

                        {/* Live tracker card that follows the active step (desktop). */}
                        <div className="hidden lg:block mt-12 max-w-sm rounded-[20px] bg-white p-6" aria-hidden="true">
                            <div className="flex items-center justify-between mb-6">
                                <p className="label-mono text-gray-mid">Delivery status</p>
                                <p className="label-mono text-gray-light">
                                    {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="h-12 w-12 rounded-lg bg-brand text-ink flex items-center justify-center">
                                    <ActiveIcon className="h-5 w-5" />
                                </span>
                                <p className="text-2xl tracking-tight text-ink">{steps[active].status}</p>
                            </div>
                            <div className="mt-6 h-1 rounded-full bg-surface overflow-hidden">
                                <div className="h-full bg-brand origin-left" style={{ transform: `scaleX(${progress})` }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative lg:col-span-7 lg:col-start-6">
                    {/* Route line: dashed track, filled by scroll progress, with the courier on it. */}
                    <div className="absolute left-[23px] top-6 bottom-6 w-px border-l-2 border-dashed border-gray-light" aria-hidden="true">
                        <div
                            className="absolute -left-[2px] top-0 w-[2px] h-full bg-brand origin-top"
                            style={{ transform: `scaleY(${progress})` }}
                        />
                        <div
                            className="absolute -left-[8px] h-3.5 w-3.5 rounded-full bg-ink ring-4 ring-surface"
                            style={{ top: `calc(${progress * 100}% - 7px)` }}
                        />
                    </div>

                    <ol ref={listRef}>
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const reached = index <= active;
                            return (
                                <li
                                    key={step.title}
                                    className="relative grid grid-cols-[3rem_1fr] gap-5 md:gap-8 py-10 md:py-16 first:pt-0 last:pb-0"
                                >
                                    <span
                                        data-stop
                                        className={cn(
                                            "relative z-10 h-12 w-12 rounded-lg flex items-center justify-center transition-colors duration-500",
                                            reached ? "bg-brand text-ink" : "bg-white text-gray-light",
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <p className={cn("label-mono mb-3 transition-colors duration-500", reached ? "text-gray-mid" : "text-gray-light")}>
                                            {String(index + 1).padStart(2, "0")} · {step.status}
                                        </p>
                                        <h3 className={cn("title-md mb-3 transition-colors duration-500", reached ? "text-ink" : "text-gray-light")}>
                                            {step.title}
                                        </h3>
                                        <p className={cn("text-lg leading-snug max-w-md transition-colors duration-500", reached ? "text-gray" : "text-gray-mid/70")}>
                                            {step.description}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </div>
        </section>
    );
}
