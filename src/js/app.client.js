import 'normalize.css'
import '../styles/globals'

import co from 'co'
import React from 'react'
import { hydrate } from 'react-dom'
import { matchRoutes } from 'react-router-config'
import { Router } from 'react-router'
import Helmet from 'react-helmet'

import renderApp from './render'
import createRoutes from './routes'
import createStore from './store'
import browserHistory from './utils/browserHistory'
import progress from './utils/progress'
import analytics from './utils/analytics'
import IntlUtils from './utils/IntlUtils'

const store = createStore(window.storeState)
const routes = createRoutes(store)

let initial = true

IntlUtils().then(() => {
  const wrappedListen = co.wrap(listen)
  wrappedListen(browserHistory.location)
  browserHistory.listen(wrappedListen)
})

function* listen(location) {
  if (!initial) {
    progress.start()
  }

  const branch = matchRoutes(routes, location.pathname + location.search)
  const component = yield renderApp(store, routes, branch, initial)

  try {
    hydrate(<Router history={browserHistory}>{component}</Router>, document.getElementById('Root'))
  } catch (error) {
    if (console && console.error) {
      console.error(error)
    }
  } finally {
    const { title } = Helmet.peek()

    document.title = title
    analytics.hit(location.pathname + location.search, title)

    if (!initial) {
      progress.decrement()
    }

    initial = false
  }
}
