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
        background: '#F7EEE7',
        secondary: '#FFF9F4',
        card: '#FFFDFC',
        softRose: '#F3E0E3',
        deepBurgundy: '#7A1235',
        darkBurgundy: '#5E0D28',
        champagneGold: '#D4A64A',
        softGold: '#E7C77D',
        text: '#241A20',
        muted: '#75686B',
        border: '#E7D5C7',
        success: '#5D7A61',
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"DM Serif Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};
