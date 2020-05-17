import { BaseBrowserWindowModule, IBaseOpts } from './base-browser-window';
import { ipcMain, dialog, BrowserWindow, shell } from 'electron';
import { logger, externalsHandler } from '@utils';
import puppeteer from "puppeteer-core";
import config from '@config';

interface IOpts extends IBaseOpts {

}

export class MainBrowserWindowModule extends BaseBrowserWindowModule {
  constructor(
    protected readonly opts: IOpts = {},
    protected readonly win = new BrowserWindow(BaseBrowserWindowModule.winBaseConfig),
  ) {
    super(opts, win);
  }
  async init() {
    await this.addIPCListener();
    await super.init();
  }
  async addIPCListener () {
    const win = this.win;
    ipcMain.addListener('screenshot132', async function (e, num: number = 10) {
      try {
        const { canceled, filePaths: [OUTPUT_PARH = null] } = await dialog.showOpenDialog({
          title: '请选择输出目录',
          properties: ['openDirectory']
        });
        if (canceled) return;
        const browser = await puppeteer.launch({ executablePath: config.CHROME_EXEC_PARH });
        const page = await browser.newPage();
        await page.goto('https://thispersondoesnotexist.com/image.jpg', { waitUntil: 'networkidle0' });
        for(let i = 1; i <= num; i++) {
          const img = await page.$('img');
          img.screenshot({ path: OUTPUT_PARH})
          await page.reload({ waitUntil: 'networkidle0' });
          // TODO: 如何组织这里的代码结构
          win.webContents.send('taskReady', i);
        }
        await browser.close();
        shell.openExternal(OUTPUT_PARH);
      } catch (e) {
        logger.info("someting wrong!");
        logger.error(e);
      }
    })
  }
}
