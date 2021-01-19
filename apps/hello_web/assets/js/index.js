import 'phoenix_html'

import { Socket } from 'phoenix'
import { LiveSocket } from 'phoenix_live_view'

import Alpine from 'alpinejs'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const csrfToken = document
  .querySelector("meta[name='csrf-token']")
  .getAttribute('content')

const liveSocket = new LiveSocket('/live', Socket, {
  params: { _csrf_token: csrfToken },
  // https://dockyard.com/blog/2020/12/21/optimizing-user-experience-with-liveview
  onBeforeElUpdated(from, to) {
    if (from.__x) {
      Alpine.clone(from.__x, to)
    }
  },
})

// Show progress bar on live navigation and form submits
window.addEventListener('phx:page-loading-start', (info) => NProgress.start())
window.addEventListener('phx:page-loading-stop', (info) => NProgress.done())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket
