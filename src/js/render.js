import React from 'react'
import { bindActionCreators } from 'redux'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import ErrorContext from './components/ErrorContext'
import performRouteHandlerStaticMethod from './utils/performRouteHandlerStaticMethod'
import { beforeNavigate, navigate } from './actions/router'
import formats from './formats'
import { RouterContext } from 'react-router'

export default function*(store, state, history, initial) {
  const routerActions = bindActionCreators({ beforeNavigate, navigate }, store.dispatch)
  const { locale, translations, time } = store.getState()

  routerActions.beforeNavigate(state, initial)
  yield performRouteHandlerStaticMethod('fetchData', state, store)
  routerActions.navigate(state)
  console.log(state)

  return (
    <IntlProvider
      locale={locale}
      formats={formats}
      defaultFormats={formats}
      messages={translations}
      defaultLocale="ru"
      initialNow={time.render}>
      <Provider store={store}>
        <ErrorContext error={store.getState().error}>
          <RouterContext history={history} {...state} />
        </ErrorContext>
      </Provider>
    </IntlProvider>
  )
}
