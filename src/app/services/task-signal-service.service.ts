import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskSignalServiceService {
  private taskCreatedSignal: WritableSignal<{ success: boolean, message: string } | null> = signal(null);

  getTaskCreatedSignal() {
    return this.taskCreatedSignal;
  }

  setTaskCreatedSignal(signal: { success: boolean, message: string } | null) {
    this.taskCreatedSignal.set(signal);
  }

  constructor() { }
}
