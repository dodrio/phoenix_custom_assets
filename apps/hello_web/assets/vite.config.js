import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import mergeOptions from 'merge-options'

import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from './tailwind.config.cjs'

import pcImport from 'postcss-import'
import pcAutoprefixer from 'autoprefixer'
import pcTailwindcss from 'tailwindcss'
import pcTailwindcssNesting from 'tailwindcss/nesting'

const {
  theme: { colors: tailwindColors },
} = resolveConfig(tailwindConfig)

const outDir = '../priv/static'
const assetsDir = 'assets'

export default defineConfig(({ command, mode }) => {
  if (!['build'].includes(command)) {
    throw 'only following command are supported: build'
  }

  if (!['production', 'development'].includes(mode)) {
    throw 'only following mode are supported: production, development'
  }

  const isProduction = mode === 'production'
  const isDevelopment = mode === 'development'

  if (isDevelopment) {
    // terminate the watcher of Vite when Phoenix quits
    process.stdin.on('close', () => {
      process.exit(0)
    })

    process.stdin.resume()
  }

  const copyPublicOptions = {
    publicDir: 'public',
    build: {
      copyPublicDir: true,
    },
  }

  const buildTargetOptions = isProduction
    ? {
        plugins: [
          legacy({
            targets: ['defaults', '> 0.25%', 'not dead', 'not IE 11'],
          }),
        ],

        build: {
          target: undefined,
        },
      }
    : {
        build: {
          target: 'es2015',
        },
      }

  const minifyOptions = isProduction
    ? {
        build: {
          sourcemap: false,
          minify: true,
        },
      }
    : {
        build: {
          sourcemap: true,
          minify: false,
        },
      }

  const defaultOptions = {
    appType: 'custom',
    resolve: {
      extensions: ['.js', '.css'],
    },

    // prevent clearing the terminal screen when logging certain messages
    clearScreen: false,

    css: {
      postcss: {
        plugins: [pcImport, pcTailwindcssNesting, pcTailwindcss, pcAutoprefixer],
      },
    },

    build: {
      outDir: outDir,
      emptyOutDir: false,

      // Polfyill module preloading
      modulePreload: { polyfill: true },

      // Don't generate a manifest file
      // Phoenix has its own mechanism for generating cache manifest files.
      manifest: false,

      // Specify the directory to nest generated assets under build.outDir.
      assetsDir: assetsDir,

      // Disable inline assets
      assetsInlineLimit: 0,

      rollupOptions: {
        input: {
          app: 'app.html',
        },
        output: {
          intro: `window.TAILWIND_COLORS = ${JSON.stringify(tailwindColors)}`,
          entryFileNames: `${assetsDir}/[name].js`,
          chunkFileNames: `${assetsDir}/[name].js`,
          assetFileNames: `${assetsDir}/[name][extname]`,
        },
      },
    },
  }

  return mergeOptions(defaultOptions, copyPublicOptions, buildTargetOptions, minifyOptions)
})
