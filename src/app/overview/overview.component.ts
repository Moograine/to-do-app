import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaskItemModel } from '../core/models/task-item.model';
import { catchError, Subject, takeUntil } from 'rxjs';
import { TaskService } from '../core/services/task.service';
import { Router } from '@angular/router';
import { AppState } from '../../store';
import { Store } from '@ngrx/store';
import { setTaskItems } from '../../store/element.actions';
import { NotificationService } from '../core/services/notification.service';

@Component({
  selector: 'app-ww',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
  unsubscribe: Subject<boolean> = new Subject<boolean>();
  showConfirmModal = false;
  selectedItemIndex = -1;
  taskItems: TaskItemModel[] = [];

  constructor(private taskService: TaskService,
              private router: Router,
              private store: Store<AppState>,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.getTaskItems();
  }

  getTaskItems(): void {
    this.taskService.getTaskItems().pipe(takeUntil(this.unsubscribe)).subscribe((taskEntries: TaskItemModel[]): void => {
      this.taskItems = taskEntries;
    });
  }

  onDragStart(event: DragEvent, index: number): void {
    event.dataTransfer?.setData('text/plain', index.toString());
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, dropIndex: number): void {
    event.preventDefault();
    const draggedIndex = Number(event.dataTransfer?.getData('text/plain'));
    if (!isNaN(draggedIndex)) {
      const [draggedItem] = this.taskItems.splice(draggedIndex, 1);
      this.taskItems.splice(dropIndex, 0, draggedItem);
    }
  }

  openConfirmModal(index: number): void {
    this.selectedItemIndex = index;
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.selectedItemIndex = -1;
    this.showConfirmModal = false;
  }

  deleteItem(): void {
    if (this.selectedItemIndex > -1) {
      this.taskService.deleteTask(this.selectedItemIndex).pipe(
        takeUntil(this.unsubscribe),
        catchError(() => {
          this.showNotification('error', 'Deleting this task is not possible at this time.', '');
          return []; /* Return an empty observable or a default value to continue the observable chain */
        })).subscribe((): void => {
        this.getTaskItems();
        this.showNotification('success', 'Task deleted!', '');

      });
    }
    this.closeConfirmModal();
  }
  showNotification(severity: string, summary: string, detail: string): void {
    this.notificationService.displayNotification(severity, summary, detail);
  }

  editItem(item: TaskItemModel): void {
    this.store.dispatch(setTaskItems({ taskItem: item }));
    this.router.navigate(['edit']).then();
    // TODO pass this.taskItems to NGRX Store, in order to read the data in the edit.component.ts
  }

  createItem(): void {
    this.router.navigate(['create']).then();
  }

  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }
}
