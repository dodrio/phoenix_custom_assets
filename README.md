# Hello.Umbrella

## Features

- TailwindCSS + Alpine.js
- set [Inter var](https://rsms.me/inter/) as default font
- Webpack 5 + modular configuration, it supports:
  - JS:
    - sourcemap
    - uglify
  - CSS:
    - sourcemap
    - minify
    - autoprefixer
    - nested rules
  - fonts: `eot` / `woff` / `woff2` / `ttf`
  - images: `png` / `jpe?g` / `gif` / `svg`

## Usage

### For umbrella projects

1. Replace your `<app>_web/assets/` with `hello_web/assets/` in this project.
2. Adjust `config/dev.exs` to fit Webpack 5:

```ex
config :hello, HelloWeb.Endpoint,
  # ...
  watchers: [
    node: [
      "node_modules/webpack/bin/webpack.js",
      "--mode",
      "development",
      "--watch",       # Webpack 5
      # ...
```

### For non-umbrella projects

1. Replace your `assets/` with `hello_web/assets/` in this project.

2. Adjust `assets/package.json`:

```json
// ...

"dependencies": {
  "phoenix": "file:../deps/phoenix",
  "phoenix_html": "file:../deps/phoenix_html",
  "phoenix_live_view": "file:../deps/phoenix_live_view",

// ...
```

3. Adjust `config/dev.exs` to fit Webpack 5:

```ex
config :hello, HelloWeb.Endpoint,
  # ...
  watchers: [
    node: [
      "node_modules/webpack/bin/webpack.js",
      "--mode",
      "development",
      "--watch",       # Webpack 5
      # ...
```

## License

MIT
