// @ts-check
const webpack = require('webpack');
const path = require('path');
const paths = require('../paths');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

/** @type { (env: NodeJS.ProcessEnv) => import('webpack').Configuration } */
module.exports = (env) => {
  const isDev = env.NODE_ENV !== 'production';
  return {
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        '@config': path.join(paths.SOURCE_PATH, 'config/index'),
        '@utils': path.join(paths.SOURCE_PATH, 'utils/index')
      }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: { cacheDirectory: true }
            },
            { loader: 'ts-loader' },
          ]
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        '__DEV__': isDev,
        '__DEV_PORT__': env.DEV_PORT
      })
    ]
  }
};
