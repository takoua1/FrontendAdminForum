import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MembresComponent } from './membres/membres.component';
import { LoginComponent } from './login/login.component';

import { Component } from '@angular/core';
import { PostesComponent } from './postes/postes.component';
import { CommentsComponent } from './comments/comments.component';
import { GroupsComponent } from './groups/groups.component';

import { SignaleComponent } from './signale/signale.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { RoleGuard } from './services/guard/role-guard.service';
import { AuthGuard } from './services/guard/auth-guard.service';
export const routes: Routes = [
  {
    path: 'login',
    component: AuthLayoutComponent,
    children: [
      { path: '', component: LoginComponent }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate:  [AuthGuard]  },
      { path: 'membres', component: MembresComponent, canActivate:  [AuthGuard]  },
      { path: 'statistique/postes', component: PostesComponent, canActivate:  [AuthGuard]  },
      { path: 'statistique/comments', component: CommentsComponent, canActivate:  [AuthGuard] },
      { path: 'statistique/groups', component: GroupsComponent, canActivate:  [AuthGuard]  },
      { path: 'signale', component: SignaleComponent, canActivate:  [AuthGuard] },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
  
 