import React from 'react'
import { bindActionCreators } from 'redux'
import { IntlProvider } from 'react-intl'
import { RouterScrollContext } from 'react-router-scroll-behavior'
import { Provider } from 'react-redux'
import ErrorContext from './components/ErrorContext'
import performRouteHandlerStaticMethod from './utils/performRouteHandlerStaticMethod'
import { beforeNavigate, navigate } from './actions/router'
import formats from './formats'

export default function *(store, state, history, initial) {
  const routerActions = bindActionCreators({ beforeNavigate, navigate }, store.dispatch)
  const { locale, translations, time } = store.getState()

  routerActions.beforeNavigate(state, initial)
  yield performRouteHandlerStaticMethod('fetchData', state, store)
  routerActions.navigate(state)

  return (
    <IntlProvider locale={locale} formats={formats} defaultFormats={formats} messages={translations} defaultLocale="ru" initialNow={time.render}>
      <Provider store={store}>
        <ErrorContext error={store.getState().error}>
          <RouterScrollContext history={history} {...state} />
        </ErrorContext>
      </Provider>
    </IntlProvider>
  )
}
