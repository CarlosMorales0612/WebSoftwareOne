import { Injectable, signal, WritableSignal } from '@angular/core';
import { TaskModel } from '../models/taskModel';

@Injectable({
  providedIn: 'root'
})
export class TaskSignalServiceService {
  private taskCreatedSignal: WritableSignal<{ success: boolean, message: string } | null> = signal(null);
  private taskEditSignal: WritableSignal<{ success: boolean, message: string } | null> = signal(null);
  private selectedTaskSignal: WritableSignal<TaskModel | null> = signal(null); // Nueva señal
  private DeleteTaskSignal: WritableSignal<{ success: boolean, message: string } | null> = signal(null);
  private hiddenMessageSignal: WritableSignal<boolean> = signal(false);

  getHidenMessage(): WritableSignal<boolean> {
    return this.hiddenMessageSignal;
  }

  setHidenMessage(value: boolean): void {
    this.hiddenMessageSignal.set(value);
  }

  getTaskCreatedSignal() {
    return this.taskCreatedSignal;
  }

  setTaskCreatedSignal(signal: { success: boolean, message: string } | null) {
    this.taskCreatedSignal.set(signal);
  }

  getTaskEditSignal() {
    return this.taskEditSignal;
  }

  setTaskEditSignal(signal: { success: boolean, message: string } | null) {
    this.taskEditSignal.set(signal);
  }
    // Métodos para tarea seleccionada
   
  getSelectedTaskSignal(): WritableSignal<TaskModel | null> {
    return this.selectedTaskSignal;
  }

  setSelectedTask(task: TaskModel | null): void {
    this.selectedTaskSignal.set(task);
  }
 
  getTaskDeletedSignal() {
  return this.DeleteTaskSignal;
  }

  getSelectedDeleteTaskSignal(): WritableSignal<TaskModel | null> {
    return this.selectedTaskSignal;
  }

  setTaskDeletedSignal(signal: { success: boolean, message: string } | null) {
    this.DeleteTaskSignal.set(signal);
  }
  


  constructor() { }
}
