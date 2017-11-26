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
    },
    styles: {
      extensions: ['css', 'scss'],
      filter: (module, regex, options, log) => {
        if (options.development) {
          return WebpackIsomorphicToolsPlugin.style_loader_filter(module, regex, options, log)
        }

        return regex.test(module.name)
      },
      path: (module, options, log) => {
        if (options.development) {
          return WebpackIsomorphicToolsPlugin.style_loader_path_extractor(module, options, log)
        }

        return module.name
      },
      parser: (module, options, log) => {
        if (options.development) {
          return WebpackIsomorphicToolsPlugin.css_modules_loader_parser(module, options, log)
        }

        return module.source
      }
    }
  }
}
