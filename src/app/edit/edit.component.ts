import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaskItem, TaskItemModel } from '../core/models/task-item.model';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { selectTaskItem } from '../../store/element.reducer';
import { catchError, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TaskService } from '../core/services/task.service';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { NotificationService } from '../core/services/notification.service';

@Component({
  selector: 'app-edit-listw',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: [DatePipe]
})
export class EditComponent implements OnInit, OnDestroy {
  unsubscribe: Subject<boolean> = new Subject<boolean>();
  taskItem: TaskItemModel = new TaskItem();
  isCreatorMode = true;

  constructor(private store: Store<AppState>,
              private router: Router,
              private datePipe: DatePipe,
              private taskService: TaskService,
              private messageService: MessageService,
              private primengConfig: PrimeNGConfig,
              private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.getTaskItem();
    this.primengConfig.ripple = true;
  }

  getTaskItem(): void {
    this.store.pipe(takeUntil(this.unsubscribe), select(selectTaskItem))
      .subscribe((taskItem: TaskItemModel) => {
        this.taskItem = { ...taskItem } || new TaskItem();
        this.checkEditMode();
      });
  }

  navigateToOverview(): void {
    this.router.navigate(['']).then();
  }

  checkEditMode(): void {
    /* Check if edit or creator mode is active */
    if (this.router.url.includes('edit')) {
      /* Check if task item is valid, otherwise re-route to Overview */
      this.taskItem.title === '' ? this.navigateToOverview() : this.isCreatorMode = false;
    }
    if (this.router.url.includes('create')) {
      this.taskItem = new TaskItem();
    }
    /* Format date to YYYY-MM-dd */
    const formattedDate = this.datePipe.transform(this.taskItem.deadline, 'yyyy-MM-dd');
    if (formattedDate) {
      this.taskItem.deadline = formattedDate;
    }

  }

  isFormValid(): boolean {
    return !!this.taskItem.title.length;
  }

  submitTask(): void {
    this.isCreatorMode ? this.createTask() : this.updateTask();
  }

  updateTask(): void {
    this.taskService.updateTask(this.taskItem).pipe(
      takeUntil(this.unsubscribe),
      catchError(() => {
        this.showNotification('error', 'Editing is not possible at this time.', '');
        return []; /* Return an empty observable or a default value to continue the observable chain */
      })).subscribe((): void => {
      this.showNotification('success', 'Task updated!', '');
      this.navigateToOverview();
    });
  }

  createTask(): void {
    this.taskService.createTask(this.taskItem).pipe(
      takeUntil(this.unsubscribe),
      catchError(() => {
        this.showNotification('error', 'Creating a new task is not possible at this time.', '');
        return []; /* Return an empty observable or a default value to continue the observable chain */
      })).subscribe((): void => {
      this.showNotification('success', 'New Task Created!', '');
      this.navigateToOverview();
    });
  }

  showNotification(severity: string, summary: string, detail: string): void {
    this.notificationService.displayNotification(severity, summary, detail);
  }

  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.unsubscribe();
  }
}
