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
      target: 'web',
      mode: 'development',
      devtool: 'source-map',
      entry: {
        index: paths.injectionEntry
      },
      output: {
        path: paths.injectionDist,
        filename: '[name].js'
      },
      plugins: [
        new CopyWebpackPlugin([])
      ]
    }
  )
}
