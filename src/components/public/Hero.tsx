"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import TextReveal from "@/components/ui/TextReveal";
import MagneticButton from "@/components/ui/MagneticButton";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [location, setLocation] = useState("Lakhnadon, 480886"); // Default

    useEffect(() => {
        // Fetch location
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data.location) setLocation(data.location);
            })
            .catch(console.error);

        const ctx = gsap.context(() => {
            const isTouch = ScrollTrigger.isTouch;
            const tl = gsap.timeline();

            // Initial Reveal
            tl.fromTo(".hero-reveal",
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", stagger: 0.15 }
            );

            // Typing Effect loop
            const typingTl = gsap.timeline({ repeat: -1, repeatDelay: 5 });

            typingTl.to(".typing-text", {
                duration: 2,
                text: "BRAJESH PARTE",
                ease: "none"
            });

            // Pulse Animation for Location
            gsap.to(".location-pulse", {
                scale: 1.5,
                opacity: 0,
                duration: 2,
                repeat: -1,
                ease: "power1.out"
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative h-[100dvh] flex items-center justify-center overflow-hidden bg-background"
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505] z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.05)_0%,transparent_70%)] z-0" />

            <div className="relative z-20 text-center px-6 max-w-7xl mx-auto mt-20 md:mt-0">

                {/* Location Badge */}
                <div className="hero-reveal flex items-center justify-center gap-2 mb-8">
                    <div className="relative flex items-center justify-center w-3 h-3">
                        <div className="absolute w-full h-full bg-red-500 rounded-full location-pulse" />
                        <div className="relative w-2 h-2 bg-red-500 rounded-full" />
                    </div>
                    <span className="font-mono text-xs md:text-sm text-gray-400 tracking-widest uppercase">
                        Current Location: <span className="text-white">{location}</span>
                    </span>
                </div>

                {/* Subtitle */}
                <h2 className="mb-4">
                    <TextReveal className="text-primary font-display font-medium text-sm md:text-lg tracking-luxury">
                        Elite Personal Training
                    </TextReveal>
                </h2>

                {/* Main Title with Typing Effect */}
                <div className="h-20 md:h-32 flex items-center justify-center mb-8">
                    <h1
                        ref={titleRef}
                        className="hero-reveal font-display font-bold text-6xl sm:text-7xl md:text-9xl leading-[0.9] text-white tracking-tighter gpu-accelerated"
                    >
                        <span className="typing-text"></span>
                        <span className="animate-blink">|</span>
                    </h1>
                </div>

                {/* Description */}
                <div className="mb-12">
                    <TextReveal className="font-body text-gray-400 text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed font-light" delay={0.5}>
                        Building stronger humans through disciplined training and expert guidance.
                    </TextReveal>
                </div>

                {/* CTA Button */}
                <div className="hero-reveal">
                    <MagneticButton strength={40}>
                        <a
                            href="#biometrics"
                            className="group relative inline-flex items-center gap-4 bg-white text-black font-display font-bold text-lg px-8 py-4 rounded-full overflow-hidden hover:bg-gray-100 transition-all duration-300"
                        >
                            <span className="relative z-10">START YOUR JOURNEY</span>
                            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center group-hover:bg-black/20 transition-colors">
                                <span className="material-symbols-outlined text-white text-sm group-hover:rotate-45 transition-transform duration-300">
                                    arrow_downward
                                </span>
                            </div>
                        </a>
                    </MagneticButton>
                </div>
            </div>
        </section >
    );
}
