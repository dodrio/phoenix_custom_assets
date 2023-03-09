// See the Tailwind configuration guide for advanced usage
// https://tailwindcss.com/docs/configuration

const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')
const fs = require('fs')
const path = require('path')

module.exports = {
  content: ['../lib/*/**/*.*ex', './{global,lib,pages}/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['InterVariable', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains MonoVariable', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        brand: '#FD4F00',
        primary: colors.rose,
        neutral: colors.slate,
        info: colors.blue,
        success: colors.green,
        danger: colors.red,
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')({ target: 'legacy' }),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
    // Allows prefixing tailwind classes with LiveView classes to add rules
    // only when LiveView classes are applied, for example:
    //
    //     <div class="phx-click-loading:animate-ping">
    //
    plugin(({ addVariant }) => {
      addVariant('phx-loading', ['.phx-loading&', '.phx-loading &'])
      addVariant('phx-connected', ['.phx-connected&', '.phx-connected &'])
      addVariant('phx-error', ['.phx-error&', '.phx-error &'])
      addVariant('phx-no-feedback', ['.phx-no-feedback&', '.phx-no-feedback &'])
      addVariant('phx-click-loading', ['.phx-click-loading&', '.phx-click-loading &'])
      addVariant('phx-submit-loading', ['.phx-submit-loading&', '.phx-submit-loading &'])
      addVariant('phx-change-loading', ['.phx-change-loading&', '.phx-change-loading &'])
    }),
    // Embeds Hero Icons (https://heroicons.com) into your app.css bundle
    // See your `CoreComponents.icon/1` for more information.
    //
    plugin(function ({ matchComponents, theme }) {
      const iconsDir = path.join(__dirname, '../priv/hero_icons/optimized')
      const values = {}
      const icons = [
        ['', '/24/outline'],
        ['-solid', '/24/solid'],
        ['-mini', '/20/solid'],
      ]
      icons.forEach(([suffix, dir]) => {
        fs.readdirSync(path.join(iconsDir, dir)).map((file) => {
          let name = path.basename(file, '.svg') + suffix
          values[name] = { name, fullPath: path.join(iconsDir, dir, file) }
        })
      })
      matchComponents(
        {
          hero: ({ name, fullPath }) => {
            const content = fs
              .readFileSync(fullPath)
              .toString()
              .replace(/\r?\n|\r/g, '')
            return {
              [`--hero-${name}`]: `url('data:image/svg+xml;utf8,${content}')`,
              '-webkit-mask': `var(--hero-${name})`,
              mask: `var(--hero-${name})`,
              'background-color': 'currentColor',
              'vertical-align': 'middle',
              display: 'inline-block',
              width: theme('spacing.5'),
              height: theme('spacing.5'),
            }
          },
        },
        { values }
      )
    }),
  ],
}
