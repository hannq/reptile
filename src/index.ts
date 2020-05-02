/*
 * @Author: hannq
 * @Date: 2020-04-29 00:09:34
 * @Last Modified by: hannq
 * @Last Modified time: 2020-05-01 00:05:30
 * @desc 主入口文件
 */

import puppeteer from 'puppeteer';
import Fuse from 'fuse.js';
import path from 'path';
import micromatch from 'micromatch';
import fse from 'fs-extra';
import { Tabletojson as tabletojson } from 'tabletojson';
import xlsx from 'node-xlsx';

const DATA_CACHE_PATH = path.join(__dirname, './data');

;(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://tjj.huzhou.gov.cn/tjsj/tjnj/index.html', {
    waitUntil: 'networkidle2'
  });
  const listText = await page.$$eval('ul#ajaxpage-list a', (aList: HTMLAnchorElement[]) => aList.map(e => ({title: e.innerText, target: e.href})));;
  for(const item of listText) {
    await page.goto(item.target, {
      waitUntil: 'networkidle2'
    });
    const secondPage = await page.$$eval('.TRS_Editor a', (aList: HTMLAnchorElement[], item) => {
      const aTag = aList.find(e => e.innerText === '点击查看详细信息');
      return {
        referer: item,
        title: aTag.innerText,
        target: aTag.href,
      }
    }, item);
    await page.goto(secondPage.target, {
      waitUntil: 'networkidle2'
    });
    const thridPage = await page.$$eval('table tr a', (aList: HTMLAnchorElement[], item) => {
      return aList.map(val => ({
        referer: item,
        title: val.innerText,
        target: val.href
      }))
    }, item);
    for (const item of thridPage) {
      await page.goto(item.target, {
        waitUntil: 'networkidle2'
      });
      const forthPage = await page.$$eval('table tr a', (aList: HTMLAnchorElement[], item) => {
        return aList.map(val => ({
          referer: item,
          title: val.innerText,
          target: val.href
        }))
      }, item);
      console.log(forthPage);
      for (const item of forthPage) {
        await page.goto(item.target, {
          waitUntil: 'networkidle2'
        });
        const tableText = await page.$eval('table', (table: HTMLElement) => table.outerHTML);
        console.log(tableText)
        const result: {[x: number]: string}[][] = tabletojson.convert(tableText);
        console.log(result)
        await fse.writeFile('tabel.html', tableText)
        const resultNew = result.length ? result
          .map(item => (item.map(v => (console.log(v), Object.keys(v).reduce((acc, k) => (acc[k] = v[k], acc), [])))))
          .reduce((acc, v) => [...acc, ...v]) : []
        const buffer = xlsx.build([{
          name: '表格',
          data: resultNew
        }]);
        await fse.ensureDir(DATA_CACHE_PATH);
        await fse.writeFile(path.join(DATA_CACHE_PATH, `${item.referer.referer.title}-${item.referer.title}-${item.title}.xlsx`), buffer)
      }
    }

  }
  await browser.close();
  return;
  // const tableHtml = await page.$eval('table#c', (ele: HTMLElement) => ele.innerHTML);
  // await browser.close();
  // const result: {[x: number]: string}[][] = tabletojson.convert(tableHtml);
  // const resultNew = result
  //   .map(item => (item.map(v => (console.log(v), Object.keys(v).reduce((acc, k) => (acc[k] = v[k], acc), [])))))
  //   .reduce((acc, v) => [...acc, ...v])
  // await fse.ensureDir(DATA_CACHE_PATH);
  // // const ws = fse.createWriteStream(path.join(DATA_CACHE_PATH, 'table.json') )
  // // ws.write(JSON.stringify(resultNew));
  // const buffer = xlsx.build([{ name: 'myExcel', data: resultNew }], {  }); // Returns a buffer
  // const ws = fse.createWriteStream(path.join(DATA_CACHE_PATH, 'table.xlsx') )
  // ws.write(buffer);

  // await page.screenshot({path: 'screenshot.png'});
  // await browser.close();
})();
