// @ts-check

const path = require('path');
const DIST_PATH = path.join(__dirname, '../dist');

module.exports = {
  DIST_PATH,
  uiEntry: path.join(__dirname, '../app/ui/index'),
  mainEntry: path.join(__dirname, '../app/main'),
  uiDist: path.join(DIST_PATH, 'ui'),
  mainDist: DIST_PATH
}
