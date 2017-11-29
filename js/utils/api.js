import queryString from 'query-string'

export function headers(extraHeaders) {
  return ({ session }) => {
    return Object.assign(
      { 'content-type': 'application/json' },
      session.access_token ?
        { 'Token': session.access_token } : null,
      extraHeaders
    )
  }
}

export function path(pathname, query) {
  const fullPath = pathname + (query ? `?${queryString.stringify(query)}` : '')

  return function({ config }) {
    if (process.browser) {
      return fullPath
    } else if (config.proxy) {
      return `http://localhost:${config.port}${fullPath}`
    } else {
      return `${config.apiUrl}${fullPath}`
    }
  }
}
