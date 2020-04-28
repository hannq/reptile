/*
 * @Author: hannq
 * @Date: 2020-04-29 00:09:34
 * @Last Modified by: hannq
 * @Last Modified time: 2020-04-29 01:14:11
 * @desc 主入口文件
 */

import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.baidu.com');
  await page.screenshot({path: 'screenshot.png'});
  await browser.close();
})();
