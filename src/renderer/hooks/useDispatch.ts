import { useContext } from 'react';
import { useEventCallback } from 'rxjs-hooks';
import { tap, flatMap, withLatestFrom } from 'rxjs/operators';
import { context, IState, initState } from '../store';
import { produce } from 'immer';

export function useDispatch() {
  const { state$, update } = useContext(context);
  return useEventCallback<Partial<IState>, IState>((dispatch$, prevState$) => dispatch$.pipe(
    withLatestFrom(prevState$),
    tap(([payload, prevState]) => update({...prevState, ...payload})),
    flatMap(() => state$)
  ), initState);
}
