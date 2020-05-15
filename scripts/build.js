// @ts-check

const webpack = require('webpack');
const chalk = require('chalk');
const path = require('path');
const dayjs = require('dayjs');
const paths = require('../paths');
const fse = require('fs-extra');
const webpackMainConfigFactory = require('../config/webpack.config.main.prod');
const webpackRendererConfigFactory = require('../config/webpack.config.renderer.prod');
const webpackInjectionFactory = require('../config/webpack.config.injection.prod');
const env = process.env

;(async function () {
  await fse.emptyDir(paths.DIST_PATH);
  const compiler = webpack([
    webpackRendererConfigFactory(env),
    webpackMainConfigFactory(env),
    webpackInjectionFactory(env)
  ]);
  compiler.run(function (err, stats) {
    if (err || stats.hasErrors()) {
      // 在这里处理错误
    }
    process.stdout.write(stats.toString({
      colors: true,
      chunks: false
    }))
  })
})()
