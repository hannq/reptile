import { app, BrowserWindow, ipcMain, dialog, Menu, shell } from 'electron';
import path from 'path';
import puppeteer from "puppeteer-core";
import { logger, externalsHandler } from './utils';
import config from './config';
import { initMenu } from './menu';
import dayjs from 'dayjs';
import { downloadImage } from './tasks';
import _ from 'lodash';

initMenu();

async function createWindow() {
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true
    },
  });

  if (!config.CHROME_EXEC_PARH) {
    const { canceled, filePaths: [CHROME_EXEC_PARH = null] } = await dialog.showOpenDialog({
      title: '请选择 chrome 可执行文件',
      properties: ['openFile', 'treatPackageAsDirectory']
    });
    if (!canceled && CHROME_EXEC_PARH) await externalsHandler.updateConfig('CHROME_EXEC_PARH', CHROME_EXEC_PARH, { restart: true });
  }

  if (__DEV__) {
    await win.loadURL(`http://localhost:${__DEV_PORT__}`, { })
  } else {
    await win.loadFile('./dist/index.html', { })
  }

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
        win.webContents.send('taskReady', i);
      }
      await browser.close();
      shell.openExternal(config.OUTPUT_PARH);
    } catch (e) {
      logger.info("someting wrong!");
      logger.error(e);
    }
  })



  if (__DEV__) {
    // 打开开发者工具
    win.webContents.openDevTools()
    require('devtron').install();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
});
