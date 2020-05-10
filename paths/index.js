// @ts-check

const path = require('path');
const DIST_PATH = path.join(__dirname, '../dist');
const SOURCE_PATH = path.join(__dirname, '../app');

module.exports = {
  DIST_PATH,
  SOURCE_PATH,
  rendererEntry: path.join(__dirname, '../app/renderer/index'),
  mainEntry: path.join(__dirname, '../app/main'),
  rendererDist: path.join(DIST_PATH, 'renderer'),
  mainDist: DIST_PATH
}
