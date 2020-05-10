// @ts-check

const merge = require('webpack-merge');
const paths = require('../paths');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpackBaseConfigFactory = require('./webpack.config.base');

/** @type { (env: NodeJS.ProcessEnv) => import('webpack').Configuration } */
module.exports = (env) => {
  const webpackBaseConfig = webpackBaseConfigFactory(env)
  return merge(
    webpackBaseConfig,
    {
      target: 'electron-main',
      mode: 'production',
      entry: {
        main: paths.mainEntry
      },
      output: {
        path: paths.mainDist,
        filename: '[name].js'
      },
      plugins: [
        // new CopyWebpackPlugin([
        //   { from: path.join(paths.SOURCE_PATH, 'index.html'), to: path.join(paths.DIST_PATH, 'index.html') }
        // ])
      ]
    }
  )
}
