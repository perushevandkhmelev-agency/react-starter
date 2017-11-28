require('dotenv').load({ silent: true })

import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextWebpackPlugin from 'extract-text-webpack-plugin'
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin'
import WebpackIsomorphicToolsConfig from './isomorphic-tools.config'
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(WebpackIsomorphicToolsConfig)

const isProduction = process.env.NODE_ENV === 'production'
let address = 'localhost'

if (!isProduction) {
  const ip = require('ip')
  address = process.env.EXTERNAL === 'true' ? ip.address() : 'localhost'
}

let config = {
  context: path.resolve(__dirname, '../src'),
  entry: {
    app: path.resolve(__dirname, '../src/js/app.client.js'),
    server: path.resolve(__dirname, '../src/js/app.server.js'),
    vendor: [
      'babel-polyfill',
      'isomorphic-fetch',
      'react',
      'react-dom',
      'react-router',
      'redux',
      'react-redux',
      'redux-thunk',
      'redux-promise-middleware',
      'classnames'
    ]
  },
  output: {
    path: path.resolve(__dirname, '../public/assets'),
    filename: isProduction ? '[name].[chunkhash:10].js' : '[name].js',
    chunkFilename: isProduction ? '[id].[name].[chunkhash:10].js' : '[id].[name].js',
    publicPath: isProduction ? '/assets/' : `http://${address}:9090/assets/`
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: path.resolve(__dirname, '../src')
      },
      {
        test: webpackIsomorphicToolsPlugin.regular_expression('styles'),
        use: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader?-autoprefixer',
              options: {
                importLoaders: 2
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: path.resolve(__dirname, '../postcss.config.js')
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                includePaths: [path.resolve(__dirname, '../src/styles'), path.resolve(__dirname, '../src/assets')]
              }
            }
          ]
        })
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: webpackIsomorphicToolsPlugin.regular_expression('fonts'),
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: isProduction ? '[name].[hash:10].[ext]' : '[name].[ext]'
            }
          }
        ]
      },
      {
        test: webpackIsomorphicToolsPlugin.regular_expression('images'),
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: isProduction ? '[name].[hash:10].[ext]' : '[name].[ext]'
            }
          }
        ]
      },
      {
        test: webpackIsomorphicToolsPlugin.regular_expression('images'),
        use: 'raw-loader',
        include: path.resolve(__dirname, '../src/assets/raw')
      }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty'
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru|en/),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: isProduction ? '[name].[chunkhash:10].js' : '[name].js',
      minChunks: Infinity
    }),
    new ExtractTextWebpackPlugin('[name].[contenthash:10].css', {
      allChunks: true,
      disable: !isProduction
    }),
    new HtmlWebpackPlugin({
      inject: false,
      address: address,
      template: 'views/template.html',
      filename: 'template.html',
      favicon: 'assets/favicon.png',
      chunks: ['app', 'vendor', 'hot']
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        API_URL: process.env.API_URL ? JSON.stringify(process.env.API_URL) : null,
        GA_TRACKING_CODE: process.env.GA_TRACKING_CODE ? JSON.stringify(process.env.GA_TRACKING_CODE) : null
      }
    }),
    webpackIsomorphicToolsPlugin
  ],
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'src')],
    extensions: ['.js', '.json', '.css', '.scss']
  },
  stats: {
    children: false
  }
}

if (isProduction) {
  config.plugins.push(new webpack.optimize.OccurenceOrderPlugin())
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false
      }
    })
  )
} else {
  config.devtool = 'eval-source-map'
  config.entry.hot = 'webpack/hot/only-dev-server'
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

export default config
