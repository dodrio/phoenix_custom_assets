# This file is responsible for configuring your umbrella
# and **all applications** and their dependencies with the
# help of Mix.Config.
#
# Note that all applications in your umbrella share the
# same configuration and dependencies, which is why they
# all use the same configuration file. If you want different
# configurations or dependencies per app, it is best to
# move said applications out of the umbrella.
use Mix.Config



config :hello_web,
  generators: [context_app: :hello]

# Configures the endpoint
config :hello_web, HelloWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "/76+NU7H+Tes1y5wRHSFerCLE4otdv/XZi9pElNOju6xNrfU7jYZ1GJBPfP+ZU+V",
  render_errors: [view: HelloWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: Hello.PubSub,
  live_view: [signing_salt: "pwHfP3aw"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
