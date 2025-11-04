import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./(feature)/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                border: "var(--color-border)",
                input: "var(--color-input)",
                ring: "var(--color-ring)",
                background: "var(--color-background)",
                foreground: "var(--color-foreground)",
                primary: {
                    DEFAULT: "var(--color-primary)",
                    foreground: "var(--color-primary-foreground)",
                },
                secondary: {
                    DEFAULT: "var(--color-secondary)",
                    foreground: "var(--color-secondary-foreground)",
                },
                destructive: {
                    DEFAULT: "var(--color-destructive)",
                    foreground: "var(--color-destructive-foreground)",
                },
                muted: {
                    DEFAULT: "var(--color-muted)",
                    foreground: "var(--color-muted-foreground)",
                },
                accent: {
                    DEFAULT: "var(--color-accent)",
                    foreground: "var(--color-accent-foreground)",
                },
                popover: {
                    DEFAULT: "var(--color-popover)",
                    foreground: "var(--color-popover-foreground)",
                },
                card: {
                    DEFAULT: "var(--color-card)",
                    foreground: "var(--color-card-foreground)",
                },
                gold: "var(--color-gold)",
                "gold-light": "var(--color-gold-light)",
                bronze: "var(--color-bronze)",
                copper: "#b87333",
                "copper-light": "#cd9a5b",
                cyan: "#4a90a4",
                "navy-dark": "var(--navy-dark)",
                "navy-deepest": "#000000",
                "navy-darker": "#0a0a0f",
                "navy-main": "#0a0a1a",
                "navy-medium": "#1a1a2e",
                "navy-card": "#1a1a2e",
                "navy-secondary": "#2d2d4a",
                "navy-accent": "#3a3a5a",
                "gradient-start": "#f8fafc",
                "gradient-mid": "#e2e8f0",
                "gradient-end": "#cbd5e1",
                // 強制的な文字色設定
                "text-light": "#0f172a",
                "text-dark": "#ffffff",
            },
            fontFamily: {
                sans: ["Roboto", "Noto Sans JP", "var(--font-geist-sans)", "system-ui", "sans-serif"],
                serif: ["Playfair Display", "Noto Serif JP", "Georgia", "serif"],
                mono: ["var(--font-geist-mono)", "monospace"],
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-in-out",
                "slide-up": "slideUp 0.3s ease-out",
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "aria-float": "ariaFloat 3s ease-in-out infinite",
                "aria-pulse": "ariaPulse 2s ease-in-out infinite",
                "aria-glow": "ariaGlow 2.5s ease-in-out infinite",
                "aria-rotate": "ariaRotate 8s linear infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { transform: "translateY(10px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                ariaFloat: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-6px)" },
                },
                ariaPulse: {
                    "0%, 100%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.05)" },
                },
                ariaGlow: {
                    "0%, 100%": { 
                        filter: "drop-shadow(0 0 8px rgba(245, 158, 11, 0.4))",
                    },
                    "50%": { 
                        filter: "drop-shadow(0 0 16px rgba(245, 158, 11, 0.8))",
                    },
                },
                ariaRotate: {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                },
            },
        },
    },
    plugins: [],
};

export default config;