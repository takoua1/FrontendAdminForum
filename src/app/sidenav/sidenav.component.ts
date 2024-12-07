import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, Output,EventEmitter, HostListener } from '@angular/core';
import { AppComponent } from '../app.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SublevelMenuComponent } from './sublevel-menu.component';
import { navbarData } from './nav-data';
import { INavbarData } from './helper';
import { SignaleService } from '../services/signale.service';
import { Subscription } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';


  
interface SideNavToggle{

screenWidth:number;
collapsed:boolean;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule,RouterModule,SublevelMenuComponent],
  
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
  animations:[trigger('fadeIn',[transition(':enter',[style({opacity:0}),animate('350ms',style({opacity:1}))]),

  transition(':leave',[style({opacity:1}),animate('350ms',style({opacity:0}))])

]),

,trigger('rotate',
  [transition(':enter',[animate('1000ms',keyframes([style({transform:'rotate(0deg)',offset:'0'}),
    style({transform:'rotate(2turn)',offset:'1'})
  ]))])])

]
})
export class SidenavComponent implements OnInit {
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter()
  collapsed=false;
  screenWidth=0;
  navData=navbarData;
  multiple:boolean=false;
  unTraitesCount: number = 0;
  unTraitesCountSubscription: Subscription | undefined;
   constructor(private signaleService: SignaleService,private tokenService:TokenStorageService,private router :Router) { }
 @HostListener('window:resize',["$event"])
 
 onResize(event:any){
 
   this.screenWidth = window.innerWidth;
   if(this.screenWidth<=768){
     this.collapsed =false;
     this.onToggleSideNav.emit({ screenWidth:this.screenWidth,collapsed:this.collapsed})
   }
 }
   ngOnInit(): void {
 
     this.screenWidth = window.innerWidth;
     this.unTraitesCountSubscription = this.signaleService.getUnTraitesCount().subscribe(count => {
    
      this.unTraitesCount = count;
      console.log(this.unTraitesCount);
    });
   }
 
 
   toggleColapse():void{
 
     this.collapsed=!this.collapsed;
     this.onToggleSideNav.emit({ screenWidth:this.screenWidth,collapsed:this.collapsed})
   }
   closeSidernav():void{
   this.collapsed =false;
   this.onToggleSideNav.emit({ screenWidth:this.screenWidth,collapsed:this.collapsed})
   }
   handleClick(item:INavbarData):void{
    if(!this.multiple)
    {for(let modelItem of this.navData)
    {
      if(item!== modelItem && modelItem.expanded)
      {
        modelItem.expanded=false;
      }
    }

    }
    item.expanded=!item.expanded;
   }

   logOut()
   {
    this.tokenService.signOut();
   this.router.navigate(['/login']);
   }
}
