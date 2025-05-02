// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { HomePageComponent } from './home-page/home-page.component';

import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard'; // only if you need role‐based routes

const routes: Routes = [
  // redirect root to /login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // public
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },

  // protected – only logged‐in users can see /home
  {
    path: 'home',
    component: HomePageComponent,
    canActivate: [AuthGuard],
  },

  // example of a role‐guarded route
  // {
  //   path: 'admin',
  //   component: AdminPanelComponent,
  //   canActivate: [AuthGuard, RoleGuard],
  //   data: { roles: ['Admin', 'SuperUser'] }
  // },

  // fallback
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
