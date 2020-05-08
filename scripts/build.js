// @ts-check

const webpack = require('webpack');
const chalk = require('chalk');
const path = require('path');
const dayjs = require('dayjs');
const webpackMainConfigFactory = require('../config/webpack.config.main.prod');
const webpackRendererConfigFactory = require('../config/webpack.config.renderer.prod');
const env = process.env

;(async function () {
  const mainCompiler = webpack([
    webpackMainConfigFactory(env),
    webpackRendererConfigFactory(env)
  ]);
  mainCompiler.run(function (err, stats) {
    if (err || stats.hasErrors()) {
      // 在这里处理错误
    }
    process.stdout.write(stats.toString({
      colors: true,
      chunks: false
    }))
  })
})()
