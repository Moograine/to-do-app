import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskItemModel } from '../models/task-item.model';
import { HttpClient } from '@angular/common/http';
import { Environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  constructor(private http: HttpClient) {
  }

  getTaskItems(): Observable<TaskItemModel[]> {
    return <Observable<TaskItemModel[]>>this.http.get(`${Environment.defaultAPI}/api/tasks`);
  }

  updateTask(taskItem: TaskItemModel): Observable<TaskItemModel> {
    return <Observable<TaskItemModel>>this.http.put(`${Environment.defaultAPI}/api/tasks/${taskItem.id}`, taskItem);
  }

  createTask(taskItem: TaskItemModel): Observable<TaskItemModel> {
    return <Observable<TaskItemModel>>this.http.post(`${Environment.defaultAPI}/api/tasks`, taskItem);
  }

  deleteTask(taskId: number): Observable<TaskItemModel> {
    return <Observable<TaskItemModel>>this.http.delete(`${Environment.defaultAPI}/api/tasks/${taskId}`);
  }
}
