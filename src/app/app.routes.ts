import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';

export const routes:Routes=[
  {path:'',component: AuthComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
