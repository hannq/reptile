/*
 * @Author: hannq
 * @Date: 2020-04-29 00:09:34
 * @Last Modified by: hannq
 * @Last Modified time: 2020-04-29 12:34:52
 * @desc 主入口文件
 */

import puppeteer from 'puppeteer';
import path from 'path';
import micromatch from 'micromatch';
import fse from 'fs-extra';
import { Tabletojson as tabletojson } from 'tabletojson';
import xlsx from 'node-xlsx';

const DATA_CACHE_PATH = path.join(__dirname, './data');

;(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://wztjj.wenzhou.gov.cn/art/2019/12/3/art_1468714_40733753.html');
  const tableHtml = await page.$eval('table#c', (ele: HTMLElement) => ele.innerHTML);
  await browser.close();
  const result: {[x: number]: string}[][] = tabletojson.convert(tableHtml);
  const resultNew = result
    .map(item => (item.map(v => (console.log(v), Object.keys(v).reduce((acc, k) => (acc[k] = v[k], acc), [])))))
    .reduce((acc, v) => [...acc, ...v])
  await fse.ensureDir(DATA_CACHE_PATH);
  // const ws = fse.createWriteStream(path.join(DATA_CACHE_PATH, 'table.json') )
  // ws.write(JSON.stringify(resultNew));

  const buffer = xlsx.build([{ name: 'myExcel', data: resultNew }], {  }); // Returns a buffer
  const ws = fse.createWriteStream(path.join(DATA_CACHE_PATH, 'table.xlsx') )
  ws.write(buffer);

  // await page.screenshot({path: 'screenshot.png'});
  // await browser.close();
})();
