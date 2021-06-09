// output directory relative to current file.
const OUTPUT_DIR = '../priv/static'
// public path for serving static files in output directory.
const PUBLIC_PATH = '/'

const path = require('path')
const glob = require('glob')

// Webpack
const { merge } = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

// PostCSS
const pcImport = require('postcss-import')
const pcNested = require('postcss-nested')
const pcAutoprefixer = require('autoprefixer')

// TailwindCSS
const tailwindcss = require('tailwindcss')

// Locations
const outputRoot = resolveOutput('./')
const outputJS = resolveOutput('js/')
const outputCSS = resolveOutput('css/')
const outputFont = resolveOutput('fonts/')
const outputImage = resolveOutput('images/')

function resolveSrc(relativePath = '') {
  const root = path.resolve(__dirname)
  const absPath = path.join(root, relativePath)
  return absPath
}

function resolveOutput(relativePath = '') {
  const root = path.resolve(__dirname, OUTPUT_DIR)
  const absPath = path.join(root, relativePath)
  return absPath
}

function resolvePublic(outputPath) {
  return path.join(PUBLIC_PATH, path.relative(outputRoot, outputPath))
}

// Webpack Configurations
module.exports = (_env, { mode }) => {
  // setup env according mode
  // required by jit option and purge option of TailwindCSS.
  process.env.NODE_ENV = mode

  const isProd = mode === 'production'
  return merge([
    loadJS(isProd),
    loadCSS(),
    loadFont(),
    loadImage(),
    copyStatic(),
  ])
}

function loadJS(isProd) {
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
      path: outputJS,
      publicPath: PUBLIC_PATH,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
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
          terserOptions: { sourceMap: true },
          parallel: true,
        }),
      ],
    },
  }
}

function loadCSS() {
  const pcPlugins = [pcImport, tailwindcss, pcNested, pcAutoprefixer]

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
        filename: path.join(path.relative(outputJS, outputCSS), '[name].css'),
      }),
    ],
    optimization: {
      minimizer: [
        // no need to configure sourcemap, it will be setup according to `devtool` option.
        new CssMinimizerPlugin(),
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
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: path.relative(outputJS, outputFont),
                publicPath: resolvePublic(outputFont),
              },
            },
          ],
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
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: path.relative(outputJS, outputImage),
                publicPath: resolvePublic(outputImage),
              },
            },
          ],
        },
      ],
    },
  }
}

function copyStatic() {
  return {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [{ from: resolveSrc('static/'), to: outputRoot }],
      }),
    ],
  }
}
