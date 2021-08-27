# PETAL starter for Phoenix 1.5

## Usage

### For umbrella projects

1. Replace your `apps/<app>_web/assets` with `apps/hello_web/assets`:

```sh
$ rm -rf <app>_web/assets
$ svn export \
  https://github.com/c4710n/phx-webpack-example/trunk/apps/hello_web/assets \
  apps/<app>_web/assets
```

> SVN provides `export` function which is useful for copying a sub-directory from a repo.

2. Adjust `config/dev.exs` to setup `watchers`:

```elixir
config :hello, HelloWeb.Endpoint,
  # ...
  watchers: [
    npm: [
      "run",
      "watch",
      cd: # ...
    ]
  ]
```

3. Change option of `Plug.Static`:

```diff
plug Plug.Static,
  # ...
- only: ~w(css fonts images js favicon.ico robots.txt)
+ only: ~w(assets favicon.ico robots.txt)
```

4. Modify layout file:

```diff
- <link phx-track-static rel="stylesheet" href="<%= Routes.static_path(@conn, "/css/app.css") %>"/>
- <script defer phx-track-static type="text/javascript" src="<%= Routes.static_path(@conn, "/js/app.js") %>"></script
+ <link phx-track-static rel="stylesheet" href="<%= Routes.static_path(@conn, "/assets/app.css") %>"/>
+ <script defer phx-track-static type="text/javascript" src="<%= Routes.static_path(@conn, "/assets/app.js") %>"></script>
>
```

### For non-umbrella projects

1. Replace your `assets` with `apps/hello_web/assets`:

```sh
$ rm -rf assets
$ svn export \
  https://github.com/c4710n/phx-webpack-example/trunk/apps/hello_web/assets \
  assets
```

2. Adjust `assets/package.json` in order to fix the path:

```json
// ...

"dependencies": {
  "phoenix": "file:../deps/phoenix",
  "phoenix_html": "file:../deps/phoenix_html",
  "phoenix_live_view": "file:../deps/phoenix_live_view",

// ...
```

3. Adjust `config/dev.exs` to setup `watchers`:

```elixir
config :hello, HelloWeb.Endpoint,
  # ...
  watchers: [
    npm: [
      "run",
      "watch",
      cd: # ...
    ]
  ]
```

4. Change option of `Plug.Static`:

```diff
plug Plug.Static,
  # ...
- only: ~w(css fonts images js favicon.ico robots.txt)
+ only: ~w(assets favicon.ico robots.txt)
```

5. Modify layout file:

```diff
- <link phx-track-static rel="stylesheet" href="<%= Routes.static_path(@conn, "/css/app.css") %>"/>
- <script defer phx-track-static type="text/javascript" src="<%= Routes.static_path(@conn, "/js/app.js") %>"></script
+ <link phx-track-static rel="stylesheet" href="<%= Routes.static_path(@conn, "/assets/app.css") %>"/>
+ <script defer phx-track-static type="text/javascript" src="<%= Routes.static_path(@conn, "/assets/app.js") %>"></script>
```

## License

MIT
