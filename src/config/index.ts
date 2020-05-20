import * as IPC_KEYS from './ipc-keys';
import { isNullOrUndefined } from 'util';
import { Subject, Observable } from 'rxjs';
import { share } from 'rxjs/operators';

type Map2Func<K extends keyof T, T> = (K extends any ? (arg1: K) => T[K]: never);
type OmitReturnFunc<T extends (...args) => any> = T extends ((...args) => (...args) => any) ? never : T;
type GetNotFuncKey<T, K extends keyof T> = Parameters<OmitReturnFunc<Map2Func<K, T>>>[number]
type _INoFuncConfig<T extends any> = Pick<T, GetNotFuncKey<T, keyof T>>
type INoFuncConfig = _INoFuncConfig<Config>

const mutation$ = new Subject<INoFuncConfig>();
const update$: Observable<INoFuncConfig> = mutation$.pipe(share());

class Config {
  /** 输出日志目录 */
  readonly LOG_PATH: string = null;
  /** 用户自定义配置文件地址 */
  readonly USER_CONFIG_YAML: string = null;
  /** 供给 puppetter 运行的 CHROME 可执行文件地址 */
  readonly CHROME_EXEC_PARH: string = null;
  /** 用于注入到 <webview> 中的可执行脚本文件 */
  readonly WEBVIEW_INJECTION: string = null;

  constructor(externalConfig: Partial<Config>) {
    this.batchUpdate(externalConfig)
  }

  /**
   * 更新指定字段的 config
   * @param key 更新指定字段的键
   * @param val 更新指定字段的值
   */
  update<K extends keyof INoFuncConfig>(this: INoFuncConfig, key: K, val: INoFuncConfig[K]) {
    this[key] = val;
    mutation$.next(this);
  }

  /**
   * 批量更新 config
   * @param newConfig 批量更新的字段
   */
  batchUpdate(newConfig: Partial<INoFuncConfig> = {}) {
    newConfig && Object.keys(this).forEach(key => {
      if (!isNullOrUndefined(newConfig[key])) this[key] = newConfig[key];
    });
    mutation$.next(this);
  }

  getUpdateStream() {
    return update$
  }
}
export {
  IPC_KEYS,
  INoFuncConfig
}

export default new Config({});
