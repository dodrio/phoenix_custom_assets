import { defineConfig } from 'vite'

import pcImport from 'postcss-import'
import pcAutoprefixer from 'autoprefixer'
import pcTailwindcss from 'tailwindcss'
import pcTailwindcssNesting from 'tailwindcss/nesting'

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

  return {
    appType: 'custom',
    publicDir: 'static',
    resolve: {
      extensions: ['.js', '.css'],
    },
    clearScreen: false,

    css: {
      postcss: {
        plugins: [pcImport, pcTailwindcssNesting, pcTailwindcss, pcAutoprefixer],
      },
    },

    build: {
      outDir: '../priv/static',
      emptyOutDir: true,
      assetsDir: 'assets',

      // Target
      target: 'es2015',

      // Polfyill module preloading
      modulePreload: { polyfill: true },

      // Don't generate a manifest file
      // Phoenix has its own mechanism for generating cache manifest files.
      manifest: false,

      // Enable sourcemap for development only
      sourcemap: isDevelopment,

      // Enable minification for production only
      minify: isProduction,

      // Disable inline assets
      assetsInlineLimit: 0,

      // Enable copying public directory
      copyPublicDir: true,

      rollupOptions: {
        input: {
          app: 'app.html',
        },
        output: {
          // remove hash
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name][extname]',
        },
      },
    },
  }
})
