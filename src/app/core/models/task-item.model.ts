export interface TaskItemModel {
  id: number;
  title: string;
  description: string;
  deadline: Date | string;
}

export class TaskItem implements TaskItemModel {
  id = -1;
  title = '';
  description = '';
  deadline = new Date();

  constructor() {
  }
}
