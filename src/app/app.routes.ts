import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then(m => m.HomePage),
  },
  {
    path: 'edit-task/:id',
    loadComponent: () =>
      import('./pages/edit-task/edit-task.page').then(m => m.EditTaskPage),
  },
  {
    path: 'motivation',
    loadComponent: () =>
      import('./pages/motivation/motivation.page').then(m => m.MotivationPage),
  },
];
