import {
  Component,
  OnInit,
} from '@angular/core';
import { TaskModel } from '../../models/taskModel';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TastsService } from '../../services/tasts.service';
import { TaskSignalServiceService } from '../../services/task-signal-service.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectButtonModule],
  providers: [MessageService],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css',
})
export class EditTaskComponent implements OnInit {
  selecTasks: TaskModel[] = [];
  loadTask: any = {};

  updateTaskForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  originalTaskData: TaskModel | null = null;
  formSubmitted = false;

  stateOptions: { label: string; value: boolean }[] = [
    { label: 'Pendiente', value: false },
    { label: 'Completada', value: true },
  ];

  constructor(
    private fb: FormBuilder,
    private taskService: TastsService,
    private router: Router,
    private messageService: MessageService,
    private taskSignalService: TaskSignalServiceService
  ) {
    this.updateTaskForm = this.fb.group({
      titleTask: ['', [Validators.required,Validators.minLength(3), Validators.maxLength(25)]],
      descriptionTask: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(40)]],
      creationTask: [{ value: '', disabled: true }, Validators.required],
      completedTask: [false],
    });
  }

  ngOnInit(): void {}
  initializeData(): void {
    const taskSignal = this.taskSignalService.getSelectedTaskSignal();
    const taskSelect = taskSignal();
    console.log('datos', taskSelect);

    if (taskSelect) {
      this.updateTaskForm.patchValue({
        titleTask: taskSelect.titleTask,
        descriptionTask: taskSelect.descriptionTask,
        creationTask: taskSelect.creationTask.split('T')[0],
        completedTask: taskSelect.completedTask,
      });
      this.originalTaskData = taskSelect; // Guarda los datos originales
    }
  }

  resetForm(): void {
    if (this.originalTaskData) {
      this.updateTaskForm.patchValue({
        titleTask: this.originalTaskData.titleTask,
        descriptionTask: this.originalTaskData.descriptionTask,
        creationTask: this.originalTaskData.creationTask.split('T')[0], // Asegúrate de que el formato sea correcto
        completedTask: this.originalTaskData.completedTask,
      });
    } else {
      this.updateTaskForm.reset({
        titleTask: '',
        descriptionTask: '',
        creationTask: '',
        completedTask: false,
      });
    }
  }

  closeModal(): void {
    const editTaskModal = document.getElementById('editTaskModal');
    if (editTaskModal) {
      const bsModal =
        (window as any).bootstrap.Modal.getInstance(editTaskModal) ||
        new (window as any).bootstrap.Modal(editTaskModal);
      bsModal.hide();
    }
  }

  updateTask(): void {
    this.formSubmitted = true;
    if (this.updateTaskForm.valid) {
      const updatedTask: TaskModel = this.updateTaskForm.value;

      if (this.verifyChangesTask(updatedTask)) {
        this.taskService.updateTask(updatedTask).subscribe(
          () => {
            this.taskSignalService.setTaskEditSignal({
              success: true,
              message: 'Tarea actualizada exitosamente',
            });
            this.taskSignalService.setHidenMessage(true);
            this.closeModal();
          },
          () => {
            this.taskSignalService.setTaskEditSignal({
              success: false,
              message: 'Error al actualizar la tarea',
            });
          }
        );
      } else {
        this.taskSignalService.setTaskEditSignal({
          success: false,
          message: 'No se realizaron cambios en la tarea',
        });
        this.closeModal();
      }
    } else {
      this.taskSignalService.setTaskEditSignal({
        success: false,
        message: 'Por favor, complete todos los campos requeridos.',
      });
    }
  }

  private resetFormListener(): void {
    this.resetForm(); // Restablecer los datos originales cuando el modal se cierre
  }

  private verifyChangesTask(updatedTask: TaskModel): any {
    return (
      this.originalTaskData &&
      (this.originalTaskData.titleTask !== updatedTask.titleTask ||
        this.originalTaskData.descriptionTask !== updatedTask.descriptionTask ||
        this.originalTaskData.completedTask !== updatedTask.completedTask)
    );
  }

  onUpdateTask(): void {
    this.formSubmitted = true; // Mostrar mensaje de error si el formulario es inválido
    if (this.updateTaskForm.valid) {
      this.updateTask();
    }
  }
}
