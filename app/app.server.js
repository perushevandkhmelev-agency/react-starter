import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { matchRoutes } from 'react-router-config'
import { bindActionCreators } from 'redux'
import Helmet from 'react-helmet'

import renderApp from './render'
import createStore from './store'
import config from './config'
import { loadTranslations } from 'utils/IntlUtils'
import * as MiscActions from 'actions/misc'

export default function() {
  require('utils/IntlUtils').default()

  return async function(ctx, next) {
    let store = createStore()
    let miscActions = bindActionCreators(MiscActions, store.dispatch)
    miscActions.setConfig(config)

    // TODO: Place to preload user and current session

    let createRoutes = require('../routes.js')
    let routes = createRoutes(store)
    let branch = matchRoutes(routes, ctx.request.originalUrl)

    // Set current locale
    miscActions.setLocale('ru', loadTranslations())

    // Synchronize server and client time by remeber time on the server and pass it down to the client
    miscActions.syncTime()

    const context = {}
    const component = await renderApp({ store, routes, branch, initial: true })

    const markup = renderToString(
      <StaticRouter location={ctx.request.originalUrl} context={context}>
        {component}
      </StaticRouter>
    )

    if (context.url) {
      ctx.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
      ctx.redirect(context.url)
    } else {
      ctx.state.body = markup
      ctx.state.storeState = JSON.stringify(store.getState())
      ctx.state.head = Helmet.rewind()

      if (store.getState().error.code) {
        ctx.response.status = store.getState().error.code || 404
      }

      await next()
    }

    // } else {
    //   ctx.throw('Not found', 404)
    // }
  }
}