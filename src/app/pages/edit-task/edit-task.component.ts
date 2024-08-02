import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { TaskModel } from '../../models/taskModel';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule , Validators} from '@angular/forms';
import { TastsService } from '../../services/tasts.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SelectButtonModule } from 'primeng/selectbutton';


@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectButtonModule
  
  ],
  providers: [MessageService],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css'
})
export class EditTaskComponent implements OnInit{
  @Input() taskToEdit: TaskModel | null = null;
  @Output() taskUpdated = new EventEmitter<{ success: boolean, message: string }>();

  selecTasks: TaskModel[] = [];
  loadTask : any = {};
  
  updateTaskForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  originalTaskData: TaskModel | null = null;
  formSubmitted = false;

  stateOptions: { label: string, value: boolean }[] = [
    { label: 'Pendiente', value: false },
    { label: 'Completada', value: true }
  ];

  constructor(
    private fb : FormBuilder,
    private taskService : TastsService, 
    private router: Router,
    private messageService: MessageService) 
    {
      this.updateTaskForm = this.fb.group({
        titleTask: ['', [Validators.required, Validators.maxLength(10)]],
        descriptionTask: ['', [Validators.required, Validators.maxLength(10)]],
        creationTask: [{ value: '', disabled: true }, Validators.required],
        completedTask: [false]
      });


      
    }
    ngOnInit(): void {
    
    }
    resetForm(): void {
      if (this.originalTaskData) {
        this.updateTaskForm.patchValue({
          titleTask: this.originalTaskData.titleTask,
          descriptionTask: this.originalTaskData.descriptionTask,
          creationTask: this.originalTaskData.creationTask.split('T')[0], // Asegúrate de que el formato sea correcto
          completedTask: this.originalTaskData.completedTask
        });
      } else {
        this.updateTaskForm.reset({
          titleTask: '',
          descriptionTask: '',
          creationTask: '', // Deja el campo vacío si no hay datos originales
          completedTask: false
        });
      }
    }
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['taskToEdit'] && this.taskToEdit) {
        this.obtainDataTask(this.taskToEdit.titleTask); // Actualizar el formulario
      }
    }


    closeModal(): void {
      const editTaskModal = document.getElementById('editTaskModal');
      if (editTaskModal) {
        const bsModal = (window as any).bootstrap.Modal.getInstance(editTaskModal) || new (window as any).bootstrap.Modal(editTaskModal);
        bsModal.hide();
        // Asegúrate de que el evento se registre solo una vez
        editTaskModal.removeEventListener('hidden.bs.modal', this.resetFormListener);
        editTaskModal.addEventListener('hidden.bs.modal', this.resetFormListener.bind(this));
      }
    }
  
    
    obtainDataTask(title: string): void {
      this.taskService.getByTasksTitle(title).subscribe((data: TaskModel) => {
        this.originalTaskData = data; 
        this.updateTaskForm.setValue({
          titleTask: data.titleTask,
          descriptionTask: data.descriptionTask,
          creationTask: data.creationTask.split('T')[0], // Asegúrate de que el formato sea correcto
          completedTask: data.completedTask
        });
      }, (error) => {
        console.error('Error al obtener la tarea', error);
      });
    }


    updateTask(): void {
      this.formSubmitted = true;
      if (this.updateTaskForm.valid) {
        const updatedTask: TaskModel = this.updateTaskForm.value;
        if (this.verifyChangesTask(updatedTask)) {
          this.taskService.updateTask(updatedTask).subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Tarea actualizada',
              detail: 'La tarea fue actualizada con éxito',
              life: 2000
            });
            this.taskUpdated.emit({ success: true, message: 'Tarea actualizada exitosamente' });
            this.closeModal();
          });
        } else {
          this.messageService.add({
            severity: 'info',
            summary: 'Sin cambios',
            detail: 'No se realizaron cambios en la tarea',
            life: 100
          });
          this.taskUpdated.emit({ success: false, message: 'No se realizaron cambios en la tarea' });
          this.closeModal();
        }
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Por favor, complete todos los campos requeridos.',
          life: 2000
        });
        this.taskUpdated.emit({ success: false, message: 'Por favor, complete todos los campos requeridos.' });
      }
    }
  
  private resetFormListener(): void {
    this.resetForm(); // Restablecer los datos originales cuando el modal se cierre
  }

  private verifyChangesTask(updatedTask: TaskModel): any {
      return this.originalTaskData &&
      (this.originalTaskData.titleTask !== updatedTask.titleTask ||
       this.originalTaskData.descriptionTask !== updatedTask.descriptionTask ||
       this.originalTaskData.completedTask !== updatedTask.completedTask);
  }


  onUpdateTask(): void {
    this.formSubmitted = true; // Mostrar mensaje de error si el formulario es inválido
    if (this.updateTaskForm.valid) {
      this.updateTask();
    }
  }
}
