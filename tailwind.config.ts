import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",     // Jika pakai folder src
    "./app/**/*.{js,ts,jsx,tsx,mdx}",     // Jika app ada di root (Next.js default)
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",   // Jika masih pakai pages router
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Jika components ada di root
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: '#317C74',
        secondary: '#FFA102',
        auxiliary: '#FF8156',
        neutral: '#4B4B4B',
        danger: '#F64C4C',
        warning: '#FFAD0D',
        success: '#47B881',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
