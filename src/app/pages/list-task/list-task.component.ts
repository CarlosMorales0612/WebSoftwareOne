import { Component, computed, effect, EventEmitter, OnInit, Output, signal, ViewChild, WritableSignal } from '@angular/core';
import { TastsService } from '../../services/tasts.service';
import { TaskModel } from '../../models/taskModel';
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
import { FormsModule } from '@angular/forms';



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
    DeleteTaskComponent,
    FormsModule
],
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class ListTaskComponent implements OnInit {
  searchText: string = '';
  listAllTasks = signal<TaskModel[]>([]);
  selectedTask: TaskModel | null = null;
  filteredTasks: TaskModel[] = []; 
  

  @ViewChild(EditTaskComponent) editTaskComponent!: EditTaskComponent;

  taskCreatedSignal = this.taskSignalService.getTaskCreatedSignal();
  taskEditSignal = this.taskSignalService.getTaskEditSignal();
  taskDeleteSignal = this.taskSignalService.getTaskDeletedSignal();


  showMessage = computed(() => {
    const successMessageShow = this.taskSignalService.getHidenMessage();
    const isVisible = successMessageShow();
    return isVisible;
  });

  successMessage = computed(() => {
    const taskCreated = this.taskCreatedSignal();
    this.LoadAllTasks();
    return taskCreated?.success ? taskCreated : null;
  });
  
  errorMessage = computed(() => {
    const taskCreated = this.taskCreatedSignal();
    return taskCreated && !taskCreated.success ? taskCreated.message : null;
  });

  successMessageEdit = computed(() => {
    const taskEdited = this.taskEditSignal();
    this.LoadAllTasks();
    return taskEdited?.success ? taskEdited : null;
  });

  errorMessageEdit = computed(() => {
    const taskEdited = this.taskEditSignal();
    return taskEdited && !taskEdited.success ? taskEdited.message : null;
  });

  successMessageDelete = computed(() => {
    const taskDelete = this.taskDeleteSignal();
    this.LoadAllTasks();
    return taskDelete?.success ? taskDelete : null;
  });

  errorMessageDelete = computed(() => {
    const taskDelete = this.taskDeleteSignal();
    return taskDelete && !taskDelete.success ? taskDelete.message : null;
  });

  constructor(
    private service: TastsService,
    private messageService: MessageService,
    private taskSignalService: TaskSignalServiceService
  ) {
    
  }

  ngOnInit(): void {
    this.LoadAllTasks();

  }

  resetSignal(): void {
    this.taskSignalService.setTaskCreatedSignal(null);
    this.taskSignalService.setTaskEditSignal(null); // Reinicia la señal a null
    this.taskSignalService.setTaskDeletedSignal(null);
  }

  filterTasksTitle(){
    const searchTextLower = this.searchText.toLowerCase();
    this.filteredTasks = this.listAllTasks().filter(searchTask => 
      searchTask.titleTask.toLowerCase().includes(searchTextLower)
    )
   }
  

  LoadAllTasks(): void {
    this.service.getAllTasks().subscribe(
      (data: TaskModel[]) => {
        this.listAllTasks.set(data);
        this.filteredTasks = data;
        setTimeout(() => {
          this.taskSignalService.setHidenMessage(false);
          this.resetSignal();
        }, 4000);
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
    this.taskSignalService.setSelectedTask(task);
    this.selectedTask = task;
    const editTaskModal = document.getElementById('editTaskModal');
    if (editTaskModal) {
      const bsModal = (window as any).bootstrap.Modal.getInstance(editTaskModal) || new (window as any).bootstrap.Modal(editTaskModal);
      bsModal.show();
      setTimeout(() => {
        if (this.editTaskComponent) {
          this.editTaskComponent.initializeData();
        }
      }, 0);
    }

  }

  openDeleteTask(task: TaskModel): void {
    this.taskSignalService.setSelectedTask(task);
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

  


