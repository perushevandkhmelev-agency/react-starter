import { RSAA } from 'redux-api-middleware'
import queryString from 'query-string'

const headers = extraHeaders => ({
  'content-type': 'application/json',
  ...extraHeaders
})

const endpoint = (pathname, query) => ({ config }) =>
  `${config.apiUrl}${pathname}${query ? `${~pathname.indexOf('?') ? '&' : '?'}${queryString.stringify(query)}` : ''}`
