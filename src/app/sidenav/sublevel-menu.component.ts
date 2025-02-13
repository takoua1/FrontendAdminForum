import { Component, Input, input, OnInit } from '@angular/core';
import { INavbarData } from './helper';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterModule } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-sublevel-menu',
  standalone: true,
  imports: [CommonModule,RouterModule],
  template: `
    <ul *ngIf="collapsed && data.items && data.items.length > 0"
     class="sublevel-nav"  [@submenu]="expanded ? {value:'visible',params:{transitionParams:'400ms cubic-bezier(0.86,0,0.07,1)',height:'*'}}
     :{value:'hidden', params:{transitionParams:'400ms cubic-bezier(0.86,0,0.07,1)',height:'0'}}">
 <li *ngFor="let item of data.items" class="sublevel-nav-item">
  <a class="sublevel-nav-link"  *ngIf="item.items && item.items.length  > 0" (click)="handlClick(item)"> 
    <i class="sublevel-link-icon"[class]="item.icon"></i>
    <span class="sublevel-link-text" *ngIf="collapsed">{{item.label}}</span>
    <i *ngIf="item.items && collapsed" class="menu-collapse-icon" [ngClass]= "!item.expanded ? 'bx bx-right-arrow' :'bx bx-down-arrow'"></i>
  </a>
  <a class="sublevel-nav-link"  *ngIf="!item.items || (item.items && item.items.length === 0)"
  [routerLink]="[item.routeLink]" routerLinkActive="active-sublevel" [routerLinkActiveOptions]="{exact:true}">
  
 <i [class]="item.icon" class="sublevel-link-icon"></i>
 <span class="sublevel-link-text" *ngIf="collapsed">{{item.label}}</span>
 
</a>
<div *ngIf="item.items && item.items.length > 0 ">
<app-sublevel-menu 
  [data]="item"
  [collapsed]="collapsed"
  [multiple]="multiple"
  [expanded]="item.expanded"></app-sublevel-menu>
</div>
 </li>
    </ul>
  `,
 styleUrl: './sidenav.component.css',
  animations:[ trigger('submenu',[state('hidden',style({height:'0', overflow:'hidden'})),
    state('visisble',style({height:'*'})),
    transition('visible <=> hidden',[style({overflow:'hidden'}),
      animate('{{transitionParams}}')
    ]),
    transition('void => *',[animate(0)])
  ])]
})
export class SublevelMenuComponent  implements OnInit{
  @Input()  data :INavbarData={
    routeLink:'',
    icon:'',
    label:'',
    items:[]
  }
@Input()    collapsed =false;
@Input()    animating:boolean | undefined;
@Input()    expanded:boolean | undefined;
@Input()    multiple :boolean=false;
  ngOnInit(): void {
    
  }
  constructor(){

  }
  handlClick(item:any):void{
  if(!this.multiple)
{if(this.data.items && this.data.items.length >0){
  for(let modelItem of this.data.items)
  {
    if(item!==modelItem && modelItem.expanded)
    {
      modelItem.expanded=false;
    }
  }
}

}
item.expanded=!item.expanded;
  }

}
