import YAML from 'yaml';
import fse from 'fs-extra';
import paths from './paths';
import logger from 'electron-log';
import * as IPC_KEYS from './ipc-keys';
import { isNullOrUndefined } from 'util';

type Map2Func<K extends keyof T, T> = (K extends any ? (arg1: K) => T[K]: never);
type OmitReturnFunc<T extends (...args) => any> = T extends ((...args) => (...args) => any) ? never : T;
type GetNotFuncKey<T, K extends keyof T> = Parameters<OmitReturnFunc<Map2Func<K, T>>>[number]
type INoFuncConfig = Pick<Config, GetNotFuncKey<Config, keyof Config>>

class Config {
  readonly LOG_PATH: string = logger.transports.file.file;
  readonly CHROME_EXEC_PARH: string = null;
  readonly OUTPUT_PARH: string = null;
  constructor(externalConfig: Partial<Config>) {
    this.batchUpdate(externalConfig)
  }

  update<K extends keyof INoFuncConfig>(this: INoFuncConfig , key: K, val: INoFuncConfig[K]) {
    this[key] = val;
  }

  batchUpdate(newConfig: Partial<INoFuncConfig> = {}) {
    newConfig && Object.keys(this).forEach(key => {
      if (!isNullOrUndefined(newConfig[key])) this[key] = externalConfig[key];
    });
  }
}

const externalConfig: Partial<INoFuncConfig> = YAML.parse(fse.readFileSync(paths.EXTERNAL_CONFIG_YAML, { encoding: 'utf8' }));

export {
  paths,
  IPC_KEYS,
  INoFuncConfig
}

export default new Config(externalConfig);
