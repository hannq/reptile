import type { IModule } from '@utils';
import type { INoFuncConfig } from '@config';
import { externalsHandler } from '@utils';
import logger from 'electron-log';
import { dialog } from 'electron';
import config from '@config';
import YAML from 'yaml';
import fse from 'fs-extra';
import path from 'path';

export class SetupConfigModule implements IModule {
  $$loaded = false;
  $$name = 'SetupConfigModule';

  async init(...args) {
    const CWD = process.cwd()
    /** 用于注入 webview 中执行的脚本 */
    const WEBVIEW_INJECTION = path.join(CWD, 'webview-injection');
    /** 外部扩展用的文件夹 */
    const EXTERNALS_DIR = path.join(CWD, 'externals');
    /** 用于用户扩展到 config 文件 */
    const USER_CONFIG_YAML = path.join(EXTERNALS_DIR, 'CONFIG.yaml');
    // 确保指定文件存在防止报错
    await this.ensureFileExist(USER_CONFIG_YAML);
    /** 从用户配置文件中读取用户的自定义配置 */
    const externalConfig: Partial<INoFuncConfig> = YAML.parse(fse.readFileSync(USER_CONFIG_YAML, { encoding: 'utf8' }));
    /** 设置日志输出目录 */
    if (externalConfig.LOG_PATH) logger.transports.file.file = externalConfig.LOG_PATH;
    // 更新 config 中的字段
    config.batchUpdate({
      LOG_PATH: logger.transports.file.file,
      USER_CONFIG_YAML,
      ...externalConfig,
      WEBVIEW_INJECTION,
      EXTERNALS_DIR,
    })
    await this.checkChromeExec();
  }

  /**
   * 确保指定文件存在
   * @param filePaths 文件地址
   */
  private ensureFileExist(...filePaths: string[]) {
    return Promise.all(filePaths.map(file => fse.ensureFile(file)));
  }

  /**
   * 检查 供给 puppetter 运行的 CHROME 可执行文件地址 是否存在
   */
  async checkChromeExec () {
    if (!config.CHROME_EXEC_PARH) {
      const { canceled, filePaths: [CHROME_EXEC_PARH = null] } = await dialog.showOpenDialog({
        title: '请选择 chrome 可执行文件',
        properties: ['openFile', 'treatPackageAsDirectory']
      });
      if (!canceled && CHROME_EXEC_PARH) await externalsHandler.updateConfig('CHROME_EXEC_PARH', CHROME_EXEC_PARH, { restart: true });
    }
  }
}
