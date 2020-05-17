import { app, dialog } from 'electron';
import config, { INoFuncConfig } from '@config';
import YAML from 'yaml';
import fse from 'fs-extra';
import logger from './logger';

interface IUpdateConfigOptions {
  /** 是否需要重启应用 */
  restart?: boolean;
}

/**
 * 更新单条本地配置
 * @param key 需要更新的 key
 * @param val 需要更新的 value
 * @param opts 配置项
 */
async function updateConfig<K extends keyof INoFuncConfig> (key: K, val: INoFuncConfig[K], opts: IUpdateConfigOptions = {}) {
  try {
    const {
      restart = false
    } = opts
    const content = await fse.readFile(config.USER_CONFIG_YAML, 'utf8');
    const externalConfig: Partial<INoFuncConfig> = YAML.parse(content) || {};
    externalConfig[key] = val;
    await fse.writeFile(config.USER_CONFIG_YAML, YAML.stringify(externalConfig), 'utf8');
    config.update(key, val)
    if (restart) await restartWhenConfigChange();
    return true
  } catch (e) {
    logger.error(e);
    return false
  }
}

/**
 * 配置变更时重启应用
 */
async function restartWhenConfigChange () {
  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: '配置变更',
    buttons: ['立即重启', '稍后再说'],
    message: '更新配置成功，但是需要重启应用才能生效！'
  })
  if (response === 0) {
    app.relaunch();
    app.exit(0);
  }
}

export default {
  updateConfig
}
