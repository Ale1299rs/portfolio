import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1240px",
      },
    },
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-2": "rgb(var(--accent-2) / <alpha-value>)",
        "accent-fg": "rgb(var(--accent-fg) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 6vw + 1rem, 5.5rem)", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        "display-lg": ["clamp(2.25rem, 4vw + 1rem, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-md": ["clamp(1.75rem, 2.5vw + 1rem, 2.75rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      boxShadow: {
        soft: "0 1px 2px rgb(0 0 0 / 0.04), 0 8px 24px rgb(0 0 0 / 0.06)",
        glow: "0 0 0 1px rgb(var(--accent) / 0.25), 0 10px 40px -10px rgb(var(--accent) / 0.35)",
      },
      backgroundImage: {
        "grid-light":
          "linear-gradient(rgb(0 0 0 / 0.04) 1px, transparent 1px), linear-gradient(90deg, rgb(0 0 0 / 0.04) 1px, transparent 1px)",
        "grid-dark":
          "linear-gradient(rgb(255 255 255 / 0.06) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.06) 1px, transparent 1px)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        shimmer: "shimmer 2.2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
