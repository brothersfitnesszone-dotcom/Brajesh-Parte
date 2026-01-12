"use client";

import { useRef, useEffect, ReactNode } from "react";
import gsap from "gsap";

interface MagneticButtonProps {
    children: ReactNode;
    className?: string;
    strength?: number; // How strong the pull is
}

export default function MagneticButton({ children, className = "", strength = 30 }: MagneticButtonProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate distance from center
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;

            // Apply magnetic pull
            gsap.to(el, {
                x: deltaX * (strength / 100),
                y: deltaY * (strength / 100),
                duration: 0.5,
                ease: "power2.out",
            });
        };

        const handleMouseLeave = () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)",
            });
        };

        el.addEventListener("mousemove", handleMouseMove);
        el.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            el.removeEventListener("mousemove", handleMouseMove);
            el.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [strength]);

    return (
        <div ref={ref} className={`inline-block cursor-pointer ${className}`}>
            {children}
        </div>
    );
}
