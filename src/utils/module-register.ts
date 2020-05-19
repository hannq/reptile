import { Subject, from, asyncScheduler, Observable, ReplaySubject } from 'rxjs';
import { switchMap, concatMap, tap, filter, share, groupBy, mergeMap, reduce } from 'rxjs/operators';
import logger from './logger';

type IModuleInitOutput = void;

export interface IModule {
  /** 模块名称 */
  readonly $$name: string;
  /** 是否是伪模块 */
  $$fake?: boolean;
  /** 模块是否已经加载成功 */
  $$loaded?: boolean;
  /** 模块分组 id */
  $$groupId?: number;
  /** 模块 初始化函数 */
  init(...args): IModuleInitOutput;
}

/**
 * 模块加载器，已经成功加载的模块不会再重复加入
 */
export class ModuleRegister<S extends readonly any[]> {
  /** 需压加载的模块列表 */
  private readonly moduleList: IModule[] = [];
  /** 内置日志记录工具 */
  private readonly logger = logger.scope('ModuleRegister');
  /** 模块 init 后的输出值 */
  private output$: Observable<(readonly [IModule, IModuleInitOutput])[]>;
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
    private readonly source$: Subject<S>
  ) {
    this.output$ = this.init();
  }

  init() {
    return this.source$.pipe(
      switchMap(() => from(
        [...this.moduleList, this.fakeModule],
        asyncScheduler
      ).pipe(
        filter(v => !v.$$loaded),
        groupBy(v => v.$$groupId, null, null, () => new ReplaySubject<IModule>()),
        concatMap(modules$ => modules$.pipe(
          mergeMap(module => Promise.resolve(module.init()).then(r => <const>[module, r])),
          reduce((acc, v) => [...acc, v], [] as [IModule, IModuleInitOutput][]),
        )),
      )),
      tap((modulesEntries) => {
        const modules = modulesEntries.map(([module]) => module)
        if (modules.find(v => v.$$fake)) {
          this.logger.info('All module loaded success !');
        } else {
          modules.forEach(v => v.$$loaded = true);
          this.logger.info(`Module: ${modules.map(({$$name}) => $$name).join(', ')} loaded !`);
        }
      }),
      share()
    )
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
    return new Promise<void>(resolve => {
      const Subscription = this.output$.subscribe(([[module]]) => {
        if (module.$$fake) {
          resolve();
          Subscription.unsubscribe();
        }
      });
      this.source$.next(args);
    })
  }

  /**
   * 重试加载失败的模块
   */
  retryAborted<T extends S>(...args: T) {
    this.source$.next(args);
  }
}
