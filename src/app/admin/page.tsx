"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed");
                setLoading(false);
                return;
            }

            router.push("/admin/dashboard");
        } catch {
            setError("Network error. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 text-white relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black via-primary/5 to-black z-0" />

            <div className="w-full max-w-md relative z-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                        <span className="font-display font-bold text-2xl text-white">BP</span>
                    </div>
                    <h1 className="font-display text-4xl font-bold text-white mb-2 tracking-tight">
                        Admin Access
                    </h1>
                    <p className="font-mono text-xs text-gray-500 tracking-widest uppercase">
                        Secure Authentication
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative shadow-2xl">

                    {error && (
                        <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-200 font-medium text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-display font-bold text-gray-400 ml-1 uppercase tracking-wider">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-black/50 border border-white/10 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-primary focus:bg-black/70 transition-all font-body text-base placeholder:text-gray-600"
                                placeholder="name@example.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-display font-bold text-gray-400 ml-1 uppercase tracking-wider">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-black/50 border border-white/10 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-primary focus:bg-black/70 transition-all font-body text-base placeholder:text-gray-600"
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-display font-bold text-sm tracking-wide transition-all uppercase ${loading
                                ? "bg-white/10 text-gray-400 cursor-wait"
                                : "bg-white text-black hover:bg-primary hover:scale-[1.02]"
                                }`}
                        >
                            {loading ? "Authenticating..." : "Sign In"}
                        </button>
                    </form>
                </div>

                {/* Back link */}
                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="font-display text-sm font-medium text-gray-500 hover:text-white transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
