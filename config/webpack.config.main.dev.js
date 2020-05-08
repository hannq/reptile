// @ts-check

const paths = require('../paths');
const merge = require('webpack-merge');
const webpackBaseConfigFactory = require('./webpack.config.base');

/** @type { (env: NodeJS.ProcessEnv) => import('webpack').Configuration } */
module.exports = (env) => {
  const webpackBaseConfig = webpackBaseConfigFactory(env)
  return merge(
    webpackBaseConfig,
    {
      target: 'electron-main',
      mode: 'development',
      entry: {
        main: paths.mainEntry
      },
      output: {
        path: paths.mainDist,
        filename: '[name].js'
      },
    }
  )
}
