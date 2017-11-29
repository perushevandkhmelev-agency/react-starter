import ga from './ga'
import ym from './ym'

var isBrowser = typeof window !== 'undefined'

if (isBrowser && typeof GA_TRACKING_CODE === 'string') {
  ga.init(GA_TRACKING_CODE)
}

if (isBrowser && typeof YM_TRACKING_CODE === 'string') {
  ym.init([YM_TRACKING_CODE], {
    defer: true,
    clickmap: true,
    webvisor: true,
    trackLinks: true,
    accurateTrackBounce: true
  })
}

export default {
  hit(page, title, options) {
    ga('send', 'pageview', { ...options, title, page })
    ym('hit', page, { ...options, title })
  }
}
