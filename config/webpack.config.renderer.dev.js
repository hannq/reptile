// @ts-check

const webpack = require('webpack');
const merge = require('webpack-merge');
const paths = require('../paths');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackBaseConfigFactory = require('./webpack.config.base');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

/** @type { (env: NodeJS.ProcessEnv) => import('webpack').Configuration } */
module.exports = (env) => {
  const webpackBaseConfig = webpackBaseConfigFactory(env)
  return merge(
    webpackBaseConfig,
    {
      target: 'electron-renderer',
      mode: 'development',
      devtool: 'source-map',
      resolve: {
        alias: {
          'react-dom': '@hot-loader/react-dom',
        }
      },
      entry: {
        renderer: [
          'react-hot-loader/patch',
          `webpack-dev-server/client?http://localhost:${env.DEV_PORT}/renderer`,
          'webpack/hot/only-dev-server',
          paths.rendererEntry
        ]
      },
      output: {
        publicPath: `http://localhost:${env.DEV_PORT}/renderer/`,
        path: paths.rendererDist,
        filename: '[name].js'
      },
      plugins: [
        new webpack.NamedModulesPlugin(),
        new ForkTsCheckerWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
          template: path.join(paths.SOURCE_PATH, 'index.html'),
          filename: path.join(paths.DIST_PATH, 'index.html'),
        })
      ]
    }
  )
}
