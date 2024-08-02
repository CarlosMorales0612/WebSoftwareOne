import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
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

@Component({
  selector: 'app-delete-task',
  standalone: true,
  imports: [
    CommonModule,
    DataTablesModule,
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
  data : TaskModel [] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;
  @Input() selectedDeleteTask: TaskModel | null = null;
  @Output() eventDeleteTask = new EventEmitter<{ success: boolean, message: string }>();
  

  constructor(private service: TastsService, private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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
    if (this.selectedDeleteTask && this.selectedDeleteTask.titleTask) {
      this.service.deleteTaskByTitle(this.selectedDeleteTask.titleTask).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Tarea eliminada',
            detail: 'La tarea fue eliminada con éxito',
            life: 2000
          });
          this.eventDeleteTask.emit({ success: true, message: 'Tarea eliminada exitosamente' });
          this.closeModal();
        },
        (error) => {
          console.error('Error al eliminar la tarea', error);
          this.errorMessage = error.error?.message || 'Error desconocido al eliminar la tarea.';
        }
      );
    }
  }
}

  


