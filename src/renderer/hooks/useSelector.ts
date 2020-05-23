import { useContext } from 'react';
import { useObservable } from 'rxjs-hooks';
import { pluck, map } from 'rxjs/operators';
import { context, IState } from '../store';

type FixUnknown<T, R> = T extends unknown ? R : T;

export function useSelector<K extends keyof IState, R extends unknown>(key: K, selector?: (state: IState[K]) => R): FixUnknown<R, IState[K]> {
  // @ts-ignore
  selector = selector || (_ => _);
  const { state$ } = useContext(context);
  const selected = useObservable(_selector$ => state$.pipe(
    pluck(key),
    map(selector)
  ))
  // @ts-ignore
  return selected
}
