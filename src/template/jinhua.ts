/*
 * @Author: hannq
 * @Date: 2020-04-29 00:09:34
 * @Last Modified by: hannq
 * @Last Modified time: 2020-05-04 20:15:35
 * @desc 主入口文件
 */

import puppeteer from 'puppeteer';
import Fuse from 'fuse.js';
import path from 'path';
import upath from 'upath';
import micromatch from 'micromatch';
import fse, { pathExists, copySync } from 'fs-extra';
import { Tabletojson as tabletojson } from 'tabletojson';
import xlsx from 'node-xlsx';

const DATA_CACHE_PATH = path.join(__dirname, '../data');
const SOURCE_URL = 'http://www.jinhua.gov.cn/zjjh/jhnj/'

  ; (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(SOURCE_URL, {
      waitUntil: 'networkidle2'
    });
    const sourceList = await page.$$eval('.jh_gl_mr_m2 ul>li a', (aList: HTMLAnchorElement[]) => aList.map(aTag => ({
      title: aTag.innerText.trim(),
      target: aTag.href
    })));
    for (const source of sourceList) {
      await page.goto(source.target, {
        waitUntil: 'networkidle2'
      });
      const targetTable = await page.$$('table.MsoNormalTable, table#Table1');
      if (!!targetTable.length) {
        const secondPage = await page.$$eval('table.MsoNormalTable tr, table#Table1 tr', (trList: HTMLTableRowElement[]) => {
          return trList.reduce<{ title: string, content: { title: string, target: string }[] }[]>((acc, current, index) => {
            const subItems = Array.from(current.querySelectorAll('a'));
            if (subItems.length) {
              const prev = acc.pop() || { title: '', content: [] };
              acc = [...acc, {
                ...prev,
                content: prev.content.concat(subItems.map(aTag => ({ title: aTag.innerText, target: aTag.href })))
              }];
            } else {
              acc = [...acc, {
                title: current.innerText.trim(),
                content: []
              }]
            }
            return acc;
          }, []);
        })
        for (const secondItem of secondPage) {
          for (const secondContent of secondItem.content) {
            await page.goto(secondContent.target, {
              waitUntil: 'networkidle2'
            });
            const tableHTML = await page.$eval('table', (table: HTMLElement) => table.outerHTML);
            // console.log(tableHTML);
            const result: { [x: number]: string }[][] = tabletojson.convert(tableHTML);
            const resultNew = result.length ? result
              .map(item => (item.map(v => Object.keys(v).reduce((acc, k) => (acc[k] = v[k], acc), []))))
              .reduce((acc, v) => [...acc, ...v]) : []
            const buffer = xlsx.build([{
              name: '表格',
              data: resultNew
            }]);
            await fse.ensureDir(DATA_CACHE_PATH);
            await fse.writeFile(path.join(DATA_CACHE_PATH, `${source.title}-${secondItem.title}-${secondContent.title}.xlsx`), buffer);
            // TODO: 这里为了节省流量，循环到第一个自动退出
            break;
          }
          // TODO: 这里为了节省流量，循环到第一个自动退出
          break;
        }
      } else {
        // TODO: 金华 2016 年及以前的数据需要点击 点击跳转 后才能正确展示
        const redirectTarget = await page.$$eval('a', (aTagList: HTMLAnchorElement[]) => aTagList.find(aTag => (aTag.innerText.includes('点击阅读')) || { href: null } ).href);
        if (redirectTarget) {
          await page.goto(redirectTarget, {
            waitUntil: 'networkidle2'
          });
        } else {
          console.log(source.target)
        }
      }
      // TODO: 这里为了节省流量，循环到第一个自动退出
      // break;
    }
    // console.log(result);
    await browser.close();
  })();
