import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import { MenuModule } from './internal-modules';
import { logger, externalsHandler, ModuleRegister } from './utils';
import { Subject } from 'rxjs';
import config from './config';
import dayjs from 'dayjs';
import { downloadImage } from './tasks';
import _ from 'lodash';

const moduleRegister = new ModuleRegister(new Subject());
moduleRegister.tap(new MenuModule());
async function createWindow() {
  const result = await moduleRegister.call()
  console.log('result -->', result)
  return
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
