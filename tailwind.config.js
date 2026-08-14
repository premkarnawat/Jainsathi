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
        background: '#FFFDF8',
        surface: '#FFFFFF',
        surfaceWarm: '#FFF9F2',
        cream: '#F8EFE5',
        blush: '#F5E4E0',
        burgundy: '#8B163A',
        deepBurgundy: '#6D1733',
        gold: '#D4A54A',
        softGold: '#E7C982',
        text: '#2D2025',
        muted: '#766B70',
        border: '#EDE1D7',
        success: '#5D7A61',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
