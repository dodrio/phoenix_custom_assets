{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/7d4c10b963dc6823c490aa01ef677454637e3ea3.tar.gz") { } }:

with pkgs;

mkShell {
  buildInputs = [
    beam.packages.erlangR25.elixir_1_14
    nodejs-18_x
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
