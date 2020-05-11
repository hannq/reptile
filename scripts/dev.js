// @ts-check

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const fse = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const dayjs = require('dayjs');
const paths = require('../paths');
const webpackMainConfigFactory = require('../config/webpack.config.main.dev');
const webpackRendererConfigFactory = require('../config/webpack.config.renderer.dev');
const env = process.env
const HOST = process.env.HOST || '0.0.0.0';
const PORT = 3000;

;(async function () {
  await fse.emptyDir(paths.DIST_PATH);
  const mergedEnv = {
    ...env,
    DEV_PORT: String(PORT)
  }
  const rendererConfig = webpackRendererConfigFactory(mergedEnv);
  const mainCompiler = webpack(webpackMainConfigFactory(mergedEnv));
  WebpackDevServer.addDevServerEntrypoints(rendererConfig, {});
  const server = new WebpackDevServer(webpack(rendererConfig), {
    contentBase: paths.DIST_PATH,
    publicPath: '/',
    historyApiFallback: true,
    stats: 'errors-warnings',
    writeToDisk: true,
    overlay: true,
    inline: true,
    host: HOST,
    port: PORT,
    serveIndex: true,
    compress: true,
    hot: true,
    hotOnly: true
  });
  server.listen(PORT, HOST,() => { });
  const watcher = mainCompiler.watch({}, function(err, stats) {
    if (err || stats.hasErrors()) {
      // 在这里处理错误
      process.stdout.write(stats.toString({
        colors: true,
        chunks: false
      }));
      watcher.close(() => {  });
    }
  })
})()
