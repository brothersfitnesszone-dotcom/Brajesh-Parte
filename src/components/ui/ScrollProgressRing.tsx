"use client";

import { useEffect, useState } from "react";

export default function ScrollProgressRing() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
            const scrollCurrent = window.scrollY;
            const scrollPercentage = Math.min(scrollCurrent / scrollTotal, 1);
            setProgress(scrollPercentage);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - progress * circumference;

    return (
        <div
            className={`fixed bottom-8 right-8 z-[60] transition-all duration-500 cursor-pointer group ${progress > 0.05 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            onClick={scrollToTop}
        >
            <div className="relative flex items-center justify-center w-14 h-14 bg-black/50 backdrop-blur-md rounded-full border border-white/10 shadow-xl group-hover:scale-110 transition-transform">
                <svg
                    className="absolute transform -rotate-90 w-14 h-14"
                >
                    <circle
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="3"
                        fill="transparent"
                        r={radius}
                        cx="28"
                        cy="28"
                    />
                    <circle
                        stroke="#00f3ff" // Cyan primary
                        strokeWidth="3"
                        fill="transparent"
                        r={radius}
                        cx="28"
                        cy="28"
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: offset,
                            transition: "stroke-dashoffset 0.1s linear"
                        }}
                    />
                </svg>
                <span className="material-symbols-outlined text-white text-xl animate-bounce">
                    arrow_upward
                </span>
            </div>
        </div>
    );
}
