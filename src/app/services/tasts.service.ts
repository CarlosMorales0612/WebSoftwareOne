import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsetting } from '../appsetting.ts/appsetting';
import { Observable } from 'rxjs';
import { TaskModel } from '../models/taskModel';


@Injectable({
  providedIn: 'root'
})
export class TastsService {

  private http = inject(HttpClient);
  private apiUrl = `${appsetting.apiUrl}/Task`;

  constructor() { }

  getAllTasks(): Observable<TaskModel[]> {
    return this.http.get<TaskModel[]>(this.apiUrl);
  }

  getByTasksTitle(TitleTask: string): Observable<TaskModel> {
    return this.http.get<TaskModel>(`${this.apiUrl}/${TitleTask}`);
  }

  createTask(taskModel: TaskModel): Observable<TaskModel> {
    return this.http.post<TaskModel>(this.apiUrl, taskModel)
  }

  updateTask(taskTitle: TaskModel): Observable<TaskModel> {
    return this.http.put<TaskModel>(`${this.apiUrl}/${taskTitle.titleTask}` , taskTitle);
    }
  
  deleteTaskByTitle(title: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${title}`)  }
}

 // closeModal(): void {
  //   const deleteForm = document.getElementById('deleteTaskModal');
  //   if (deleteForm) {
  //     const bsModal = (window as any).bootstrap.Modal.getInstance(deleteForm) || new (window as any).bootstrap.Modal(deleteForm);
  //     bsModal.hide();
     
  //   }
  // }
    

  // // Abrir el modal de confirmación para eliminar
  // openConfirmDeleteModal(task: TaskModel): void {
  //   this.selectedTask = task;
  //   const deleteTaskModal = document.getElementById('deleteTaskModal');
  //   if (deleteTaskModal) {
  //     const bsModal = (window as any).bootstrap.Modal.getInstance(deleteTaskModal) || new (window as any).bootstrap.Modal(deleteTaskModal);
  //     bsModal.show();
  //   }
  // }

  // // Confirmar eliminación de la tarea

  // confirmDelete(): void {
  //   if (this.selectedTask && this.selectedTask.titleTask) {
  //     this.service.deleteTaskByTitle(this.selectedTask.titleTask).subscribe(
  //       (response) => {
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'Tarea eliminada',
  //           detail: 'La tarea fue eliminada con éxito',
  //           life: 2000
  //         });
  //         this.LoadAllTasks(); // Recargar la lista de tareas
  //         this.selectedTask = null;
  //         this.eventDeleteTask.emit({ success: true, message: 'Tarea eliminada exitosamente' });
  //         this.closeModal();
  //       },
  //       (error) => {
  //         console.error('Error al eliminar la tarea', error);
  //         this.errorMessage = error.error?.message || 'Error desconocido al eliminar la tarea.';
  //       }
  //     );
  //   }
  // }


  // handleDeleteTaskEvent(event: { success: boolean, message: string }) {
  //   if (event.success) {
  //     console.log(event.message); // Maneja el mensaje recibido
  //   }
  // }