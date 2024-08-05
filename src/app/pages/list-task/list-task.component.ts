import { Component, computed, effect, EventEmitter, OnInit, Output, signal, ViewChild, WritableSignal } from '@angular/core';
import { TastsService } from '../../services/tasts.service';
import { TaskModel } from '../../models/taskModel';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { EditTaskComponent } from '../edit-task/edit-task.component'; 
import { TableModule } from 'primeng/table'; 
import { ButtonModule } from 'primeng/button'; 
import { InputTextModule } from 'primeng/inputtext'; 
import { InputSwitchModule } from 'primeng/inputswitch'; 
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog'; 
import { ToastModule } from 'primeng/toast';
import { DeleteTaskComponent } from "../delete-task/delete-task.component";
import { TaskSignalServiceService } from '../../services/task-signal-service.service';


@Component({
  selector: 'app-list-task',
  standalone: true,
  imports: [
    CommonModule,
    CreateTaskComponent,
    EditTaskComponent,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputSwitchModule,
    ConfirmDialogModule,
    ToastModule,
    DeleteTaskComponent
],
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class ListTaskComponent implements OnInit {

  listAllTasks = signal<TaskModel[]>([]);
  selectedTask: TaskModel | null = null;
  taskCreatedSignal = this.taskSignalService.getTaskCreatedSignal();

  successMessage = computed(() => {
    const taskCreated = this.taskCreatedSignal();
    return taskCreated?.success ? taskCreated.message : null;
  });
  
  errorMessage = computed(() => {
    const taskCreated = this.taskCreatedSignal();
    return taskCreated && !taskCreated.success ? taskCreated.message : null;
  });
  constructor(
    private service: TastsService,
    private messageService: MessageService,
    private taskSignalService: TaskSignalServiceService
  ) {
    effect(() => {
      const successMessage = this.successMessage();
      const errorMessage = this.errorMessage();
    
      if (successMessage) {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: successMessage });
        setTimeout(() => {
          this.messageService.clear();
          this.LoadAllTasks();
          // Aquí podrías intentar también restablecer el mensaje de éxito
          this.taskSignalService.setTaskCreatedSignal(null);
        }, 1000);
      }
    
      if (errorMessage) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
        setTimeout(() => this.messageService.clear(), 1000);
      }
    });
    
  }
  
  ngOnInit(): void {
    this.LoadAllTasks();

  }

  LoadAllTasks(): void {
    this.service.getAllTasks().subscribe(
      (data: TaskModel[]) => {
        this.listAllTasks.set(data);
      },
      (error) => {
        console.error('Error al cargar las tareas', error);
      }
    );
  }

  openCreateTask(): void {
    const createTaskModal = document.getElementById('taskModal');
    if (createTaskModal) {
      const bsModal = (window as any).bootstrap.Modal.getInstance(createTaskModal) || new (window as any).bootstrap.Modal(createTaskModal);
      bsModal.show();
    }
  }

  openUpdateTask(task: TaskModel): void {
    this.selectedTask = task;
    const editTaskModal = document.getElementById('editTaskModal');
    if (editTaskModal) {
      const bsModal = (window as any).bootstrap.Modal.getInstance(editTaskModal) || new (window as any).bootstrap.Modal(editTaskModal);
      bsModal.show();
    }
  }

  openDeleteTask(task: TaskModel): void {
    this.selectedTask = task;
    const deleteTaskModal = document.getElementById('deleteTaskModal');
    if (deleteTaskModal) {
      const bsModal = (window as any).bootstrap.Modal.getInstance(deleteTaskModal) || new (window as any).bootstrap.Modal(deleteTaskModal);
      bsModal.show();
    }
  }

  getStatusClass(completed: boolean): string {
    return completed ? 'task-status-completed' : 'task-status-pending';
  }

  getStatusInfo(completed: boolean): { name: string, color: string } {
    return completed ? 
      { name: 'Completada', color: 'green' } :
      { name: 'Pendiente', color: 'red' };
  }



}

  


