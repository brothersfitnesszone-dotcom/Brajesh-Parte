"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface GalleryImage {
    id: number;
    imageUrl: string;
    caption: string | null;
    createdAt: string;
}

interface SiteSettings {
    stat_age: string;
    stat_height: string;
    stat_weight: string;
    stat_experience: string;
    about_line1: string;
    about_line2: string;
    about_line3: string;
    social_instagram: string;
    social_whatsapp: string;
    social_phone: string;
    social_email: string;
    social_youtube: string;
    location: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [savingSettings, setSavingSettings] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editCaption, setEditCaption] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [uploadCaption, setUploadCaption] = useState("");
    const [activeTab, setActiveTab] = useState<"gallery" | "settings">("gallery");

    const fetchImages = useCallback(async () => {
        try {
            const res = await fetch("/api/gallery");
            const data = await res.json();
            setImages(data);
        } catch (error) {
            console.error("Failed to fetch images:", error);
        }
    }, []);

    const fetchSettings = useCallback(async () => {
        try {
            const res = await fetch("/api/settings");
            const data = await res.json();
            setSettings(data);
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        }
    }, []);

    useEffect(() => {
        // Check authentication
        fetch("/api/auth/check")
            .then((res) => {
                if (!res.ok) {
                    router.push("/admin");
                } else {
                    Promise.all([fetchImages(), fetchSettings()]).then(() => {
                        setLoading(false);
                    });
                }
            })
            .catch(() => {
                router.push("/admin");
            });
    }, [router, fetchImages, fetchSettings]);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin");
    };

    const handleFileUpload = async (file: File) => {
        setUploading(true);
        const formData = new FormData();
        formData.append("image", file);
        formData.append("caption", uploadCaption || "");

        try {
            const res = await fetch("/api/gallery", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                setUploadCaption("");
                await fetchImages();
            } else {
                const data = await res.json();
                alert(data.error || "Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            handleFileUpload(file);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleUpdateCaption = async (id: number) => {
        try {
            const res = await fetch(`/api/gallery/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ caption: editCaption }),
            });

            if (res.ok) {
                setEditingId(null);
                await fetchImages();
            }
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
            if (res.ok) {
                setDeleteConfirm(null);
                await fetchImages();
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleSaveSettings = async () => {
        if (!settings) return;
        setSavingSettings(true);

        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                const newSettings = await res.json();
                setSettings(newSettings);
                alert("Settings saved successfully!");
            } else {
                alert("Failed to save settings");
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("Failed to save settings");
        } finally {
            setSavingSettings(false);
        }
    };

    const updateSettingField = (key: keyof SiteSettings, value: string) => {
        if (!settings) return;
        setSettings({ ...settings, [key]: value });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-dark">
                <div className="text-primary font-mono animate-pulse">
                    LOADING ADMIN INTERFACE...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* Background Gradient */}
            <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505] z-0 pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03)_0%,transparent_50%)] z-0 pointer-events-none" />

            {/* Header */}
            <header className="sticky top-0 z-40 bg-black/50 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <Image src="/logo.png" alt="Logo" width={40} height={40} className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div>
                            <h1 className="font-display font-bold text-lg text-white tracking-wide">
                                Admin Dashboard
                            </h1>
                            <p className="font-mono text-[10px] text-gray-500 tracking-widest uppercase">
                                Content Management
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <a
                            href="/"
                            target="_blank"
                            className="font-display text-xs font-medium text-gray-400 hover:text-white transition-colors"
                        >
                            VIEW LIVE SITE
                        </a>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white font-display text-xs font-bold hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 transition-all"
                        >
                            LOGOUT
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="max-w-7xl mx-auto px-6 flex gap-8">
                    <button
                        onClick={() => setActiveTab("gallery")}
                        className={`py-4 font-display text-sm font-medium border-b-2 transition-all ${activeTab === "gallery"
                            ? "border-primary text-white"
                            : "border-transparent text-gray-500 hover:text-gray-300"
                            }`}
                    >
                        GALLERY MANAGER
                    </button>
                    <button
                        onClick={() => setActiveTab("settings")}
                        className={`py-4 font-display text-sm font-medium border-b-2 transition-all ${activeTab === "settings"
                            ? "border-primary text-white"
                            : "border-transparent text-gray-500 hover:text-gray-300"
                            }`}
                    >
                        SITE SETTINGS
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                {activeTab === "gallery" ? (
                    <>
                        {/* Upload Section */}
                        <section className="mb-12">
                            <h2 className="font-display text-2xl font-bold text-white mb-6">
                                Upload New Image
                            </h2>

                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Caption Input */}
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={uploadCaption}
                                        onChange={(e) => setUploadCaption(e.target.value)}
                                        placeholder="Enter image caption (optional)"
                                        className="w-full bg-white/[0.03] border border-white/10 text-white px-6 py-4 rounded-xl font-body text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-gray-600"
                                    />
                                </div>

                                {/* Drop Zone */}
                                <div
                                    className={`flex-1 border border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${dragOver
                                        ? "border-primary bg-primary/5"
                                        : "border-white/10 hover:border-white/30 hover:bg-white/[0.02]"
                                        }`}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setDragOver(true);
                                    }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById("fileInput")?.click()}
                                >
                                    <input
                                        id="fileInput"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />

                                    {uploading ? (
                                        <div className="text-primary font-display font-medium text-sm animate-pulse">
                                            Uploading...
                                        </div>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-3xl text-gray-400 mb-2">
                                                cloud_upload
                                            </span>
                                            <p className="font-display font-medium text-sm text-gray-300">
                                                Click to upload or drag image here
                                            </p>
                                        </>)}
                                </div>
                            </div>
                        </section>

                        {/* Gallery Grid */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="font-display text-2xl font-bold text-white">
                                    Gallery Items
                                </h2>
                                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10 font-mono text-xs text-gray-400">
                                    {images.length} ITEMS
                                </span>
                            </div>

                            {images.length === 0 ? (
                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-16 text-center">
                                    <div className="text-gray-600 font-display text-lg mb-2">
                                        Gallery is empty
                                    </div>
                                    <p className="text-gray-700 font-body text-sm">
                                        Upload your first image to get started.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {images.map((image) => (
                                        <div
                                            key={image.id}
                                            className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden group hover:bg-white/[0.05] transition-colors"
                                        >
                                            {/* Image */}
                                            <div className="aspect-[4/3] relative">
                                                <Image
                                                    src={image.imageUrl}
                                                    alt={image.caption || "Gallery image"}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            </div>

                                            {/* Info */}
                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">
                                                        IMG_{String(image.id).padStart(3, "0")}
                                                    </span>
                                                    <span className="font-mono text-[10px] text-gray-600">
                                                        {new Date(image.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                {editingId === image.id ? (
                                                    <div className="flex gap-2 mb-4">
                                                        <input
                                                            type="text"
                                                            value={editCaption}
                                                            onChange={(e) => setEditCaption(e.target.value)}
                                                            className="flex-1 bg-black/50 border border-white/10 text-white px-3 py-2 rounded-lg font-body text-sm focus:outline-none focus:border-primary"
                                                            autoFocus
                                                        />
                                                        <button
                                                            onClick={() => handleUpdateCaption(image.id)}
                                                            className="px-3 py-2 bg-primary text-black rounded-lg font-display font-bold text-xs"
                                                        >
                                                            SAVE
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingId(null)}
                                                            className="px-3 py-2 bg-gray-800 text-white rounded-lg font-display font-bold text-xs"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <p className="text-white font-display font-medium text-lg mb-4 truncate">
                                                        {image.caption || "No caption"}
                                                    </p>
                                                )}

                                                {/* Actions */}
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => {
                                                            setEditingId(image.id);
                                                            setEditCaption(image.caption || "");
                                                        }}
                                                        className="flex-1 py-3 border border-white/10 rounded-xl text-gray-400 font-display font-medium text-xs hover:bg-white hover:text-black transition-colors"
                                                    >
                                                        EDIT
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(image.id)}
                                                        className="flex-1 py-3 border border-white/10 rounded-xl text-red-400 font-display font-medium text-xs hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                                                    >
                                                        DELETE
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                ) : (
                    /* Settings Tab */
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-display text-2xl font-bold text-white">
                                General Settings
                            </h2>
                            <button
                                onClick={handleSaveSettings}
                                disabled={savingSettings}
                                className={`px-6 py-2 font-mono text-sm transition-colors ${savingSettings
                                    ? "bg-gray-700 text-gray-400"
                                    : "bg-accent-green text-black hover:bg-white"
                                    }`}
                            >
                                {savingSettings ? "SAVING..." : "💾 SAVE ALL"}
                            </button>
                        </div>

                        {settings && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Stats Section */}
                                <div className="bg-panel-dark border border-white/10 p-6">
                                    <h3 className="font-display text-lg font-bold text-primary mb-4">
                                        📊 BODY STATS
                                    </h3>
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="text-xs font-mono text-gray-400 mb-1 block">
                                                Age
                                            </label>
                                            <input
                                                type="number"
                                                value={settings.stat_age}
                                                onChange={(e) => updateSettingField("stat_age", e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 text-white px-4 py-2 font-mono text-sm focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-mono text-gray-400 mb-1 block">
                                                Height (CM)
                                            </label>
                                            <input
                                                type="number"
                                                value={settings.stat_height}
                                                onChange={(e) => updateSettingField("stat_height", e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 text-white px-4 py-2 font-mono text-sm focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-mono text-gray-400 mb-1 block">
                                                Weight (KG)
                                            </label>
                                            <input
                                                type="number"
                                                value={settings.stat_weight}
                                                onChange={(e) => updateSettingField("stat_weight", e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 text-white px-4 py-2 font-mono text-sm focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-mono text-gray-400 mb-1 block">
                                                Years of Experience
                                            </label>
                                            <input
                                                type="number"
                                                value={settings.stat_experience}
                                                onChange={(e) => updateSettingField("stat_experience", e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 text-white px-4 py-2 font-mono text-sm focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* General Section */}
                                <div className="bg-panel-dark border border-white/10 p-6">
                                    <h3 className="font-display text-lg font-bold text-primary mb-4">
                                        🌍 GENERAL INFO
                                    </h3>
                                    <div>
                                        <label className="text-xs font-mono text-gray-400 mb-1 block">
                                            Current Location
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.location}
                                            onChange={(e) => updateSettingField("location", e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 text-white px-4 py-2 font-mono text-sm focus:outline-none focus:border-primary"
                                            placeholder="e.g. Lakhnadon, 480886"
                                        />
                                    </div>
                                </div>

                                {/* Social Links Section */}
                                <div className="bg-panel-dark border border-white/10 p-6">
                                    <h3 className="font-display text-lg font-bold text-primary mb-4">
                                        🔗 SOCIAL LINKS
                                    </h3>
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="text-xs font-mono text-gray-400 mb-1 block">
                                                Instagram URL
                                            </label>
                                            <input
                                                type="url"
                                                value={settings.social_instagram}
                                                onChange={(e) => updateSettingField("social_instagram", e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 text-white px-4 py-2 font-mono text-sm focus:outline-none focus:border-primary"
                                                placeholder="https://instagram.com/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-mono text-gray-400 mb-1 block">
                                                WhatsApp Number (with country code)
                                            </label>
                                            <input
                                                type="tel"
                                                value={settings.social_whatsapp}
                                                onChange={(e) => updateSettingField("social_whatsapp", e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 text-white px-4 py-2 font-mono text-sm focus:outline-none focus:border-primary"
                                                placeholder="+91XXXXXXXXXX"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-mono text-gray-400 mb-1 block">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={settings.social_phone}
                                                onChange={(e) => updateSettingField("social_phone", e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 text-white px-4 py-2 font-mono text-sm focus:outline-none focus:border-primary"
                                                placeholder="+91XXXXXXXXXX"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-mono text-gray-400 mb-1 block">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={settings.social_email}
                                                onChange={(e) => updateSettingField("social_email", e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 text-white px-4 py-2 font-mono text-sm focus:outline-none focus:border-primary"
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-mono text-gray-400 mb-1 block">
                                                YouTube URL
                                            </label>
                                            <input
                                                type="url"
                                                value={settings.social_youtube}
                                                onChange={(e) => updateSettingField("social_youtube", e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 text-white px-4 py-2 font-mono text-sm focus:outline-none focus:border-primary"
                                                placeholder="https://youtube.com/..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* About Text Section */}
                                <div className="bg-panel-dark border border-white/10 p-6 lg:col-span-2">
                                    <h3 className="font-display text-lg font-bold text-primary mb-4">
                                        📝 ABOUT / PHILOSOPHY TEXT
                                    </h3>
                                    <p className="font-body text-xs text-gray-500 mb-4">
                                        These lines appear in the Philosophy section.
                                    </p>
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="text-xs font-mono text-gray-400 mb-1 block">
                                                Line 1
                                            </label>
                                            <input
                                                type="text"
                                                value={settings.about_line1}
                                                onChange={(e) => updateSettingField("about_line1", e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 text-white px-4 py-2 font-mono text-sm focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-mono text-gray-400 mb-1 block">
                                                Line 2
                                            </label>
                                            <input
                                                type="text"
                                                value={settings.about_line2}
                                                onChange={(e) => updateSettingField("about_line2", e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 text-white px-4 py-2 font-mono text-sm focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-mono text-gray-400 mb-1 block">
                                                Line 3
                                            </label>
                                            <input
                                                type="text"
                                                value={settings.about_line3}
                                                onChange={(e) => updateSettingField("about_line3", e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 text-white px-4 py-2 font-mono text-sm focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                )}
            </main>

            {/* Delete Confirmation Modal */}
            {deleteConfirm !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-panel-dark border border-red-500/30 p-8 max-w-md clipped-corner">
                        <h3 className="font-display text-xl font-bold text-white mb-4">
                            ⚠ CONFIRM_DELETE
                        </h3>
                        <p className="text-gray-400 font-mono text-sm mb-6">
                            This action cannot be undone. The image will be permanently removed
                            from the database and filesystem.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 py-3 bg-red-500 text-white font-display font-bold hover:bg-red-400 transition-colors"
                            >
                                DELETE
                            </button>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-3 border border-white/20 text-white font-display font-bold hover:bg-white/5 transition-colors"
                            >
                                CANCEL
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
