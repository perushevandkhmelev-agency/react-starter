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

if (!isProduction && process.env.EXTERNAL === 'true') {
  const ip = require('ip')
  address = ip.address()
}

let config = {
  context: path.resolve(__dirname, '../../'),
  entry: {
    app: ['react-hot-loader/patch', path.resolve(__dirname, '../app.client.js')],
    server: path.resolve(__dirname, '../app.server.js'),
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
    path: path.resolve(__dirname, '../../public/assets'),
    filename: isProduction ? '[name].[chunkhash:10].js' : '[name].js',
    chunkFilename: isProduction ? '[id].[name].[chunkhash:10].js' : '[id].[name].js',
    publicPath: isProduction ? '/assets/' : `http://${address}:9090/assets/`
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: webpackIsomorphicToolsPlugin.regular_expression('styles'),
        use: ['css-hot-loader'].concat(
          ExtractTextWebpackPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader?-autoprefixer',
                options: {
                  importLoaders: 2,
                  modules: true,
                  localIdentName: '[name]__[local]--[hash:base64:5]'
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  config: {
                    path: path.resolve(__dirname, '../../postcss.config.js')
                  }
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  includePaths: [path.resolve(__dirname, '../../styles'), path.resolve(__dirname, '../../assets')]
                }
              }
            ]
          })
        )
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
        include: path.resolve(__dirname, '../../assets/raw')
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
    new ExtractTextWebpackPlugin(isProduction ? '[name].[contenthash:10].css' : '[name].css', {
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      inject: false,
      address: address,
      template: 'app/views/template.html',
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
  config.entry.hot = ['webpack/hot/only-dev-server', `webpack-dev-server/client?http://${address}:9090/`]
  config.plugins.push(new webpack.NamedModulesPlugin())
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

export default config
