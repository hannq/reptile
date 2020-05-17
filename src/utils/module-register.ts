import { Subject, from, of, Observable } from 'rxjs';
import { switchMap, concatMap, tap, endWith, map, filter } from 'rxjs/operators';
import logger from './logger';

export interface IModule {
  /** 模块名称 */
  $$name: string;
  /** 模块是否已经加载成功 */
  $$loaded: boolean;
  /** 模块 初始化函数 */
  init(...args): void;
}

/**
 * 模块加载器，已经成功加载的模块不会再重复加入
 */
export class ModuleRegister<S extends readonly any[]> {
  /** 多播订阅器 */
  private readonly multicast = new Subject<void | Observable<void> | void[]>();
  /** 需压加载的模块列表 */
  private readonly moduleList: (IModule[] | IModule)[] = [];
  /** 内置日志记录工具 */
  private readonly logger = logger.scope('ModuleRegister')

  constructor (
    private readonly subject: Subject<S>
  ) {
    this.subject
      .pipe(
        switchMap(() => from(this.moduleList).pipe(endWith(of<void>()))),
        filter(v => Array.isArray(v) || (v instanceof Observable) || !v.$$loaded),
        concatMap(v => {
          if (Array.isArray(v)) {
            const pureItems = v.filter(v => !v.$$loaded);
            return Promise.all(pureItems.map(item => Promise.resolve(item.init()))).then(r => <const>[pureItems, r])
          } else if (!(v instanceof Observable)) {
            return Promise.resolve(v.init()).then(r => <const>[v, r])
          } else {
            return of(<const>[v, v])
          }
        }),
        tap(([v]) => {
          if (v instanceof Observable) {
            this.logger.info('All module loaded success !')
          } else if (Array.isArray(v)) {
            v.forEach(v => v.$$loaded = true);
            this.logger.info(`Modules: ${v.map(({$$name}) => $$name).join(', ')} loaded !`);
          } else {
            v.$$loaded = true;
            this.logger.info(`Module: ${v.$$name} loaded !`);
          }
        }),
        map(([,v]) => v)
      ).subscribe(this.multicast);
  }

  /**
   * 模块注册
   * @param module 需要被加载的模块
   */
  tap(module: IModule[] | IModule) {
    this.moduleList.push(module);
    return () => {
      const index = this.moduleList.indexOf(module);
      !!~index && this.moduleList.splice(index, 1);
    }
  }

  /**
   * 加载模块
   * @param args
   */
  call<T extends S>(...args: T) {
    this.subject.next(args);
    return new Promise<void>(resolve => {
      this.multicast.subscribe(v => {
        if (v instanceof Observable) {
          resolve(v.toPromise());
        }
      })
    })
  }

  /**
   * 重试加载失败的模块
   */
  retryAborted<T extends S>(...args: T) {
    this.subject.next(args);
  }
}
