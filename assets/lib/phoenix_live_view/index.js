/* Phoenix Socket and LiveView configuration. */

import { Socket } from 'phoenix'
import { LiveSocket } from 'phoenix_live_view'

import topbar from 'topbar'
import tailwindColors from '../tailwind/colors'

const csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute('content')

// If the Phoenix endpoint is not served on /, you should set `data-base-path` attribute
// on the root template. For example:
//
//   <html data-base-path={get_base_path()}>
//
// The implementation of `get_base_path/0` can be something like:
//
//   defmodule DemoWeb.Layouts do
//     use DemoWeb, :html
//
//     embed_templates "layouts/*"
//
//     # ...
//     defp get_base_path() do
//       :demo
//       |> Application.get_env(DemoWeb.Endpoint)
//       |> get_in([:url, :path])
//       |> then(&(&1 || ""))
//       |> String.trim_trailing("/")
//     end
//   end
//
const basePath = document.querySelector('html').dataset.basePath || ''

const liveSocket = new LiveSocket(`${basePath}/live`, Socket, {
  params: { _csrf_token: csrfToken },
})

const primaryColor = tailwindColors.primary['500']
topbar.config({
  barThickness: 2,
  barColors: { 0: primaryColor },
  shadowColor: 'rgba(0, 0, 0, .3)',
})

// Show progress bar on live navigation and form submits if the results do not appear within 200ms.
window.addEventListener('phx:page-loading-start', (_info) => topbar.show(200))
window.addEventListener('phx:page-loading-stop', (_info) => topbar.hide())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket
