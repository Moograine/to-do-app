import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})


export class NotificationService {
  constructor(private messageService: MessageService) {
  }

  displayNotification(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail, life: 1500});
  }
}
