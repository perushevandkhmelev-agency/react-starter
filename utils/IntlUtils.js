// Contains utils to download the locale data for the current language, eventually
// requiring the `Intl` polyfill for browser not supporting it
// It is used in ../intl.js *before* rendering the root component.

import * as path from 'path'
import areIntlLocalesSupported from 'intl-locales-supported'
import { addLocaleData } from 'react-intl'
import { readFileSync } from 'fs'
import { sync as globSync } from 'glob'

import ru from 'react-intl/locale-data/ru'

function hasBuiltInLocaleData(locale) {
  return Intl.NumberFormat.supportedLocalesOf(locale)[0] === locale &&
    Intl.DateTimeFormat.supportedLocalesOf(locale)[0] === locale
}

export function loadNodeIntlPolyfill(locales) {
  if (global.Intl) {
      if (!areIntlLocalesSupported(locales)) {
          var IntlPolyfill    = require('intl')
          Intl.NumberFormat   = IntlPolyfill.NumberFormat
          Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat
      }
  } else {
      global.Intl = require('intl')
  }
}

export function loadBrowserIntlPolyfill(locales) {
  return new Promise((resolve) => {
    if (window.Intl && locales.every(hasBuiltInLocaleData)) {
      return resolve()
    }

    require.ensure(['intl', 'intl/locale-data/jsonp/ru.js'], (require) => {
      require('intl')
      require('intl/locale-data/jsonp/ru')
      resolve()
    }, 'intl')
  })
}

export function loadTranslations() {
  return globSync('./intl/*.json')
    .map((filename) => [
      path.basename(filename, '.json'),
      readFileSync(filename, 'utf8'),
    ])
    .map(([locale, file]) => [locale, JSON.parse(file)])
    .reduce((collection, [locale, messages]) => {
      collection[locale] = messages
      return collection
    }, {})
}

export default function() {
  const langs = ['ru']

  return (
    new Promise(resolve => {
      if (process.browser) {
        loadBrowserIntlPolyfill(langs)
          .then(resolve)
      } else {
        loadNodeIntlPolyfill(langs)
        resolve()
      }
    })
  ).then(() => {
    addLocaleData(ru)
  })
}
