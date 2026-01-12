"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextReveal from "@/components/ui/TextReveal";
import MagneticButton from "@/components/ui/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

interface SiteSettings {
    about_line1: string;
    about_line2: string;
    about_line3: string;
}

const philosophyItems = [
    {
        icon: "bolt",
        title: "DISCIPLINE",
        description:
            "Consistency is key. Whether you feel like it or not, the work gets done. That is the only secret.",
        color: "primary",
    },
    {
        icon: "fitness_center",
        title: "STRENGTH",
        description:
            "Push beyond your limits safely. We focus on progressive overload to build real, lasting power.",
        color: "accent-magenta",
    },
    {
        icon: "local_dining",
        title: "NUTRITION",
        description:
            "Fuel your body correctly. Personalized diet plans that fit your lifestyle and goals.",
        color: "accent-green",
    },
];

export default function TrainingProtocol() {
    const sectionRef = useRef<HTMLElement>(null);
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    useEffect(() => {
        fetch("/api/settings")
            .then((res) => res.json())
            .then((data) => setSettings(data))
            .catch(console.error);
    }, []);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".fade-in-up",
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Default about text
    const aboutLine1 = settings?.about_line1 || "My philosophy is simple: The body achieves what the mind believes.";
    const aboutLine2 = settings?.about_line2 || "I don't just train bodies; I build mindsets.";
    const aboutLine3 = settings?.about_line3 || "Results require 100% commitment. If you are ready to work, I am ready to guide you.";

    return (
        <section
            ref={sectionRef}
            id="protocol"
            className="relative py-32 px-6 md:px-20 bg-[#050505] overflow-hidden"
        >
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center relative z-10">
                {/* About Text */}
                <div className="lg:w-1/2 fade-in-up">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-[1px] bg-primary" />
                        <h2 className="text-primary font-mono text-[10px] tracking-luxury uppercase">
                            MY PHILOSOPHY
                        </h2>
                    </div>

                    <h3 className="mb-10">
                        <TextReveal className="font-display font-bold text-4xl md:text-6xl text-white leading-tight">
                            BUILDING STRONGER HUMANS
                        </TextReveal>
                    </h3>

                    <div className="flex flex-col gap-8 text-gray-400 text-lg md:text-xl font-light leading-relaxed">
                        <p>{aboutLine1}</p>
                        <p>{aboutLine2}</p>
                        <div className="relative pl-6 border-l-2 border-primary/50">
                            <p className="text-white font-medium italic">
                                "{aboutLine3}"
                            </p>
                        </div>
                    </div>

                    <MagneticButton strength={25} className="mt-12">
                        <a
                            href="#contact"
                            className="group inline-flex items-center gap-3 bg-white text-black font-display font-bold px-8 py-4 rounded-full hover:bg-primary transition-all duration-300"
                        >
                            <span>START YOUR JOURNEY</span>
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </a>
                    </MagneticButton>
                </div>

                {/* Philosophy Cards */}
                <div className="lg:w-1/2 flex flex-col gap-6 w-full">
                    {philosophyItems.map((item, index) => (
                        <MagneticButton key={item.title} strength={10} className="w-full">
                            <div
                                className="fade-in-up group relative p-8 glass-panel hover:bg-white/[0.06] transition-all duration-500 overflow-hidden w-full"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="material-symbols-outlined text-8xl scale-150 rotate-[-15deg]">
                                        {item.icon}
                                    </span>
                                </div>

                                <div className="relative z-10 flex gap-6 items-start text-left">
                                    <div className={`w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white group-hover:scale-110 transition-transform duration-500`}>
                                        <span className="material-symbols-outlined text-3xl">
                                            {item.icon}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-display font-bold text-xl text-white mb-3 tracking-wide">
                                            {item.title}
                                        </h4>
                                        <p className="text-gray-400 text-sm leading-relaxed font-light">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </MagneticButton>
                    ))}
                </div>
            </div>
        </section>
    );
}
