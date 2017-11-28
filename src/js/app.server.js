import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { matchRoutes } from 'react-router-config'
import { bindActionCreators } from 'redux'

import renderApp from './render'
import createStore from './store'
import metaFromState from './utils/metaFromState'
import { loadTranslations } from './utils/IntlUtils'
import * as MiscActions from './actions/misc'
import config from './config'

export default function() {
  require('./utils/IntlUtils').default()

  return function*(next) {
    let store = createStore()
    let miscActions = bindActionCreators(MiscActions, store.dispatch)
    miscActions.setConfig(config)

    // TODO: Place to preload user and current session

    let createRoutes = require('./routes.js')
    let routes = createRoutes(store)
    let branch = matchRoutes(routes, this.request.originalUrl)

    // Set current locale
    miscActions.setLocale('ru', loadTranslations())

    // Synchronize server and client time by remeber time on the server and pass it down to the client
    miscActions.syncTime()

    const context = {}
    const component = yield renderApp(store, routes, branch, true)

    const markup = renderToString(
      <StaticRouter location={this.request.originalUrl} context={context}>
        {component}
      </StaticRouter>
    )

    if (context.url) {
      this.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
      this.redirect(context.url)
    } else {
      this.state.body = markup
      this.state.storeState = JSON.stringify(store.getState())
      this.state.meta = metaFromState(store.getState())

      if (store.getState().error.code) {
        this.throw('Reject', store.getState().error.code || 404)
      }

      yield next
    }

    // } else {
    //   this.throw('Not found', 404)
    // }
  }
}
