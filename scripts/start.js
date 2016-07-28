require('dotenv').config({ silent: true })
require('babel-register')
require('babel-polyfill')
require('isomorphic-fetch')

if (process.env.NODE_ENV === 'production' || process.env.CHILD) {
  var IsomorphicTools = require('webpack-isomorphic-tools')
  var context = require('path').resolve(__dirname, '../src')

  global.webpack_isomorphic_tools = new IsomorphicTools(require('../webpack/isomorphic-tools'))
    .development(process.env.NODE_ENV === 'development')
    .server(context, function(){
      require('../server')
    })
} else {
  require('../server/dev')
}
