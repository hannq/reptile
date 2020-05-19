// @ts-check

const merge = require('webpack-merge');
const paths = require('../paths');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackBaseConfigFactory = require('./webpack.config.base');

/** @type { (env: NodeJS.ProcessEnv) => import('webpack').Configuration } */
module.exports = (env) => {
  const webpackBaseConfig = webpackBaseConfigFactory(env)
  return merge.smart(
    webpackBaseConfig,
    {
      target: 'electron-renderer',
      mode: 'production',
      entry: {
        renderer: paths.rendererEntry,
        setupLoading: paths.setupLoadingEntry
      },
      output: {
        path: paths.rendererDist,
        filename: '[name].js',
        chunkFilename: '[name].js'
      },
      module: {
        rules: [{
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: { transpileOnly: true }
            }
          ]
        }]
      },
      plugins: [
        new HtmlWebpackPlugin({
          chunks: ['renderer'],
          template: path.join(paths.STATIC_PATH, 'index.html'),
          filename: path.join(paths.DIST_PATH, 'index.html'),
        }),
        new HtmlWebpackPlugin({
          chunks: ['setupLoading'],
          template: path.join(paths.STATIC_PATH, 'index.html'),
          filename: path.join(paths.DIST_PATH, 'setupLoading.html'),
        })
      ]
    })
}

