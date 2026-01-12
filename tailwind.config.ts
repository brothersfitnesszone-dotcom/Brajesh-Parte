import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#00ffff",
                "accent-magenta": "#ff00ff",
                "accent-green": "#00ff00",
                "background-dark": "#0a0a0a",
                "panel-dark": "#0f1214",
            },
            fontFamily: {
                display: ["var(--font-outfit)", "Space Grotesk", "sans-serif"],
                body: ["var(--font-inter)", "Inter", "sans-serif"],
            },
            boxShadow: {
                "neon-cyan": "0 0 5px #00ffff, 0 0 20px #00ffff",
                "neon-magenta": "0 0 5px #ff00ff, 0 0 20px #ff00ff",
                "neon-green": "0 0 5px #00ff00, 0 0 20px #00ff00",
            },
            animation: {
                "glitch": "glitch 2.5s infinite linear alternate-reverse",
                "glitch-2": "glitch-2 3s infinite linear alternate-reverse",
                "scanline": "scanline 10s linear infinite",
                "blink": "blink 1s step-end infinite",
                "shimmer": "shimmer 2s infinite",
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
            keyframes: {
                glitch: {
                    "0%": { clipPath: "inset(14px 0 121px 0)" },
                    "20%": { clipPath: "inset(69px 0 83px 0)" },
                    "40%": { clipPath: "inset(2px 0 10px 0)" },
                    "60%": { clipPath: "inset(104px 0 4px 0)" },
                    "80%": { clipPath: "inset(44px 0 62px 0)" },
                    "100%": { clipPath: "inset(28px 0 102px 0)" },
                },
                "glitch-2": {
                    "0%": { clipPath: "inset(122px 0 3px 0)" },
                    "20%": { clipPath: "inset(54px 0 100px 0)" },
                    "40%": { clipPath: "inset(14px 0 58px 0)" },
                    "60%": { clipPath: "inset(82px 0 2px 0)" },
                    "80%": { clipPath: "inset(4px 0 140px 0)" },
                    "100%": { clipPath: "inset(32px 0 92px 0)" },
                },
                scanline: {
                    "0%": { transform: "translateY(0)" },
                    "100%": { transform: "translateY(100vh)" },
                },
                blink: {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0" },
                },
                shimmer: {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(200%)" },
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
