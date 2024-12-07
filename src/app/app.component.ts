import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { SidenavComponent } from './sidenav/sidenav.component';
import { BodyComponent } from './body/body.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MembresComponent } from './membres/membres.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Chart } from 'chart.js/dist';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';
import { SublevelMenuComponent } from './sidenav/sublevel-menu.component';
import { CustomPaginationComponent } from './shared/custom-pagination/custom-pagination.component';
import { TokenStorageService } from './services/token-storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  
  imports: [ SidenavComponent, BodyComponent, LoginComponent,CommonModule,RouterModule,SublevelMenuComponent],

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'AdminForum';
 
  constructor(private router: Router) {}
  
  ngOnInit(): void {
  /*  this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Force a full page reload on navigation
        window.location.reload();
      }
    });*/
  }

  }
 
  

