require('dotenv').config({ silent: true })
require('babel-register')
require('babel-polyfill')
require('isomorphic-fetch')

if (process.env.NODE_ENV === 'production' || process.env.CHILD) {
  var WebpackIsomorphicTools = require('webpack-isomorphic-tools')
  var context = require('path').resolve(__dirname, '../')

  global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../app/webpack/isomorphic-tools.config')).server(
    context,
    function() {
      require('../app/server')
    }
  )
} else {
  require('../app/server/dev')
}
