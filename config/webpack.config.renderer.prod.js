// @ts-check

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
      mode: 'production',
      entry: {
        ui: paths.uiEntry
      },
      output: {
        path: paths.uiDist,
        filename: '[name].js',
        chunkFilename: '[name].js'
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: path.join(__dirname, '../app/ui/index.html'),
          filename: 'index.html'
        })
      ]
    }
  )
}
