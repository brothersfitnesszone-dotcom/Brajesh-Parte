"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const navItems = [
    { href: "#hero", label: "HOME" },
    { href: "#biometrics", label: "MY STATS" },
    { href: "#protocol", label: "PHILOSOPHY" },
    { href: "#visuals", label: "GALLERY" },
    { href: "#contact", label: "CONTACT" },
];

export default function CyberNav() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {/* Top Navigation Bar */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || mobileMenuOpen
                    ? "bg-black/50 backdrop-blur-xl border-b border-white/5 py-4 shadow-2xl"
                    : "bg-transparent py-6"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-20 flex items-center justify-between">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 overflow-hidden rounded-full border border-white/20 group-hover:border-primary transition-colors duration-500">
                            <Image
                                src="/logo.png"
                                alt="BP Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-display font-medium text-white text-lg tracking-wider group-hover:text-primary transition-colors duration-300">
                                BRAJESH PARTE
                            </span>
                            <span className="font-mono text-[10px] text-gray-500 tracking-[0.3em] group-hover:text-white transition-colors duration-300">
                                PERSONAL TRAINER
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-10">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-xs font-display font-medium text-gray-400 hover:text-white transition-colors tracking-[0.2em] uppercase relative group"
                            >
                                <span className="relative z-10">{item.label}</span>
                                <span className="absolute bottom-[-4px] left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300 ease-out" />
                            </Link>
                        ))}
                        <Link
                            href="#contact"
                            className="bg-white hover:bg-primary text-black font-display font-bold px-8 py-3 text-xs transition-all duration-300 rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            JOIN NOW
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white p-2 hover:bg-white/5 rounded-full transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className="material-symbols-outlined text-2xl">
                            {mobileMenuOpen ? "close" : "menu"}
                        </span>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl transition-all duration-500 md:hidden flex items-center justify-center ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            >
                <div className="flex flex-col items-center gap-8 p-6 text-center">
                    {navItems.map((item, index) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`text-3xl font-display font-bold text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-primary hover:to-white transition-all transform hover:scale-110 duration-300 ${mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                                }`}
                            style={{ transitionDelay: `${index * 50}ms` }}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <Link
                        href="#contact"
                        className="mt-8 bg-white hover:bg-primary text-black font-display font-bold px-12 py-4 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-xl"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        START YOUR JOURNEY
                    </Link>

                    <div className="mt-12 flex flex-col items-center gap-2 opacity-30 font-mono text-xs tracking-widest text-white">
                        <p>LAKHNADON • INDIA</p>
                    </div>
                </div>
            </div>
        </>
    );
}
