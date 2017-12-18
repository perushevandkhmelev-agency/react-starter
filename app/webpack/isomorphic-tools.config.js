import path from 'path'
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin'

export default {
  webpack_assets_file_path: path.resolve(__dirname, './webpack-assets.json'),
  webpack_stats_file_path: path.resolve(__dirname, './webpack-stats.json'),
  assets: {
    templates: {
      extensions: ['html']
    },
    fonts: {
      extensions: ['otf', 'eot', 'ttf', 'woff', 'woff2']
    },
    images: {
      extensions: ['png', 'jpg', 'gif', 'ico', 'svg']
    }
  }
}
