'use client';

import type { CSSProperties, ReactNode } from "react";
import { cn } from "../ui/button";
import { useInView } from "./use-in-view";

// Fades and lifts its children in the first time they scroll into view.
export function Reveal({
    children,
    className,
    delay = 0,
}: {
    children: ReactNode;
    className?: string;
    delay?: number;
}) {
    const [ref, inView] = useInView<HTMLDivElement>();
    return (
        <div
            ref={ref}
            data-in={inView}
            className={cn("reveal", className)}
            style={{ "--delay": `${delay}ms` } as CSSProperties}
        >
            {children}
        </div>
    );
}

// Splits a headline into words that rise in one after another.
// `parts` keeps the two-tone heading style: each part carries its own colour class.
export function WordReveal({
    parts,
    as: Tag = "h2",
    className,
}: {
    parts: { text: string; className?: string }[];
    as?: "h1" | "h2" | "p";
    className?: string;
}) {
    const [ref, inView] = useInView<HTMLHeadingElement>("0px");
    let index = 0;

    return (
        <Tag ref={ref} data-in={inView} className={className}>
            {parts.map((part, p) => (
                <span key={p} className={part.className}>
                    {part.text.split(" ").map((word, w, words) => {
                        const i = index++;
                        return (
                            <span key={w}>
                                <span className="word" style={{ "--i": i } as CSSProperties}>{word}</span>
                                {w < words.length - 1 || p < parts.length - 1 ? " " : null}
                            </span>
                        );
                    })}
                </span>
            ))}
        </Tag>
    );
}
