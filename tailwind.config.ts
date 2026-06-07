import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./themes/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        'tablet': '768px',
        'desktop': '1280px',
        'desktop1920': '1921px',
      },
      colors: {
        primary: "var(--color-primary)",
        primaryhover: "color-mix(in srgb, var(--color-primary), black 20%)",
        secondary: "var(--color-secondary)",
        accent: "#2196F3",
        // Semantic POS status colors
        success: "#16A34A",
        warning: "#D97706",
        danger: "#DC2626",
        highlight: "#F59E0B",
        // Legacy supporting colors (kept for backward compat)
        supporting1: "#AB47BC",
        supporting2: "#9FCC2E",
        supporting3: "#FA9F1B",
        bgred: "#FF0000"
      },
      backgroundColor: {
        card: "var(--card-bg)",
        input: "var(--input-bg)",
        hover: "var(--hover-bg)",
      },
      borderColor: {
        DEFAULT: "var(--border-color)",
        input: "var(--input-border)",
      },
      textColor: {
        DEFAULT: "var(--text-color)",
      },
      animation: {
        'slide-up': 'slide-up-fade 0.25s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in-anim 0.2s ease both',
      },
      keyframes: {
        'slide-up-fade': {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'fade-in-anim': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
