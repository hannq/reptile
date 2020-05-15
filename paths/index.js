// @ts-check

const path = require('path');
const DIST_PATH = path.join(__dirname, '../dist');
const SOURCE_PATH = path.join(__dirname, '../src');
const STATIC_PATH = path.join(__dirname, '../static');
const WEBVIEW_INJECTION_PATH = path.join(__dirname, '../webview-injection');

module.exports = {
  DIST_PATH,
  STATIC_PATH,
  SOURCE_PATH,
  WEBVIEW_INJECTION_PATH,
  injectionEntry: path.join(SOURCE_PATH, 'webview-injection/index'),
  injectionDist: WEBVIEW_INJECTION_PATH,
  rendererEntry: path.join(SOURCE_PATH, 'renderer/index'),
  rendererDist: path.join(DIST_PATH, 'renderer'),
  mainEntry: path.join(SOURCE_PATH, 'main'),
  mainDist: DIST_PATH
}
