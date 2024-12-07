// src/main.ts
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, RouterModule } from '@angular/router';

import { BodyComponent } from './app/body/body.component';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptorService } from './app/services/security/auth-interceptor.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AuthService } from './app/services/auth.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CustomPaginationComponent } from './app/shared/custom-pagination/custom-pagination.component';

import { TokenStorageService } from './app/services/token-storage.service';
import { routes } from './app/app.routes';

import { SignaleService } from './app/services/signale.service';
import { MessageMailService } from './app/services/message-mail.service';
import { RoleGuard } from './app/services/guard/role-guard.service';
import { AuthGuard } from './app/services/guard/auth-guard.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      HttpClientModule,
      BrowserAnimationsModule,
      FormsModule,
      ReactiveFormsModule,RouterModule, NgApexchartsModule, NgxPaginationModule,
    ),
  
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
   
    SignaleService,
    AuthGuard,
    RoleGuard,
    AuthService,
    TokenStorageService,
    MessageMailService,
  

  ]
}).catch(err => console.error(err));