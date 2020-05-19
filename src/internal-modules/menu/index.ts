import { app, Menu, MenuItemConstructorOptions, shell } from 'electron';
import type { IModule } from '@utils';
import path from 'path';
import config from '@config';

// const isMac = process.platform === 'darwin'

const template: MenuItemConstructorOptions[] = [
  // {
  //   label: app.name,
  //   submenu: [
  //     { role: 'about' },
  //     { type: 'separator' },
  //     { role: 'services' },
  //     { type: 'separator' },
  //     { role: 'hide' },
  //     { role: 'hideothers' },
  //     { role: 'unhide' },
  //     { type: 'separator' },
  //     { role: 'quit' }
  //   ]
  // }
  {
    role: 'appMenu',
    submenu: [
      { label: '刷新', role: 'forceReload' },
      { label: '退出', role: 'quit' },
    ]
  },
  // ...(isMac ? [{
  //   label: app.name,
  //   submenu: [
  //     { role: 'about' },
  //     { type: 'separator' },
  //     { role: 'services' },
  //     { type: 'separator' },
  //     { role: 'hide' },
  //     { role: 'hideothers' },
  //     { role: 'unhide' },
  //     { type: 'separator' },
  //     { role: 'quit' }
  //   ]
  // }] : []),
  // { role: 'fileMenu' }
  // {
  //   label: 'File',
  //   submenu: [
  //     isMac ? { role: 'close' } : { role: 'quit' }
  //   ]
  // },
  // { role: 'editMenu' },
  // {
  //   label: 'Edit',
  //   submenu: [
  //     { role: 'undo' },
  //     { role: 'redo' },
  //     { type: 'separator' },
  //     { role: 'cut' },
  //     { role: 'copy' },
  //     { role: 'paste' },
  //     ...(isMac ? [
  //       { role: 'pasteAndMatchStyle' },
  //       { role: 'delete' },
  //       { role: 'selectAll' },
  //       { type: 'separator' },
  //       {
  //         label: 'Speech',
  //         submenu: [
  //           { role: 'startspeaking' },
  //           { role: 'stopspeaking' }
  //         ]
  //       }
  //     ] : [
  //       { role: 'delete' },
  //       { type: 'separator' },
  //       { role: 'selectAll' }
  //     ])
  //   ]
  // },
  // { role: 'viewMenu' }
  // {
  //   label: 'View',
  //   submenu: [
  //     { role: 'reload' },
  //     { role: 'forcereload' },
  //     { role: 'toggledevtools' },
  //     { type: 'separator' },
  //     { role: 'resetzoom' },
  //     { role: 'zoomin' },
  //     { role: 'zoomout' },
  //     { type: 'separator' },
  //     { role: 'togglefullscreen' }
  //   ]
  // },
  // { role: 'windowMenu' }
  // {
  //   label: 'Window',
  //   submenu: [
  //     { role: 'minimize' },
  //     { role: 'zoom' },
  //     ...(isMac ? [
  //       { type: 'separator' },
  //       { role: 'front' },
  //       { type: 'separator' },
  //       { role: 'window' }
  //     ] : [
  //       { role: 'close' }
  //     ])
  //   ]
  // },
  {
    role: 'help',
    label: '帮助',
    submenu: [
      {
        label: '日志',
        click: async () => {
          // console.log('config.LOG_PATH --->', config.LOG_PATH)
          await shell.openExternal(config.LOG_PATH)
        }
      },
      {
        label: '配置文件',
        click: async () => {
          // console.log('config.USER_CONFIG_YAML --->', config.USER_CONFIG_YAML)
          await shell.openExternal(config.USER_CONFIG_YAML)
        }
      }
    ]
  }
]

export class MenuModule implements IModule {
  $$name = 'MenuModule';
  $$loaded = false;

  async init(...args) {
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
}
