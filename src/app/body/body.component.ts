import { style } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MembresComponent } from '../membres/membres.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LoginComponent } from '../login/login.component';

import { PostesComponent } from '../postes/postes.component';



@Component({
  selector: 'app-body',
  standalone: true,
  
  imports: [CommonModule,RouterModule,DashboardComponent,MembresComponent,PostesComponent],
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css'] 
})
export class BodyComponent  implements OnInit{
  @Input() collapsed=false;
  @Input() screenWidth =0;
  constructor() { }

  ngOnInit(): void {
  }
getBodyClass():string{
let styleClass='';
if(this.collapsed && this.screenWidth> 768){
styleClass='body-trimmed'

}
else if(this.collapsed && this.screenWidth<=738 && this.screenWidth>0){
styleClass='body-md-screen';
}
  return styleClass;
}
}
