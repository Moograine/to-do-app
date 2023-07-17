import { createAction, props } from '@ngrx/store';
import { TaskItemModel } from 'src/app/core/models/task-item.model';

export const setTaskItems = createAction('[Task] Set Task Items', props<{ taskItem: TaskItemModel }>());
