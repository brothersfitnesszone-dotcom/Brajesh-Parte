"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
    children: string;
    className?: string;
    delay?: number;
}

export default function TextReveal({ children, className = "", delay = 0 }: TextRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        gsap.fromTo(
            textRef.current,
            { y: "100%", opacity: 0, rotateX: -20 },
            {
                y: "0%",
                opacity: 1,
                rotateX: 0,
                duration: 1.2,
                ease: "power4.out",
                delay: delay,
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
            }
        );
    }, [delay]);

    return (
        <div ref={containerRef} className={`overflow-hidden inline-block ${className}`}>
            <span ref={textRef} className="inline-block origin-top-left transform-style-3d">
                {children}
            </span>
        </div>
    );
}
