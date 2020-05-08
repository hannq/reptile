// @ts-check

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const {  } = require('react-dev-utils/WebpackDevServerUtils');
const chalk = require('chalk');
const path = require('path');
const paths = require('../paths');
const dayjs = require('dayjs');
const webpackMainConfigFactory = require('../config/webpack.config.main.dev');
const webpackRendererConfigFactory = require('../config/webpack.config.renderer.dev');
const env = process.env
const HOST = process.env.HOST || '0.0.0.0';

;(async function () {
  const rendererConfig = webpackRendererConfigFactory(env);
  const mainCompiler = webpack(webpackMainConfigFactory(env));
  WebpackDevServer.addDevServerEntrypoints(rendererConfig, {});
  const server = new WebpackDevServer(webpack(rendererConfig), {
    contentBase: paths.DIST_PATH,
    historyApiFallback: true,
    stats: 'errors-warnings',
    overlay: true,
    hot: true,
    inline: true
  });
  server.listen(8080, HOST,() => {
    console.log('dev server listening on port 8080');
  });
  mainCompiler.watch({}, function (err, stats) {
    if (err || stats.hasErrors()) {
      // 在这里处理错误
      process.stdout.write(stats.toString({
        colors: true,
        chunks: false
      }))
    }
  })
})()
