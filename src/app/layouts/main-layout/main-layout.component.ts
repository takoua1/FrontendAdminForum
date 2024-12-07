import { Component, OnInit } from '@angular/core';
import { SidenavComponent } from '../../sidenav/sidenav.component';
import { BodyComponent } from '../../body/body.component';
import { SublevelMenuComponent } from '../../sidenav/sublevel-menu.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
interface SideNavToggle{

  screenWidth:number;
  collapsed:boolean;
  }
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule,SidenavComponent,BodyComponent,SublevelMenuComponent,RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent  implements OnInit{
  isLoggedIn =true;
  isSedeNavCollapsed =false;
  screenWidth=0;


  onToggleSideNav(data:SideNavToggle):void{

    this.screenWidth =data.screenWidth;
    this.isSedeNavCollapsed =data.collapsed;
  }
 
  ngOnInit(): void {
    

  }
}
