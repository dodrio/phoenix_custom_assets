/* Phoenix Socket and LiveView configuration. */

import { Socket } from 'phoenix'
import { LiveSocket } from 'phoenix_live_view'

import topbar from 'topbar'
import tailwindConfig from '../tailwind/config'

const csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute('content')

const liveSocket = new LiveSocket('/live', Socket, {
  params: { _csrf_token: csrfToken },
  // https://hexdocs.pm/phoenix_live_view/js-interop.html#client-hooks-via-phx-hook
  // https://github.com/livewire/livewire/blob/a4ffb135693e7982e5b982ca203f5dc7a7ae1126/js/component/SupportAlpine.js#L291
  dom: {
    onBeforeElUpdated(from, to) {
      // Alpine.js v3
      if (window.Alpine && from._x_dataStack) {
        window.Alpine.clone(from, to)
      }
    },
  },
})

// Show progress bar on live navigation and form submits if the results do not
// appear within 200ms.
const primaryColor = tailwindConfig.theme.colors.primary['500']
topbar.config({
  barThickness: 2,
  barColors: { 0: primaryColor },
  shadowColor: 'rgba(0, 0, 0, .3)',
})

let topBarScheduled = undefined

window.addEventListener('phx:page-loading-start', (_info) => {
  if (!topBarScheduled) {
    topBarScheduled = setTimeout(() => topbar.show(), 200)
  }
})

window.addEventListener('phx:page-loading-stop', (_info) => {
  clearTimeout(topBarScheduled)
  topBarScheduled = undefined
  topbar.hide()
})

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket
