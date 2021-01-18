// destination directory relative to current file.
const DEST_DIR = '../priv/static'
// public path for serving static files in destination directory.
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
const srcStatic = resolveSrc('static/')
const destRoot = resolveDest('./')
const destJS = resolveDest('js/')
const destCSS = resolveDest('css/')
const destFont = resolveDest('fonts/')
const destImage = resolveDest('images/')
const publicFont = path.join(PUBLIC_PATH, path.relative(destRoot, destFont))
const publicImage = path.join(PUBLIC_PATH, path.relative(destRoot, destImage))

function resolveSrc(relativePath = '') {
  const root = path.resolve(__dirname)
  const absPath = path.join(root, relativePath)
  return absPath
}

function resolveDest(relativePath = '') {
  const root = path.resolve(__dirname, DEST_DIR)
  const absPath = path.join(root, relativePath)
  return absPath
}

// Webpack Configurations
module.exports = (_env, { mode }) => {
  const isProd = mode === 'production'

  if (isProd) {
    // required for purge option of TailwindCSS.
    process.env.NODE_ENV = mode
  }

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
      path: destJS,
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
        filename: path.join(path.relative(destJS, destCSS), '[name].css'),
      }),
    ],
    optimization: {
      minimizer: [
        new CssMinimizerPlugin({
          sourceMap: true,
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
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: path.relative(destJS, destFont),
                publicPath: publicFont,
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
                outputPath: path.relative(destJS, destImage),
                publicPath: publicImage,
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
        patterns: [{ from: srcStatic, to: destRoot }],
      }),
    ],
  }
}
