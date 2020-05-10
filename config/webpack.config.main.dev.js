// @ts-check

const paths = require('../paths');
const path = require('path');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpackBaseConfigFactory = require('./webpack.config.base');

/** @type { (env: NodeJS.ProcessEnv) => import('webpack').Configuration } */
module.exports = (env) => {
  const webpackBaseConfig = webpackBaseConfigFactory(env)
  return merge(
    webpackBaseConfig,
    {
      target: 'electron-main',
      mode: 'development',
      devtool: 'source-map',
      entry: {
        main: paths.mainEntry
      },
      output: {
        path: paths.mainDist,
        filename: '[name].js'
      },
      plugins: [
        new CopyWebpackPlugin([])
      ]
    }
  )
}
