"use client";

import { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SiteSettings {
    social_instagram: string;
    social_whatsapp: string;
    social_phone: string;
    social_email: string;
}

export default function Footer() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    useEffect(() => {
        fetch("/api/settings")
            .then((res) => res.json())
            .then((data) => setSettings(data))
            .catch(console.error);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(".footer-reveal",
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: "#contact",
                        start: "top 80%",
                    }
                }
            );

            gsap.to(".call-pulse", {
                boxShadow: "0 0 40px rgba(0,255,255,0.4)",
                repeat: -1,
                yoyo: true,
                duration: 1.5,
                ease: "sine.inOut"
            });
        });
        return () => ctx.revert();
    }, []);

    const whatsappMessage = encodeURIComponent("Hi Brajesh, I am interested in joining your Elite Personal Training program. I would like to discuss my goals and get started.");

    const whatsappLink = settings?.social_whatsapp
        ? `https://wa.me/${settings.social_whatsapp.replace(/[^0-9]/g, "")}?text=${whatsappMessage}`
        : "#";

    const phoneLink = settings?.social_phone
        ? `tel:${settings.social_phone}`
        : "#";

    // Fallback links if settings haven't loaded
    const finalWhatsappLink = settings?.social_whatsapp ? whatsappLink : "https://wa.me/918319219942";
    const finalPhoneLink = settings?.social_phone ? phoneLink : "tel:+918319219942";
    const instagramLink = settings?.social_instagram || "https://instagram.com/welcomto_brj_city";

    return (
        <footer
            id="contact"
            className="relative py-24 px-6 md:px-20 border-t border-white/5 bg-black"
        >
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
                <span className="footer-reveal font-mono text-primary text-xs tracking-[0.3em] mb-4">
                    GET IN TOUCH
                </span>
                <h2 className="footer-reveal font-display text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                    READY TO START?
                </h2>
                <p className="footer-reveal text-gray-400 mb-12 max-w-lg text-lg font-light leading-relaxed">
                    No complicated forms. No waiting. If you are serious about your transformation, call me directly.
                </p>

                {/* Main Call Button */}
                <a
                    href={finalPhoneLink}
                    className="footer-reveal call-pulse group relative inline-flex items-center justify-center gap-4 bg-white text-black font-display font-bold text-xl md:text-2xl px-12 py-6 rounded-2xl hover:bg-primary hover:scale-105 transition-all duration-300 w-full md:w-auto mb-16"
                >
                    <span className="material-symbols-outlined text-4xl group-hover:rotate-12 transition-transform">call</span>
                    <span>CALL FOR TRAINING</span>
                </a>

                {/* Secondary Links */}
                <div className="footer-reveal flex flex-wrap justify-center gap-8 md:gap-16">
                    <a
                        href={finalWhatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-accent-green group-hover:bg-accent-green/10 transition-colors">
                            <span className="material-symbols-outlined text-xl">chat</span>
                        </div>
                        <span className="font-display font-medium text-sm tracking-widest">WHATSAPP</span>
                    </a>

                    <a
                        href={instagramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-accent-magenta group-hover:bg-accent-magenta/10 transition-colors">
                            <span className="material-symbols-outlined text-xl">photo_camera</span>
                        </div>
                        <span className="font-display font-medium text-sm tracking-widest">INSTAGRAM</span>
                    </a>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="max-w-5xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 font-mono gap-4 text-center md:text-left tracking-widest uppercase">
                <div>© {new Date().getFullYear()} Brajesh Parte. All rights reserved.</div>
                <div className="text-gray-700">
                    LAKHNADON • PERSONAL TRAINER
                </div>
            </div>
        </footer>
    );
}
