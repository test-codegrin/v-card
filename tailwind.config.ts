import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{css,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E11D48",
        secondary: "#0B0F19",
        surface: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#0B0F19"
        }
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        pill: "999px"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)",
        "glass-lg": "0 30px 80px rgba(0,0,0,0.35)",
        "card-hover": "0 18px 40px rgba(0,0,0,0.18)"
      },
      backgroundImage: {
        "hero-radial": "radial-gradient(circle at 20% 20%, rgba(225,29,72,0.18), transparent 35%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.08), transparent 25%)",
        "section-grid": "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)"
      },
      animation: {
        "float-slow": "float 12s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" }
        }
      },
      fontSize: {
        "display-2": ["3.5rem", { lineHeight: "1" }],
        "display-3": ["4rem", { lineHeight: "1" }]
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1.25rem",
          md: "2rem",
          xl: "3rem"
        }
      }
    }
  },
  plugins: []
};

export default config;
