"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PreloaderProps {
    onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const subtextRef = useRef<HTMLDivElement>(null);

    const hasRun = useRef(false);

    useEffect(() => {
        const container = containerRef.current;
        const logo = logoRef.current;
        const subtext = subtextRef.current;

        if (!container || !logo || !subtext || hasRun.current) return;
        hasRun.current = true; // Prevent re-running on fast re-renders (strict mode)

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    onComplete();
                },
            });

            tl.to(logo, {
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                duration: 2.0,
                ease: "power3.inOut",
            })
                .to(
                    subtext,
                    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
                    "-=0.8"
                )
                .to({}, { duration: 0.4 })
                .to(container, {
                    opacity: 0,
                    duration: 0.6,
                    ease: "power2.inOut",
                    onComplete: () => {
                        gsap.set(container, { display: "none" });
                    },
                });
        }, container);

        return () => {
            // Do NOT revert the timeline here, otherwise strict mode double-invocations kill the animation forever.
            // Since we use hasRun.current, the animation is fire-and-forget.
        };
    }, [onComplete]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-colors duration-500"
        >
            <div
                ref={logoRef}
                className="font-caveat text-6xl md:text-8xl lg:text-9xl text-foreground font-bold tracking-tight"
                style={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}
            >
                SIDDANTA
            </div>
            <div
                ref={subtextRef}
                className="mt-4 md:mt-6 text-xs md:text-sm font-geist-mono tracking-widest text-neutral-500 uppercase opacity-0 translate-y-4"
            >
                Developer & Builder
            </div>
        </div>
    );
}
