/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './renderer/**/*.{html,js,ts,tsx}',
    './pages/**/*.{html,js,ts,tsx}',
    './src/**/*.{html,js,ts,tsx}'
  ],
  theme: {
    screens: {
      xs: '375px', // iPhone XS
      sm: '430px', // iPhone 14 Pro Max
      md: '768px', // iPad Mini (vertical orientation)
      lg: '1024px', // iPad Mini (horizontal orientation)
      xl: '1440px', // MacBook 13"
      xxl: '1920px'
    },
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 100 }
        }
      },
      animation: {
        fadeIn: 'fadeIn 200ms ease-in'
      }
    },
  },
  plugins: [],
}

