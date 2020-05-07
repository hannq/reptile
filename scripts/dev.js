// @ts-check

const webpack = require('webpack');
const webpackConfigFactory = require('../config/webpack.config.dev');

;(async function() {
  webpack(webpackConfigFactory, function(err, stats) {
    if (err || stats.hasErrors()) {
      // 在这里处理错误
    }
    // 处理完成
  });
})()
