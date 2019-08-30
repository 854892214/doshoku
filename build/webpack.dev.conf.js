'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

let htmlWebpackPlugin;

let htmlWebpackPluginConfig = {
    filename: 'index.html',
    template: 'index.html',
    inject: true
};

if (config.dev.cdn){
    htmlWebpackPluginConfig.cdn = {
        css: ['https://cdn.bootcss.com/mint-ui/2.2.13/style.min.css'],
        js: [
            'https://unpkg.com/axios/dist/axios.min.js',
            'https://cdn.bootcss.com/vuex/3.0.1/vuex.min.js',
            'https://cdn.bootcss.com/vue/2.3.0/vue.min.js',
            'https://cdn.bootcss.com/vue-router/3.0.1/vue-router.min.js',
            'https://cdn.bootcss.com/mint-ui/2.2.13/index.js',
            'https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js',
            'https://momentjs.com/downloads/moment.min.js',
            'https://momentjs.com/downloads/moment-timezone-with-data-10-year-range.js',
            'https://unpkg.com/better-scroll/dist/bscroll.min.js',
        ]
    };
}

htmlWebpackPlugin = new HtmlWebpackPlugin(htmlWebpackPluginConfig);

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    htmlWebpackPlugin,
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

if (config.dev.cdn){
  devWebpackConfig.externals = {
    "mint-ui": "MINT",
    vue: "Vue",
    "vue-router": "VueRouter",
    "moment-timezone": "moment",
    "moment": "moment",
    jquery: "jQuery",
    "better-scroll": "BScroll",
    vuex: "Vuex",
    axios: "axios",
  };
}

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
