import { Component, computed, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TastsService } from '../../services/tasts.service';
import { TaskSignalServiceService } from '../../services/task-signal-service.service';
import { MessageService } from 'primeng/api';
import { TaskModel } from '../../models/taskModel';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [MessageService],
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {

  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskService: TastsService,
    private messageService: MessageService,
    private taskSignalService: TaskSignalServiceService
  ) {
    this.taskForm = this.fb.group({
      titleTask: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      descriptionTask: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(40)]],
      creationTask: [new Date().toISOString().split('T')[0], Validators.required],
      completedTask: [false]
    });
  }

  ngOnInit(): void {
    const modalElement = document.getElementById('taskModal');
    if (modalElement) {
      const bsModal = (window as any).bootstrap.Modal.getInstance(modalElement) || new (window as any).bootstrap.Modal(modalElement);
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.resetForm();
      });
    }
  }

  get f() {
    return this.taskForm.controls;
  }

  closeModal(): void {
    const taskForm = document.getElementById('taskModal');
    if (taskForm) {
      const bsModal = (window as any).bootstrap.Modal.getInstance(taskForm) || new (window as any).bootstrap.Modal(taskForm);
      bsModal.hide();
      this.resetForm();
    }
  }

  loadNewTask() {
    if (this.taskForm.valid) {
      const newTask: TaskModel = this.taskForm.value;
      newTask.creationTask = new Date(newTask.creationTask).toISOString();
  
      this.taskService.createTask(newTask).subscribe(
        () => {
          this.taskSignalService.setTaskCreatedSignal({ success: true, message: 'Tarea creada exitosamente' });
          this.taskSignalService.setHidenMessage(true);
          this.closeModal();
        },
        (error) => {
          this.taskSignalService.setTaskCreatedSignal({ success: false, message: 'Error al crear la tarea' });
        }
      );
    }
  }

  resetForm(): void {
    this.taskForm.reset({
      titleTask: '',
      descriptionTask: '',
      creationTask: new Date().toISOString().split('T')[0],
      completedTask: false
    });
  }

  
espaceWhite(controlTitle: string): void {
  const titleTaskEspace = this.taskForm.get(controlTitle);
  if (titleTaskEspace && titleTaskEspace.value) {
    titleTaskEspace.setValue(titleTaskEspace.value.trim());
  }
}

}