"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

interface GalleryImage {
    id: number;
    imageUrl: string;
    caption: string | null;
    createdAt: string;
}

// Color assignments for cards
const colors = ["primary", "accent-magenta", "accent-green"];

export default function Gallery() {
    const sectionRef = useRef<HTMLElement>(null);
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Lightbox state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);

    useEffect(() => {
        // Fetch images from API
        fetch("/api/gallery")
            .then((res) => res.json())
            .then((data) => {
                setImages(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (loading || images.length === 0) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".gallery-card",
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, [loading, images]);



    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = "";
    };

    const nextImage = useCallback(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prevImage = useCallback(() => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    // Lightbox keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightboxOpen) return;

            if (e.key === "Escape") {
                setLightboxOpen(false);
            } else if (e.key === "ArrowRight") {
                nextImage();
            } else if (e.key === "ArrowLeft") {
                prevImage();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxOpen, nextImage, prevImage]);

    // Touch/swipe support
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }
    };

    return (
        <>
            <section
                ref={sectionRef}
                id="visuals"
                className="relative py-24 px-6 md:px-20 bg-[#050505]"
            >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] z-10 pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-20">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                                TRANSFORMATION GALLERY
                            </h2>
                            <div className="h-1 w-20 bg-primary rounded-full mb-4" />
                            <p className="font-body text-gray-400 max-w-md text-sm md:text-base">
                                Real people. Real results. A collection of physique transformations and dedication.
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${viewMode === "grid"
                                    ? "bg-white text-black border-white"
                                    : "border-white/20 text-gray-400 hover:border-white hover:text-white"
                                    }`}
                            >
                                <span className="material-symbols-outlined">grid_view</span>
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${viewMode === "list"
                                    ? "bg-white text-black border-white"
                                    : "border-white/20 text-gray-400 hover:border-white hover:text-white"
                                    }`}
                            >
                                <span className="material-symbols-outlined">view_list</span>
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-32">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                <div className="text-gray-500 font-mono text-xs tracking-widest animate-pulse">
                                    LOADING GALLERY...
                                </div>
                            </div>
                        </div>
                    ) : images.length === 0 ? (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-16 text-center backdrop-blur-sm">
                            <div className="text-gray-500 font-display text-xl mb-4">
                                NO IMAGES YET
                            </div>
                            <p className="text-gray-600 font-body text-sm">
                                Check back soon for new transformations.
                            </p>
                        </div>
                    ) : (
                        <div
                            className={
                                viewMode === "grid"
                                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                    : "flex flex-col gap-4"
                            }
                        >
                            {images.map((image, index) => {
                                const colorClass = colors[index % colors.length];
                                return (
                                    <div
                                        key={image.id}
                                        className={`gallery-card group relative cursor-pointer overflow-hidden rounded-xl transition-all duration-500 ${viewMode === "grid"
                                            ? "aspect-[3/4]"
                                            : "flex gap-6 items-center bg-white/5 p-4 hover:bg-white/10"
                                            }`}
                                        onClick={() => openLightbox(index)}
                                    >
                                        {/* Image wrapper */}
                                        <div
                                            className={`relative overflow-hidden ${viewMode === "grid"
                                                ? "w-full h-full"
                                                : "w-32 h-32 rounded-lg flex-shrink-0"
                                                }`}
                                        >
                                            <Image
                                                src={image.imageUrl}
                                                alt={image.caption || "Physique image"}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                loading="lazy"
                                            />

                                            {/* Gradient Overlay (Grid only) */}
                                            {viewMode === "grid" && (
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                                            )}
                                        </div>

                                        {/* Content - Grid Mode */}
                                        {viewMode === "grid" && (
                                            <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <div className="w-8 h-1 bg-primary mb-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100 origin-left" />
                                                <p className="font-mono text-[10px] text-primary mb-1 tracking-widest uppercase">
                                                    IMG_{String(image.id).padStart(3, "0")}
                                                </p>
                                                <p className="text-white font-display font-medium text-lg leading-tight">
                                                    {image.caption || "Untitled Capture"}
                                                </p>
                                            </div>
                                        )}

                                        {/* Content - List Mode */}
                                        {viewMode === "list" && (
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-2">
                                                    <span className="font-mono text-[10px] text-primary px-2 py-1 bg-primary/10 rounded">
                                                        IMG_{String(image.id).padStart(3, "0")}
                                                    </span>
                                                    <span className="font-mono text-[10px] text-gray-500">
                                                        {new Date(image.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-white font-display font-bold text-lg">
                                                    {image.caption || "Untitled Capture"}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Fullscreen Lightbox */}
            {lightboxOpen && images.length > 0 && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center"
                    onClick={closeLightbox}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Close button */}
                    <button
                        className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center text-white hover:text-primary transition-colors"
                        onClick={closeLightbox}
                    >
                        <span className="material-symbols-outlined text-3xl">close</span>
                    </button>

                    {/* Navigation arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-white hover:text-primary transition-colors bg-black/50 rounded-full"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prevImage();
                                }}
                            >
                                <span className="material-symbols-outlined text-3xl">
                                    chevron_left
                                </span>
                            </button>
                            <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-white hover:text-primary transition-colors bg-black/50 rounded-full"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    nextImage();
                                }}
                            >
                                <span className="material-symbols-outlined text-3xl">
                                    chevron_right
                                </span>
                            </button>
                        </>
                    )}

                    {/* Image */}
                    <div
                        className="relative w-full h-full max-w-5xl max-h-[80vh] mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={images[currentImageIndex].imageUrl}
                            alt={images[currentImageIndex].caption || "Physique image"}
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Caption */}
                    <div className="absolute bottom-8 left-0 right-0 text-center">
                        <p className="text-primary font-mono text-sm mb-2">
                            {currentImageIndex + 1} / {images.length}
                        </p>
                        <p className="text-white font-display text-xl">
                            {images[currentImageIndex].caption || ""}
                        </p>
                        <p className="text-gray-500 font-mono text-xs mt-2">
                            {new Date(images[currentImageIndex].createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Swipe hint on mobile */}
                    <div className="absolute bottom-4 left-0 right-0 text-center md:hidden">
                        <p className="text-gray-500 font-mono text-xs">
                            ← SWIPE TO NAVIGATE →
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
