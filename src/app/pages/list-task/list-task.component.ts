import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TastsService } from '../../services/tasts.service';
import { TaskModel } from '../../models/taskModel';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
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


@Component({
  selector: 'app-list-task',
  standalone: true,
  imports: [
    CommonModule,
    DataTablesModule,
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

  listAllTasks: TaskModel[] = [];
  selectedTask: TaskModel | null = null;
  data : TaskModel [] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;


  constructor(private service: TastsService, private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
   ) {}

  ngOnInit(): void {
    this.LoadAllTasks(); // Método para cargar todas las tareas
  }

  // Cargar todas las tareas
  LoadAllTasks(): void {
    this.service.getAllTasks().subscribe(
      (data: TaskModel[]) => {
        this.listAllTasks = data;
      },
      (error) => {
        console.error('Error al cargar las tareas', error);
      }
    );
  }

  // Abrir el modal de creación de tarea
  openCreateTask(): void {
    const createTaskModal = document.getElementById('taskModal');
    if (createTaskModal) {
      const bsModal = (window as any).bootstrap.Modal.getInstance(createTaskModal) || new (window as any).bootstrap.Modal(createTaskModal);
      bsModal.show();
    }
  }

  // Abrir el modal de edición de tarea
  openUpdateTask(task: TaskModel): void {
    this.selectedTask = task;
    const editTaskModal = document.getElementById('editTaskModal');
    if (editTaskModal) {
      const bsModal = (window as any).bootstrap.Modal.getInstance(editTaskModal) || new (window as any).bootstrap.Modal(editTaskModal);
      bsModal.show();
    }
  }

    // Abrir el modal de edición de tarea
    openDeleteTask(task: TaskModel): void {
      this.selectedTask = task;
      const deleteTaskModal = document.getElementById('deleteTaskModal');
      if (deleteTaskModal) {
        const bsModal = (window as any).bootstrap.Modal.getInstance(deleteTaskModal) || new (window as any).bootstrap.Modal(deleteTaskModal);
        bsModal.show();
      }
    }
  
  // Obtener la clase de estado para las tareas
  getStatusClass(completed: boolean): string {
    return completed ? 'task-status-completed' : 'task-status-pending';
  }

  // Obtener la información del estado de la tarea
  getStatusInfo(completed: boolean): { name: string, color: string } {
    return completed ? 
      { name: 'Completada', color: 'green' } :
      { name: 'Pendiente', color: 'red' };
  }

  // Manejar la actualización de tareas
  handleTaskUpdate(event: { success: boolean, message: string }): void {
    if (event.success) {
      this.successMessage = event.message;
      this.errorMessage = null;
      setTimeout(() => this.successMessage = null, 5000); // Limpia el mensaje después de 5 segundos
      this.LoadAllTasks(); // Recargar la lista de tareas
    } else {
      this.errorMessage = event.message;
      this.successMessage = null;
      setTimeout(() => this.errorMessage = null, 5000); // Limpia el mensaje después de 5 segundos
    }
  }

 
  

}
