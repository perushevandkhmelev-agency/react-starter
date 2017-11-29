import React from 'react'
import { bindActionCreators } from 'redux'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { renderRoutes } from 'react-router-config'
import { AppContainer } from 'react-hot-loader'
import ErrorContext from 'components/ErrorContext'
import performRouteHandlerStaticMethod from 'utils/performRouteHandlerStaticMethod'
import { beforeNavigate, navigate } from 'actions/router'
import formats from './formats'

export default async function({ store, routes, branch, initial }, hot = false) {
  const routerActions = bindActionCreators({ beforeNavigate, navigate }, store.dispatch)
  const { locale, translations, time } = store.getState()

  // Do not run fetch cycle on hot replacement
  if (!hot) {
    routerActions.beforeNavigate(branch, initial)
    await performRouteHandlerStaticMethod('fetchData', branch, store)
    routerActions.navigate(branch)
  }

  return (
    <AppContainer>
      <IntlProvider
        locale={locale}
        formats={formats}
        defaultFormats={formats}
        messages={translations}
        defaultLocale="ru"
        initialNow={time.render}>
        <Provider store={store}>
          <ErrorContext error={store.getState().error}>{renderRoutes(routes)}</ErrorContext>
        </Provider>
      </IntlProvider>
    </AppContainer>
  )
}
