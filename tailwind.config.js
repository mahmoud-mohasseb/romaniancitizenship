/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
        latin: ['"Plus Jakarta Sans"', 'Outfit', 'Inter', 'sans-serif'],
        ro: ['"Plus Jakarta Sans"', 'Outfit', 'sans-serif'],
        en: ['"Plus Jakarta Sans"', 'Outfit', 'sans-serif'],
      },
      colors: {
        background: '#0F172A',
        card: '#1E293B',
        accentRed: '#E94560',
        accentGreen: '#4ECCA3',
        accentYellow: '#FFB800',
      },
    },
  },
  plugins: [],
}
