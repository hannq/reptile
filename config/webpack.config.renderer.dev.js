// @ts-check

const webpack = require('webpack');
const merge = require('webpack-merge');
const paths = require('../paths');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackBaseConfigFactory = require('./webpack.config.base');

/** @type { (env: NodeJS.ProcessEnv) => import('webpack').Configuration } */
module.exports = (env) => {
  const webpackBaseConfig = webpackBaseConfigFactory(env)
  return merge(
    webpackBaseConfig,
    {
      target: 'electron-renderer',
      mode: 'development',
      entry: {
        ui: [
          `webpack-dev-server/client?http://127.0.0.1:8080`,
          'webpack/hot/only-dev-server',
          paths.uiEntry
        ]
      },
      output: {
        publicPath: 'http://localhost:8080/',
        path: paths.uiDist,
        filename: '[name].js'
      },
      plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
          template: path.join(__dirname, '../app/ui/index.html'),
          filename: 'index.html'
        })
      ]
    }
  )
}
