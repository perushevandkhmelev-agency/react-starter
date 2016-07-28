import React from 'react'
import { renderToString } from 'react-dom/server'
import { createMemoryHistory } from 'react-router'
import { bindActionCreators } from 'redux'

import renderApp from './render'
import createStore from './store'
import matchRoutes from './utils/matchRoutes'
import metaFromState from './utils/metaFromState'
import { loadTranslations } from './utils/IntlUtils'
import * as MiscActions from './actions/misc'
import config from './config'

export default function() {
  require('./utils/IntlUtils').default()

  return function *(next) {
    let store = createStore()
    let miscActions = bindActionCreators(MiscActions, store.dispatch)
    miscActions.setConfig(config)

    // TODO: Place to preload user and current session

    let createRoutes = require('./routes.js')
    let routes = createRoutes(store)
    let memoryHistory = createMemoryHistory(this.request.originalUrl)

    let [error, redirectLocation, state] = yield matchRoutes(memoryHistory, routes, this.request.originalUrl)

    if (error) {
      throw error
    } else if (redirectLocation) {
      this.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
      this.redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (state) {
      // Set current locale
      miscActions.setLocale('ru', loadTranslations())

      // Synchronize server and client time by remebering time on server and pass it to the client
      miscActions.syncTime()

      this.state.body = renderToString(
        yield renderApp(store, state, memoryHistory, true)
      )

      this.state.storeState = JSON.stringify(store.getState())
      this.state.meta = metaFromState(store.getState())

      if (store.getState().error.code) {
        this.throw('Reject', store.getState().error.code || 404)
      }

      yield next
    } else {
      this.throw('Not found', 404)
    }
  }
}
