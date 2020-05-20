import { BaseBrowserWindowModule, IBaseOpts } from './base-browser-window';
import { ipcMain, dialog, BrowserWindow, shell } from 'electron';
import { logger, externalsHandler } from '@utils';
import puppeteer from "puppeteer-core";
import path from "path";
import config, { IPC_KEYS } from '@config';

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
    this.emitConfigUpdate();
    await this.addIPCListener();
    await super.init();
  }

  /**
   * config 更新时将最新的 config 发射出去
   */
  emitConfigUpdate() {
    const update$ = config.getUpdateStream();
    ipcMain.addListener(IPC_KEYS.CONFIT, () => {
      this.win.webContents.send(IPC_KEYS.CONFIT, config);
    })
    update$.subscribe((config) => {
      this.win.webContents.send(IPC_KEYS.CONFIT, config);
    })
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
          console.log('screenshot ===>', path.join(OUTPUT_PARH, `${i}${Date.now()}.jpg`))
          await img.screenshot({ path: path.join(OUTPUT_PARH, `${i}-${Date.now()}.jpg`)})
          await page.reload({ waitUntil: 'networkidle0' });
          // TODO: 如何组织这里的代码结构
          win.webContents.send('taskReady', i);
        }
        await browser.close();
        shell.openItem(OUTPUT_PARH);
      } catch (e) {
        logger.info("someting wrong!");
        logger.error(e);
      }
    })
  }
}
