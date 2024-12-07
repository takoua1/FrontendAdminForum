import { Component } from '@angular/core';
import { SidenavComponent } from '../../sidenav/sidenav.component';
import { BodyComponent } from '../../body/body.component';
import { SublevelMenuComponent } from '../../sidenav/sublevel-menu.component';
import { LoginComponent } from '../../login/login.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {
  
}
