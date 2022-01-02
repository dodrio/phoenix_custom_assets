// output directory relative to current file.
const OUTPUT_ROOT_DIR = '../priv/static/'
const OUTPUT_BUNDLE_DIR = 'assets'
// public path for serving static files in output directory.
const PUBLIC_PATH = `/${OUTPUT_BUNDLE_DIR}/`

const path = require('path')
const glob = require('glob')

// Webpack
const { merge } = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { checkModules, buildExcludeRegexp } = require('are-you-es5')

// PostCSS
const pcImport = require('postcss-import')
const pcAutoprefixer = require('autoprefixer')

// TailwindCSS
const tailwindcss = require('tailwindcss')
const tailwindcssNesting = require('tailwindcss/nesting')

// Locations
const staticRoot = resolveOutput('./')
const outputBundle = resolveOutput(OUTPUT_BUNDLE_DIR)

function resolveSrc(relativePath = '') {
  const root = path.resolve(__dirname)
  const absPath = path.join(root, relativePath)
  return absPath
}

function resolveOutput(relativePath = '') {
  const root = path.resolve(__dirname, OUTPUT_ROOT_DIR)
  const absPath = path.join(root, relativePath)
  return absPath
}

// Webpack Configurations
module.exports = (_env, { mode }) => {
  // setup env according mode
  // required by jit option and purge option of TailwindCSS.
  process.env.NODE_ENV = mode

  const isProd = mode === 'production'
  return merge([
    cleanup(),
    loadJS(isProd),
    loadCSS(),
    loadFont(),
    loadImage(),
    copyStatic(),
  ])
}

function loadJS(isProd) {
  const depsAnalysis = checkModules({
    path: '', // Automatically find up package.json from cwd
    checkAllNodeModules: true,
    ignoreBabelAndWebpackPackages: true,
  })

  // Build a regexp for Webpack exclude option.
  // This regexp represents all modules in node_modules/ excluding es6 modules.
  // With `exclude` option provided by Webpack, all es6 modules will be transpiled.
  const es5Modules = buildExcludeRegexp(depsAnalysis.es6Modules)

  return {
    resolve: {
      extensions: ['.js'],
    },
    entry: {
      app: [].concat(
        resolveSrc('index.js'),
        glob.sync(resolveSrc('vendor/**/*.js'))
      ),
    },
    output: {
      filename: '[name].js',
      path: outputBundle,
      publicPath: PUBLIC_PATH,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: es5Modules,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
    devtool: isProd ? 'nosources-source-map' : 'eval-cheap-module-source-map',
    optimization: {
      minimizer: [
        new TerserPlugin({
          parallel: true,
          extractComments: false,
          terserOptions: {
            sourceMap: true,
            format: {
              comments: false,
            },
          },
        }),
      ],
    },
  }
}

function loadCSS() {
  const pcPlugins = [pcImport, tailwindcssNesting, tailwindcss, pcAutoprefixer]

  return {
    resolve: {
      extensions: ['.css'],
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCSSExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 1,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                postcssOptions: {
                  ident: 'postcss',
                  plugins: pcPlugins,
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCSSExtractPlugin({
        filename: '[name].css',
      }),
    ],
    optimization: {
      minimizer: [
        // + no need to configure sourcemap, it will be setup according to `devtool` option.
        // + all comments in CSS will be removed.
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
              },
            ],
          },
        }),
      ],
    },
  }
}

function loadFont() {
  return {
    module: {
      rules: [
        {
          test: /\.(eot|woff|woff2|ttf)$/,
          type: 'asset/resource',
          generator: {
            filename: '[name]-[hash:8][ext][query]',
          },
        },
      ],
    },
  }
}

function loadImage() {
  return {
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          type: 'asset/resource',
          generator: {
            filename: '[name]-[hash:8][ext][query]',
          },
        },
      ],
    },
  }
}

function copyStatic() {
  return {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [{ from: resolveSrc('static/'), to: staticRoot }],
      }),
    ],
  }
}

function cleanup() {
  return {
    plugins: [new CleanWebpackPlugin()],
  }
}
