const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    content: [
      '../lib/**/*.html.eex',
      '../lib/**/*.html.leex',
      '../lib/**/views/**/*.ex',
      '../lib/**/live/**/*.ex',
      './js/**/*.js',
    ],
  },
  theme: {
    container: {
      center: true,
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',

      white: colors.white,
      black: colors.black,

      primary: colors.rose,
      neutral: colors.coolGray,
      info: colors.blue,
      success: colors.green,
      danger: colors.red,
    },
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
