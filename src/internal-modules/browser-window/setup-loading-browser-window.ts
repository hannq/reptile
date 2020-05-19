import { BaseBrowserWindowModule, IBaseOpts } from './base-browser-window';
import { Menu, ipcMain, dialog, BrowserWindow, shell, BrowserWindowConstructorOptions } from 'electron';
import { logger, externalsHandler } from '@utils';
import puppeteer from "puppeteer-core";
import path from "path";
import config from '@config';

interface IOpts extends IBaseOpts {

}

export class SetupLoadingBrowserWindowModule extends BaseBrowserWindowModule {
  static winBaseConfig: BrowserWindowConstructorOptions = {
    width: 380,
    height: 140,
    frame: false,
    show: false,
    hasShadow: true,
    transparent: true,
    resizable: false,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true
    },
  }

  static baseConfig: IBaseOpts  = {
    isDev: false,
    devTools: false
  }

  $$name = 'SetupLoadingBrowserWindowModule';
  $$loaded = false;

  constructor(
    protected readonly opts: IOpts = {},
    protected readonly win = new BrowserWindow(SetupLoadingBrowserWindowModule.winBaseConfig),
  ) {
    super(opts, win);
  }
  async init() {
    await super.init();
    // this.win.
  }

  /**
   * 加载渲染进程文件
   */
  async loadRendererEntry() {
    const { isDev } = this.opts;
    const win = this.win;
    if (isDev) {
      await win.loadURL(`http://localhost:${__DEV_PORT__}/setupLoading.html`, { })
    } else {
      await win.loadFile('./dist/setupLoading.html', { })
    }
  }
}
