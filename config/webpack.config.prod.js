// @ts-check

const merge = require('webpack-merge');
const webpackBaseConfigFactory = require('./webpack.config.base');

/** @type { (env: any) => import('webpack').Configuration } */
module.exports = (env) => {
  console.log(env)
  const webpackBaseConfig = webpackBaseConfigFactory(env)
  return merge(
    webpackBaseConfig,
    {

    }
  )
}
