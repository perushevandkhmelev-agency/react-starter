import clc from 'cli-color'
import path from 'path'
import Koa from 'koa'
import koaStatic from 'koa-static'
import koaEjs from 'koa-ejs'
import koaMorgan from 'koa-morgan'

import appServer from '../src/js/app.server'
import proxy from './proxy'
import config from '../src/js/config'

const isProduction = process.env.NODE_ENV === 'production'
const publicPath = path.resolve(__dirname, '../public')

/**
 * Create app
 */
const app = new Koa()

/**
 * TODO: Error handler
 */
app.use(function *(next) {
  try {
    yield next
  } catch (error) {
    process.stdout.write(clc.red(`\n${error.message}\n${error.stack}\n\n`))
    this.response.status = error.status || 500
    this.app.emit('error', error, this)
  }
})

/**
 * Setup logger
 */
app.use(
  koaMorgan.middleware(isProduction ? 'combined' : 'dev')
)

/**
 * Setup templates
 */
koaEjs(app, {
  root: path.resolve(publicPath, './assets'),
  layout: false,
  delimiter: '?'
})

/**
 * Serve static assets from `public` directory
 */
app.use(
  koaStatic(publicPath, { maxage: 2 * 60 * 60 * 1000 })
)

/**
 * Serve API
 */
app.use(
  proxy('/api/*', config.apiUrl)
)

/**
 * Prerender react app
 */
app.use(
  appServer()
)

/**
 * Generate response
 */
app.use(function *() {
  yield this.render('template')
})

/**
 * Start server
 */
app.listen(config.port, () => console.log(`Server running on port ${config.port}`))
