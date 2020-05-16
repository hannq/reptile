import type { IModule } from '../../utils';
import { externalsHandler, logger } from '../../utils';
import puppeteer from "puppeteer-core";
import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import path from 'path';
import config from '../../config';
class IPCModule implements IModule {
  async init() {
    ipcMain.addListener('screenshot132', async function (e, num: number = 10) {
      try {
        if (!config.OUTPUT_PARH) {
          const { canceled, filePaths: [OUTPUT_PARH = null] } = await dialog.showOpenDialog({
            title: '请选择输出目录',
            properties: ['openDirectory']
          });
          if (!canceled && OUTPUT_PARH) await externalsHandler.updateConfig('OUTPUT_PARH', OUTPUT_PARH);
        }

        const browser = await puppeteer.launch({ executablePath: config.CHROME_EXEC_PARH });
        const page = await browser.newPage();
        await page.goto('https://thispersondoesnotexist.com/image.jpg', { waitUntil: 'networkidle0' });
        for(let i = 1; i <= num; i++) {
          // await downloadImage(config.OUTPUT_PARH, `${i}-${Date.now()}`);
          const img = await page.$('img');
          await img.screenshot({ path: path.join(config.OUTPUT_PARH, `${i}-${Date.now()}.jpg`) });
          await page.reload({ waitUntil: 'networkidle0' });
          // TODO: 如何组织这里的代码结构
          // win.webContents.send('taskReady', i);
        }
        await browser.close();
        shell.openExternal(config.OUTPUT_PARH);
      } catch (e) {
        logger.info("someting wrong!");
        logger.error(e);
      }
    })
  }
}
