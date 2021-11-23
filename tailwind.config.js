module.exports = {
  purge: {
    enabled: true
  },
  prefix: 'tw-',
  important: false,
  separator: ':',
  theme: {
    screens: {
      375: '375px',
      sm: '480px',
      600: '600px',
      md: '768px',
      lg: '1024px',
      xl: '1440px'
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#333333',
      darkest: '#050505',
      white: '#fff',
      gray: {
        100: '#f9f9f9',
        200: '#f1f1f1',
        300: '#dedede',
        400: '#bcbcbc',
        500: '#707070',
        600: '#555555',
        700: '#252525'
      },
      blue: {
        100: '#9eccfa',
        200: '#6eb3f7',
        300: '#3d99f5',
        400: '#0d80f2',
        500: '#0b70d5'
      },
      error: '#e90000'
    },
    fontWeights: {
      hairline: 100,
      thin: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900
    },
    spacing: {
      px: '1px',
      0: '0px',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
      14: '56px',
      16: '64px',
      18: '72px',
      20: '80px',
      24: '96px',
      32: '126px',
      40: '160px',
      48: '192px',
      56: '224px',
      64: '256px'
    },
    borderColor: theme => ({
      ...theme('colors'),
      DEFAULT: theme('colors.gray.300', 'currentColor')
    }),
    borderOpacity: theme => theme('opacity'),
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      DEFAULT: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      full: '9999px'
    },
    borderWidth: {
      DEFAULT: '1px',
      0: '0',
      2: '2px',
      4: '4px',
      8: '8px'
    },
    boxShadow: {
      DEFAULT: '0 2px 8px 0 rgba(51, 51, 51, 0.05)',
      none: 'none',
      heavy: '0px 2px 8px 0px rgba(51, 51, 51, 0.25)',
      round: '0px 1px 4px 0px rgba(51, 51, 51, 0.1)',
      hover: '0px 8px 16px 0px rgba(51, 51, 51, 0.2)'
    },
    opacity: {
      0: '0',
      25: '0.25',
      50: '0.5',
      75: '0.75',
      100: '1'
    },
    fontFamily: {
      sans: ['PT Mono', 'monospace'],
      monospace: ['PT Mono', 'monospace'],
      main: ['Roboto', 'sans-serif']
    },
    fontSize: {
      xs: '0.6875rem', // 11px
      sm: '0.8125rem', // 13px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '2rem', // 32px
      '4xl': '2.5rem', // 40px
      '5xl': '3rem', // 48px
      '6xl': '4rem' // 64px
    }
  },
  corePlugins: {},
  plugins: []
}
