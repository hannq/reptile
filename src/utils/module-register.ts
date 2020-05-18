import { Subject, from, asyncScheduler, Observable } from 'rxjs';
import { switchMap, concatMap, tap, endWith, map, filter, buffer, distinctUntilKeyChanged } from 'rxjs/operators';
import logger from './logger';

export interface IModule {
  /** 模块名称 */
  readonly $$name: string;
  /** 是否是伪模块 */
  $$fake?: boolean;
  /** 模块是否已经加载成功 */
  $$loaded?: boolean;
  /** 模块是否已经加载成功 */
  $$groupId?: number;
  /** 模块 初始化函数 */
  init(...args): void;
}

/**
 * 模块加载器，已经成功加载的模块不会再重复加入
 */
export class ModuleRegister<S extends readonly any[]> {
  /** 多播订阅器 */
  private readonly multicast = new Subject<void[]>();
  /** 需压加载的模块列表 */
  private readonly moduleList: IModule[] = [];
  /** 内置日志记录工具 */
  private readonly logger = logger.scope('ModuleRegister');
  /** 分组计数 */
  private groupCount = 0;
  /** 用于标识结尾的虚构的模块 */
  private fakeModule: IModule = {
    $$name: 'FakeModule',
    $$fake: true,
    $$groupId: Number.MAX_SAFE_INTEGER,
    init(){ }
  };

  constructor (
    private readonly subject$: Subject<S>
  ) {
    const task$ = this.subject$.pipe(
        switchMap(() => from(this.moduleList, asyncScheduler).pipe(endWith(this.fakeModule))),
        filter(v => !v.$$loaded)
      );
      task$.pipe(
        buffer(task$.pipe(distinctUntilKeyChanged('$$groupId'))),
        filter(v => !!v.length),
        concatMap(modules => Promise.all(modules.map(v => Promise.resolve(v.init()))).then(r => <const>[modules, r])),
        tap(([modules]) => {
          if (modules.find(v => v.$$fake)) {
            this.logger.info('All module loaded success !');
          } else {
            modules.forEach(v => v.$$loaded = true);
            this.logger.info(`Module: ${modules.map(({$$name}) => $$name).join(', ')} loaded !`);
          }
        }),
        map(([,v]) => v)
      ).subscribe((v) => {
        // console.log(v)
      });
  }

  /**
   * 模块注册
   * @param module 需要被加载的模块
   */
  tap(...modules: IModule[]) {
    modules.forEach(module => module.$$groupId = this.groupCount);
    this.moduleList.push(...modules);
    this.groupCount++;
    return () => {
      const index = this.moduleList.indexOf(modules[0]);
      !!~index && this.moduleList.splice(index, modules.length);
    }
  }

  /**
   * 加载模块
   * @param args
   */
  call<T extends S>(...args: T) {
    this.subject$.next(args);
    // return new Promise<void>(resolve => {
    //   this.multicast.subscribe(v => {
    //     if (v instanceof Observable) {
    //       resolve(v.toPromise());
    //     }
    //   })
    // })
  }

  /**
   * 重试加载失败的模块
   */
  retryAborted<T extends S>(...args: T) {
    this.subject$.next(args);
  }
}
