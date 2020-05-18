import { app, BrowserWindow } from 'electron';
import {
  MenuModule,
  SetupConfigModule,
  MainBrowserWindowModule,
} from './internal-modules';
import { ModuleRegister } from '@utils';
import { Subject } from 'rxjs';

/**
 * 主入口
 */
async function main() {
  const moduleRegister = new ModuleRegister(new Subject<[]>());
  moduleRegister.tap(new SetupConfigModule());
  moduleRegister.tap(new MenuModule(), new MenuModule());
  moduleRegister.tap(
    new MainBrowserWindowModule({
      devTools: __DEV__,
      isDev: __DEV__
    })
  );
  await moduleRegister.call();

  // setTimeout(() => moduleRegister.call(), 5000)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(main)

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
    main()
  }
});
