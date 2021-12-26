{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/856672f2ce37f47b69c31c448fb6e30f39761e66.tar.gz") { } }:

with pkgs;

mkShell {
  buildInputs = [
    beam.packages.erlangR24.elixir_1_13
    nodejs-16_x
  ]
  ++ lib.optionals stdenv.isLinux [
    # For ExUnit Notifier on Linux
    libnotify

    # For file_system on Linux
    inotify-tools
  ]
  ++ lib.optionals stdenv.isDarwin ([
    # For ExUnit Notifier on macOS
    terminal-notifier

    # For file_system on macOS
    darwin.apple_sdk.frameworks.CoreFoundation
    darwin.apple_sdk.frameworks.CoreServices
  ]);
}
