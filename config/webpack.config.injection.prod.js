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
      target: 'web',
      mode: 'production',
      entry: {
        index: paths.injectionEntry
      },
      output: {
        path: paths.injectionDist,
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
