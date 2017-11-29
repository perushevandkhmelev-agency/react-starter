import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import webpackConfig from '../../webpack/default.config.babel.js'
import _ from 'lodash'
import ip from 'ip'

export default {
  serve(callback) {
    let compiler = webpack(webpackConfig)
    let bundleStart = null

    compiler.plugin('compile', () => {
      console.log('Bundling...')
      bundleStart = Date.now()
    })

    /**
     * Prepare and save html templates
     */
    compiler.plugin('after-emit', (compilation, emitCallback) => {
      let templates = _(Object.keys(compilation.assets))
        .filter(asset => /\.html$/.test(asset))
        .map(asset => [compilation.assets[asset].existsAt, compilation.assets[asset]])
        .fromPairs()
        .value()

      _.forEach(templates, (assetSource, templatePath) => {
        if (assetSource) {
          let content = assetSource.source()
          if (!Buffer.isBuffer(content)) {
            content = new Buffer(content, 'utf-8')
          }
          mkdirp.sync(path.dirname(templatePath))
          fs.writeFileSync(templatePath, content)
        }
      })
      emitCallback()
    })

    compiler.plugin('done', () => {
      console.log(`Bundled in ${Date.now() - bundleStart}ms!`)
      callback()
    })

    let webpackDevServer = new WebpackDevServer(compiler, {
      hot: true,

      // middleware
      publicPath: webpackConfig.output.publicPath,
      noInfo: true,
      stats: {
        colors: true
      },

      headers: {
        'Access-Control-Allow-Origin': '*'
      },

      historyApiFallback: false
    })

    webpackDevServer.listen(9090, process.env.EXTERNAL === 'true' ? ip.address() : 'localhost')
  }
}
