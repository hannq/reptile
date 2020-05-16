import { Subject, from } from 'rxjs';
import { concatMap, mapTo, mergeAll } from 'rxjs/operators';

export interface IModule {
  init(...args): void;
}

export class ModuleRegister<S> {
  private readonly moduleList: IModule[] = []
  constructor(
    private readonly subject: Subject<S>
  ) {

  }

  tap(module: IModule) {
    this.moduleList.push(module);
    return () => {
      const index = this.moduleList.indexOf(module);
      !!~index && this.moduleList.splice(index, 1);
    }
  }

  call<T extends any[]>(...args: T) {
    this.subject
      .pipe(mapTo(from(this.moduleList)), mergeAll())
      .pipe(concatMap(module => from(Promise.resolve(module.init(...args)))))
      .toPromise()
  }

  retry() {
    this.subject.next();
  }

  retryAborted() {
    this.subject.next();
  }
}

const subject = new Subject();

// function Foo<T extends readonly any[]> (...args: T): T {
//   return args;
// }

// Foo(() => {}, 'aaaa', 'ccccc')

export default new ModuleRegister(subject)

