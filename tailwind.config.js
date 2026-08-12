/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        midnightPlum: '#100A18',
        deepBurgundy: '#6E1231',
        ruby: '#9E183A',
        warmGold: '#D6A24A',
        champagne: '#F3D59B',
        ivory: '#FFF9F1',
        warmCream: '#F8F1E8',
        softRose: '#F8E8EA',
        textDark: '#241A20',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
