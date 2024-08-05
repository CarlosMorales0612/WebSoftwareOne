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






