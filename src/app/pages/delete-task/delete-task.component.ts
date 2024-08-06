import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TaskModel } from '../../models/taskModel';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { TastsService } from '../../services/tasts.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ListTaskComponent } from '../list-task/list-task.component';
import { TaskSignalServiceService } from '../../services/task-signal-service.service';

@Component({
  selector: 'app-delete-task',
  standalone: true,
  imports: [
    CommonModule,
    CreateTaskComponent,
    EditTaskComponent,
    ListTaskComponent,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputSwitchModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  templateUrl: './delete-task.component.html',
  styleUrl: './delete-task.component.css'
})
export class DeleteTaskComponent {

  listAllTasks: TaskModel[] = [];
  selectedTask: TaskModel | null = null;
  data : TaskModel [] = [];


  constructor(private service: TastsService, private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private taskSignalService: TaskSignalServiceService
   ) {}

   closeModal(): void {
    const deleteForm = document.getElementById('deleteTaskModal');
    if (deleteForm) {
      const bsModal = (window as any).bootstrap.Modal.getInstance(deleteForm) || new (window as any).bootstrap.Modal(deleteForm);
      bsModal.hide();
    }
  }
    
 

  // Confirmar eliminación de la tarea
  
  confirmDelete(): void {
    const taskToDelete = this.taskSignalService.getSelectedDeleteTaskSignal()();
    if (taskToDelete) {
      this.service.deleteTaskByTitle(taskToDelete.titleTask).subscribe(
        () => {
          this.taskSignalService.setTaskDeletedSignal({ success: true, message: 'Tarea eliminada exitosamente' });
          this.taskSignalService.setHidenMessage(true);
          this.closeModal(); 
        },
        (error) => {
          this.taskSignalService.setTaskDeletedSignal({ success: false, message: 'Error al eliminar la tarea' });
          this.taskSignalService.setHidenMessage(true);
          this.closeModal(); 
        }
      );
    }
  }
  
  
}

  


