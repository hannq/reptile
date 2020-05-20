import { ipcRenderer } from 'electron';
import { IPC_KEYS, INoFuncConfig } from '@config';
import { Subject, combineLatest, of, asyncScheduler } from 'rxjs';
import { share } from 'rxjs/operators';

const config$ = new Subject<INoFuncConfig>();

ipcRenderer.on(IPC_KEYS.CONFIT, function(_, config: INoFuncConfig) {
  config$.next(config);
})

export function getConfigStream() {
  ipcRenderer.send(IPC_KEYS.CONFIT);
  return config$.pipe(share());
}
