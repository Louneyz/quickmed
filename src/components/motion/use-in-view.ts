'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// True once the element has scrolled into view; stays true after that.
export function useInView<T extends Element>(rootMargin = "0px 0px -12% 0px") {
    const ref = useRef<T>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin },
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [rootMargin]);

    return [ref, inView] as const;
}

const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribeReduced(onChange: () => void) {
    const query = window.matchMedia(REDUCED);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
}

// True when the visitor asked for less motion. The server renders the still,
// final state (true) so the page never depends on JavaScript to show content.
export function useReducedMotion() {
    return useSyncExternalStore(
        subscribeReduced,
        () => window.matchMedia(REDUCED).matches,
        () => true,
    );
}
