require('dotenv').load({ silent: true })

import path from 'path'
import webpack from 'webpack'
import autoprefixer from 'autoprefixer'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import IsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin'
import isomorphicToolsConfig from './isomorphic-tools'

const isProduction = process.env.NODE_ENV === 'production'
let address = 'localhost'

let isomorphicToolsPlugin = new IsomorphicToolsPlugin(isomorphicToolsConfig).development(!isProduction)

if (!isProduction) {
  const ip = require('ip')
  address = process.env.EXTERNAL === 'true' ? ip.address() : 'localhost'
}

let webpackConfig = {
  context: path.resolve(__dirname, '../src'),
  entry: {
    app: 'js/app.client',
    server: 'js/app.server', // watch and reload server
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
    loaders: [
      {
        test: /\.js$/,
        loaders: isProduction ? ['babel-loader'] : ['react-hot-loader', 'babel-loader'],
        include: path.resolve(__dirname, '../src')
      },
      {
        test: isomorphicToolsPlugin.regular_expression('styles'),
        loader: ExtractTextPlugin.extract('style-loader', ['css-loader?-autoprefixer&importLoaders=2', 'postcss-loader', 'sass-loader'])
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: isomorphicToolsPlugin.regular_expression('fonts'),
        loader: 'url-loader',
        query: {
          limit: 8192,
          name: isProduction ? '[name].[hash:10].[ext]' : '[name].[ext]'
        }
      },
      {
        test: isomorphicToolsPlugin.regular_expression('images'),
        loader: 'url-loader',
        query: {
          limit: 8192,
          name: isProduction ? '[name].[hash:10].[ext]' : '[name].[ext]'
        }
      }
    ]
  },
  sassLoader: {
    includePaths: [
      path.resolve(__dirname, '../src/styles'),
      path.resolve(__dirname, '../src/assets')
    ]
  },
  postcss: [
    autoprefixer({
      browsers: [
        'last 2 versions',
        'ios >= 8',
        'ie >= 10',
        'android >= 4.0'
      ]
    })
  ],
  node: {
    fs: 'empty',
    net: 'empty'
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru|en/),
    new webpack.optimize.CommonsChunkPlugin('vendor', isProduction ? '[name].[chunkhash:10].js' : '[name].js', Infinity),
    new ExtractTextPlugin('[name].[contenthash:10].css', {
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
      'process.env.API_URL': process.env.API_URL ? JSON.stringify(process.env.API_URL) : null,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'GA_TRACKING_CODE': process.env.GA_TRACKING_CODE ? JSON.stringify(process.env.GA_TRACKING_CODE) : null
    }),
    isomorphicToolsPlugin
  ],
  resolve: {
    extensions: ['', '.json', '.css', '.scss', '.js'],
    modulesDirectories: ['node_modules', 'src']
  }
}

if (isProduction) {
  webpackConfig.plugins.push(new webpack.optimize.OccurenceOrderPlugin())
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: false,
    compress: {
      warnings: false
    }
  }))
} else {
  webpackConfig.devtool = 'eval-source-map'
  webpackConfig.entry.hot = 'webpack/hot/only-dev-server'
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
}

export default webpackConfig
