import { createContext, useContext } from 'react';
import initState, { IState } from './state';
import { BehaviorSubject } from 'rxjs';
import { share } from 'rxjs/operators';

const update$ = new BehaviorSubject(initState)
const context = createContext({
  state$: update$.pipe(share()),
  update(nextState: IState) { update$.next(nextState); }
});

const { Provider } = context

export {
  context,
  Provider
}
