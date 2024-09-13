import type { Config } from "tailwindcss";
import { zinc } from "tailwindcss/colors";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gray: zinc,
      },
    },
    fontFamily: {
      sans: ['var(--font-inter)', 'Arial', 'Helvetica', 'sans-serif'],
    },
  },
  plugins: [],
};
export default config;
