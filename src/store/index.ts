import { ActionReducerMap } from '@ngrx/store';
import { elementReducer, ElementState } from './element.reducer';

export interface AppState {
  element: ElementState;
}

export const reducers: ActionReducerMap<AppState> = {
  element: elementReducer
};
