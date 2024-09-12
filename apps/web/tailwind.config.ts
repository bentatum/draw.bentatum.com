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
      backgroundImage: {
        'stripes': 'repeating-linear-gradient(135deg, var(--stripe-color) 0, var(--stripe-color) 5px, transparent 5px, transparent 15px)',
      },
    },
  },
  plugins: [],
};
export default config;
