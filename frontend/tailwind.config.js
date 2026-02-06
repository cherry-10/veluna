/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F5F1ED',
          dark: '#E8E0D8',
        },
        brown: {
          DEFAULT: '#9B7E6B',
          light: '#B39484',
          dark: '#7D6555',
        },
        beige: {
          DEFAULT: '#E8DFD6',
          light: '#F0EBE5',
        },
        charcoal: {
          DEFAULT: '#4A4A4A',
          light: '#6B6B6B',
        },
        gold: {
          DEFAULT: '#C4A57B',
          light: '#D4B88E',
          dark: '#B08F63',
        },
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
        dancing: ['Dancing Script', 'cursive'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.4' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['0.9375rem', { lineHeight: '1.6' }],
        'lg': ['1.0625rem', { lineHeight: '1.6' }],
        'xl': ['1.1875rem', { lineHeight: '1.5' }],
        '2xl': ['1.375rem', { lineHeight: '1.4' }],
        '3xl': ['1.75rem', { lineHeight: '1.3' }],
        '4xl': ['2.125rem', { lineHeight: '1.2' }],
        '5xl': ['2.75rem', { lineHeight: '1.1' }],
      },
      borderRadius: {
        'veluna': '6px',
      },
      boxShadow: {
        'veluna': '0 2px 8px rgba(122, 92, 71, 0.08)',
        'veluna-lg': '0 4px 16px rgba(122, 92, 71, 0.12)',
        'elegant': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
