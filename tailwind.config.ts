import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1F2B49",
          dark: "#141B2E",
          light: "#3D4D78",
          tint: "#E1E7F4",
        },
        accent: {
          DEFAULT: "#BD6B3B",
          dark: "#9A5429",
          tint: "#F6DDC4",
        },
        stone: {
          25: "#FAFAF8",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        crisp: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
        card: "0 1px 3px 0 rgb(31 27 20 / 0.06), 0 1px 2px -1px rgb(31 27 20 / 0.04)",
        glass: "0 1px 1px 0 rgb(255 255 255 / 0.6) inset, 0 12px 32px -8px rgb(31 27 20 / 0.12), 0 2px 8px -2px rgb(31 27 20 / 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
