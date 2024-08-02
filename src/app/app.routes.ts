import { Routes } from '@angular/router';
import { ListTaskComponent } from './pages/list-task/list-task.component';
import { CreateTaskComponent } from './pages/create-task/create-task.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';

export const routes: Routes = [
    {path : '', component: ListTaskComponent},
    {path : 'listTasks', component: ListTaskComponent},
    {path: 'createTask', component: CreateTaskComponent},
    {path: 'updateTask', component: EditTaskComponent},
    {path: '**', redirectTo: '/listTasks'}

];
