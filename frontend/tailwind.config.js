/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        surface: "#111113",
        elevated: "#17181b",
        border: "rgba(255,255,255,0.08)",
        red: {
          DEFAULT: "#FF2D3A",
          dark: "#E01E2B",
        },
        accent: {
          green: "#22E06B",
        },
      },
      fontFamily: {
        display: ["Anton", "Arial Black", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest2: "-0.02em",
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
