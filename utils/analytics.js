import ReactGA from 'react-ga'
import ym from 'react-yandex-metrika'
import pick from 'lodash/pick'
import config from 'app/config'

ReactGA.initialize(config.gaTrackingCode, {
  // debug: true,
  titleCase: false
  // gaOptions: {
  //   userId: 123
  // }
})

const GA_OPTIONS_WHITELIST = []
const YM_OPTIONS_WHITELIST = ['referer'] // referer is not a typo

export default {
  hit(page, title, options) {
    // window.console && window.console.info && window.console.info('[hit]', page, title, options)
    ReactGA.ga('set', { title, page })
    ReactGA.ga('send', 'pageview', pick(options, GA_OPTIONS_WHITELIST))
    ym('hit', page, { ...pick(options, YM_OPTIONS_WHITELIST), title })
  },
  sendSimpleEvent(eventCategory, eventAction) {
    // window.console && window.console.info && window.console.info('[event]', eventCategory, eventAction)
    ReactGA.ga('send', 'event', eventCategory, eventAction)
    ym('reachGoal', eventAction, { category: eventCategory })
  }
}

