import React from 'react'
import { hydrate, render } from 'react-dom'
import { matchRoutes } from 'react-router-config'
import { Router } from 'react-router'
import Helmet from 'react-helmet'
import get from 'lodash/get'

import renderApp from './render'
import createStore from './store'
import browserHistory from 'utils/browserHistory'
import progress from 'utils/progress'
import analytics from 'utils/analytics'
import IntlUtils from 'utils/IntlUtils'

const store = createStore(window.storeState)

let initial = true

async function app() {
  await IntlUtils()
  await run(browserHistory.location)
  browserHistory.listen(run)
}

async function run(location, options) {
  const isHot = get(options, 'hot', false)
  const showProgress = !initial && !isHot

  if (showProgress) {
    progress.start()
  }

  const createRoutes = require('../pages')
  const renderApp = require('./render')
  const routes = createRoutes(store)
  const branch = matchRoutes(routes, location.pathname + location.search)
  const component = await renderApp({ store, routes, branch, initial }, isHot)

  try {
    const renderMethod = initial ? hydrate : render
    renderMethod(<Router history={browserHistory}>{component}</Router>, document.getElementById('Root'))
  } catch (error) {
    if (console && console.error) {
      console.error(error)
    }
  } finally {
    const { title } = Helmet.peek()

    document.title = title
    analytics.hit(location.pathname + location.search, title)

    if (showProgress) {
      progress.decrement()
    }

    initial = false
  }
}

app()

if (module.hot) {
  module.hot.accept(['../pages', './render'], () => run(browserHistory.location, { hot: true }))
}
