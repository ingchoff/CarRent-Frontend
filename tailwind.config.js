module.exports = {
  important: true,
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-lighten': 'var(--color-primary-lighten)',
        secondary: 'var(--color-secondary)',
        'secondary-lighten': 'var(--color-secondary-lighten)',
        success: 'var(--color-success)',
        'success-lighten': 'var(--color-success-lighten)',
        error: 'var(--color-error)',
        'error-lighten': 'var(--color-error-lighten)',
        warning: 'var(--color-warning)',
        'warning-lighten': 'var(--color-warning-lighten)',
        blueGray: 'var(--color-blueGray)',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        fade: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slide: {
          '0%': { transform: 'translateX(100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        'slide-y': {
          '0%': { transform: 'translateY(-16px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        scale: {
          '0%': { transform: 'scale(.75)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        fade: 'fade 1s ease-in-out 1',
        slide: 'slide 0.3s ease-in-out 1',
        'slide-y': 'slide-y 0.3s ease-in-out 1',
        scale: 'scale 0.3s ease-in-out 1',
      },
    },
    container: {
      center: true,
      align: 'left',
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
