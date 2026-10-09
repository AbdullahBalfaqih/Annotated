/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#090d16",
        panel: "rgba(13, 17, 26, 0.96)",
        royal: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        cairo: ["Cairo", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      animation: {
        'pulse-glow': 'pulseGlow 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        pulseGlow: {
          '0%': { opacity: '0.4' },
          '100%': { opacity: '1', transform: 'scale(1.15)' },
        }
      }
    },
  },
  plugins: [],
};
