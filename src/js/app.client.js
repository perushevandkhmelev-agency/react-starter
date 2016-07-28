import 'normalize.css'
import '../styles/globals'

import co from 'co'
import React from 'react'
import { render } from 'react-dom'
import classnames from 'classnames/dedupe'

import renderApp from './render'
import createRoutes from './routes'
import createStore from './store'
import browserHistory from './utils/browserHistory'
import progress from './utils/progress'
import matchRoutes from './utils/matchRoutes'
import analytics from './utils/analytics'
import IntlUtils from './utils/IntlUtils'

const store = createStore(window.storeState)
const routes = createRoutes(store)

let initial = true

IntlUtils().then(() => {
  browserHistory.listen(co.wrap(listen))
})

function *listen(location) {
  let [error, redirectLocation, state] = yield matchRoutes(browserHistory, routes, location.path)

  // Handle browser redirect
  if (redirectLocation) {
    browserHistory.push(redirectLocation)
    return
  }

  try {
    if (error) {
      throw error
    }

    if (!initial) {
      progress.start()
    }

    render(
      yield renderApp(store, state, browserHistory, initial),
      document.getElementById('Root')
    )

  } catch (error) {
    if (console && console.error) {
      console.error(error)
    }
  } finally {
    const {
      meta: {
        title
      }
    } = store.getState()

    document.title = title
    analytics.hit(state.location.pathname + state.location.search, title)

    if (!initial) {
      progress.decrement()
    }

    initial = false
  }
}
