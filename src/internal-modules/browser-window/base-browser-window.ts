import type { BrowserWindowConstructorOptions } from 'electron';
import { ipcMain, dialog, BrowserWindow, shell } from 'electron';
import type { IModule } from '@utils';

export interface IBaseOpts {
  /** 是否是 dev 环境 */
  isDev?: boolean;
  /** 是否打开 devTools */
  devTools?: boolean;
}

/**
 * 初始化 BrowserWindow 相关模块
 */
export class BaseBrowserWindowModule implements IModule {
  static devtronInstalled = false;

  static baseConfig: IBaseOpts  = {
    isDev: false,
    devTools: false
  }

  $$name = 'BaseBrowserWindowModule';
  $$loaded = false;

  static winBaseConfig: BrowserWindowConstructorOptions = {
    width: 800,
    height: 600,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true
    },
  }

  constructor(
    protected readonly opts: IBaseOpts = BaseBrowserWindowModule.baseConfig,
    protected readonly win = new BrowserWindow(BaseBrowserWindowModule.winBaseConfig)
  ) {

  }

  async init(...args) {
    const { devTools } = this.opts;
    await this.loadRendererEntry();
    devTools && this.openDevTool()
  }

  /**
   * 加载渲染进程文件
   */
  async loadRendererEntry() {
    const { isDev } = this.opts;
    const win = this.win;
    if (isDev) {
      await win.loadURL(`http://localhost:${__DEV_PORT__}`, { })
    } else {
      await win.loadFile('./dist/index.html', { })
    }
  }

  /**
   * 打开开发者工具
   */
  openDevTool() {
    const { isDev } = this.opts
    // 打开开发者工具
    if (isDev) {
      this.win.webContents.openDevTools();
      if (!BaseBrowserWindowModule.devtronInstalled) {
        require('devtron').install();
        BaseBrowserWindowModule.devtronInstalled = true;
      }
    }
  }
}
