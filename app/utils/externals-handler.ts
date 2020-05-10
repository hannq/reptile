import { app, dialog } from 'electron';
import config, { paths } from '../config';
import YAML from 'yaml';
import fse from 'fs-extra';
import logger from './logger';

async function updateConfig<C extends typeof config, K extends keyof C> (key: K, val: C[K]) {
  try {
    const content = await fse.readFile(paths.EXTERNAL_CONFIG_YAML, 'utf8');
    const externalConfig: Partial<C> = YAML.parse(content) || {};
    externalConfig[key] = val;
    await fse.writeFile(paths.EXTERNAL_CONFIG_YAML, YAML.stringify(externalConfig), 'utf8');
    const { response } = await dialog.showMessageBox({
      type: 'warning',
      title: '配置变更',
      buttons: ['立即重启', '稍后再说'],
      message: '更新配置成功，但是需要重启应用才能生效！'
    })
    console.log('result --->', response === 0);
    if (response === 0) {
      app.relaunch();
      app.exit(0);
    }
  } catch (e) {
    logger.error(e);
  }
}

export default {
  updateConfig
}
