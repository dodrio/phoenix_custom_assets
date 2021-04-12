import 'phoenix_html'

import { Socket } from 'phoenix'
import { LiveSocket } from 'phoenix_live_view'

import Alpine from 'alpinejs'

import topbar from 'topbar'
import tailwindConfig from '../tailwind.config'

const csrfToken = document
  .querySelector("meta[name='csrf-token']")
  .getAttribute('content')

const liveSocket = new LiveSocket('/live', Socket, {
  params: { _csrf_token: csrfToken },
  // https://dockyard.com/blog/2020/12/21/optimizing-user-experience-with-liveview
  dom: {
    onBeforeElUpdated(from, to) {
      if (from.__x) {
        Alpine.clone(from.__x, to)
      }
    },
  },
})

// Show progress bar on live navigation and form submits
const primaryColor = tailwindConfig.theme.colors.primary['500']
topbar.config({
  barThickness: 2,
  barColors: { 0: primaryColor },
  shadowColor: 'rgba(0, 0, 0, .3)',
})
window.addEventListener('phx:page-loading-start', (info) => topbar.show())
window.addEventListener('phx:page-loading-stop', (info) => topbar.hide())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket
