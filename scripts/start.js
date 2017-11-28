require('dotenv').config({ silent: true })
require('babel-register')
require('babel-polyfill')
require('isomorphic-fetch')

if (process.env.NODE_ENV === 'production' || process.env.CHILD) {
  var WebpackIsomorphicTools = require('webpack-isomorphic-tools')
  var context = require('path').resolve(__dirname, '../src')

  global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../webpack/isomorphic-tools.config')).server(
    context,
    function() {
      require('../server')
    }
  )
} else {
  require('../server/dev')
}
