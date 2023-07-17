import { createReducer, createSelector, on } from '@ngrx/store';
import { setTaskItems } from './element.actions';
import { TaskItem, TaskItemModel } from '../app/core/models/task-item.model';
import { AppState } from './index';

export interface ElementState {
  taskItem: TaskItemModel;
}

export const initialState: ElementState = {
  taskItem: new TaskItem()
};

export const elementReducer = createReducer(
  initialState,
  on(setTaskItems, (state, { taskItem }) => ({ ...state, taskItem }))
);

export const selectElementState = (state: AppState) => state.element;

export const selectTaskItem = createSelector(
  selectElementState,
  (state: ElementState) => state.taskItem
);
