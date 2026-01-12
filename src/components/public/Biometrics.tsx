"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SiteSettings {
    stat_age: string;
    stat_height: string;
    stat_weight: string;
    stat_experience: string;
}

export default function Biometrics() {
    const sectionRef = useRef<HTMLElement>(null);
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    useEffect(() => {
        fetch("/api/settings")
            .then((res) => res.json())
            .then((data) => setSettings(data))
            .catch(console.error);
    }, []);

    const stats = [
        {
            label: "Age",
            value: settings?.stat_age || "28",
            unit: "years",
            icon: "badge",
            color: "primary",
        },
        {
            label: "Height",
            value: settings?.stat_height || "180",
            unit: "cm",
            icon: "height",
            color: "white",
        },
        {
            label: "Weight",
            value: settings?.stat_weight || "105",
            unit: "kg",
            icon: "monitor_weight",
            color: "primary",
        },
        {
            label: "Experience",
            value: settings?.stat_experience || "10",
            unit: "years",
            icon: "history",
            color: "white",
        },
    ];

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".stat-card",
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="biometrics"
            className="relative py-24 px-6 md:px-20 bg-[#050505]"
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        MY STATS
                    </h2>
                    <div className="h-1 w-24 bg-white/20 mx-auto rounded-full overflow-hidden">
                        <div className="h-full w-1/2 bg-white animate-pulse-slow" />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="stat-card relative bg-white/[0.03] backdrop-blur-sm border border-white/5 rounded-2xl p-8 text-center hover:bg-white/[0.06] hover:border-white/10 transition-all duration-500 group overflow-hidden"
                        >
                            <div className="relative z-10">
                                <div className="flex justify-center mb-6">
                                    <span className={`material-symbols-outlined text-4xl text-gray-600 group-hover:text-white transition-colors duration-300`}>
                                        {stat.icon}
                                    </span>
                                </div>

                                <div className="font-display font-bold text-4xl md:text-5xl text-white mb-3 tracking-tight group-hover:scale-110 transition-transform duration-500">
                                    {stat.value}
                                </div>

                                <div className="font-display font-medium text-xs text-gray-500 uppercase tracking-widest">
                                    {stat.label} {stat.unit !== "" && `/ ${stat.unit}`}
                                </div>
                            </div>

                            {/* Hover Glow Effect */}
                            <div className={`absolute inset-0 bg-gradient-to-tr from-${stat.color === 'primary' ? 'cyan-500' : 'purple-500'}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
