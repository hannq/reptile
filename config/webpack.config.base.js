// @ts-check
const webpack = require('webpack');
const path = require('path');
const paths = require('../paths');
const { getThemeVariables } = require('antd/dist/theme');
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
        },
        {
          test: /\.less$/,
          use: [{
            loader: 'style-loader',
          }, {
            loader: 'css-loader', // translates CSS into CommonJS
          }, {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              lessOptions: { // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
                modifyVars: getThemeVariables({
                  dark: true, // 开启暗黑模式
                  compact: true, // 开启紧凑模式
                }),
                javascriptEnabled: true,
              },
            },
          }]
        },
        {
          test: /\.css$/,
          use: [{
            loader: 'style-loader',
          }, {
            loader: 'css-loader', // translates CSS into CommonJS
          }]
        },
      ],
    },
    optimization: { },
    plugins: [
      new webpack.DefinePlugin({
        '__DEV__': isDev,
        '__DEV_PORT__': env.DEV_PORT
      })
    ]
  }
};
