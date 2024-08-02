import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { TaskModel } from '../../models/taskModel';
import { TastsService } from '../../services/tasts.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [MessageService],
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit{

  taskForm : FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  //Emitir evento
  @Output() eventTaskCreate = new EventEmitter<{ success: boolean, message: string }>();


  constructor(
    private fb : FormBuilder,
    private taskService : TastsService,
    private router: Router,
    private messageService: MessageService)
    {
      this.taskForm = this.fb.group({
        titleTask : ['', [Validators.required, Validators.maxLength(20), Validators.minLength(4)]],
        descriptionTask : ['', [Validators.required, Validators.maxLength(10)]],
        creationTask: [new Date().toISOString().split('T')[0], Validators.required],
        completedTask: [false]
      })
    }
    ngOnInit(): void {
      // Configura el reinicio del formulario cuando el modal se cierra
      const modalElement = document.getElementById('taskModal');
      if (modalElement) {
        const bsModal = (window as any).bootstrap.Modal.getInstance(modalElement) || new (window as any).bootstrap.Modal(modalElement);
    
        // Asegúrate de reiniciar el formulario cuando el modal se cierra
        modalElement.addEventListener('hidden.bs.modal', () => {
          this.resetForm(); // Reinicia el formulario cuando el modal se cierra
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
            this.messageService.add({
              severity: 'success',
              summary: 'Tarea creada',
              detail: 'La tarea fue creada con éxito',
              life: 100
            });
            this.eventTaskCreate.emit({ success: true, message: 'Tarea se creo exitosamente' });
            this.closeModal();
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
}
