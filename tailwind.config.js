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
    fontSize: {
      sm: '0.75rem', //                                    12px
      base: ['1rem', {lineHeight: '1.2rem'}], //           16px (line height - 19px)
      lg: ['1.25rem', {lineHeight: '1.5rem'}], //          20px (line height - 24px)
      '2lg': ['1.375rem', {lineHeight: '1.625rem'}], //    22px (line height - 26px)
      xl: ['1.75rem', {lineHeight: '2.06rem'}], //         28px (line height - 33px)
      '2xl': ['2rem', {lineHeight: '2.375rem'}], //        32px (line height - 38px)
      '3xl': ['2.625rem', {lineHeight: '3.06rem'}], //     42px (line height - 49px)
      '4xl': ['3.25rem', {lineHeight: '3.875rem'}], //     52px (line height - 62px)
      '5xl': ['4.5rem'], //                                72px
      '6xl': ['5.625rem', {lineHeight: '6.625rem'}], //    90xp (line height - 106px)
      '7xl': ['10rem'] //                                  160px
    },
    extend: {
      colors: {
        bg: {
          light: '#DDE6ED',
          DEFAULT: '#DDE6ED',
          dark: '#161717',
          overlay: 'rgba(42, 46, 50, 0.5)'
        },
        accent: '#202122',
        hoverButton: '#2D2D2E',
        textPrimary: '#F4F4FF',
        textSecondary: '#808181',
        lightGrey: 'rgba(255, 255, 255, 0.3)',
        orange: '#EC8B00',
        error: {
          light: '#202122',
          DEFAULT: '#DB1047',
          dark: '#EC8B00',
        },
        success: '#013A71'
      },
      fontFamily: {
        sans: ['Raleway', 'sans-serif'],
      },
      backgroundImage: {
        lightImage: "url('/public/assets/img/Terra_BG_light.svg')",
        lightImageMobile: "url('/public/assets/img/Terra_BG_light_mobile.svg')",
        darkImage: "url('/public/assets/img/Terra_BG_dark.svg')",
        darkImageMobile: "url('/public/assets/img/Terra_BG_dark_mobile.svg')",
      },
      spacing: {
        15: '3.75rem',
        17: '4.75rem',
        18: '4.5rem',
        30: '7.5rem',
        208: '52rem',
      },
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

