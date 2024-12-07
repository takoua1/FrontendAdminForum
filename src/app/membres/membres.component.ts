import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { User } from '../model/user';
import { NgxPaginationModule } from 'ngx-pagination';
import { CustomPaginationComponent } from '../shared/custom-pagination/custom-pagination.component';

import { forkJoin, map, Observable, Subscription } from 'rxjs';
import { SignaleService } from '../services/signale.service';

@Component({
  selector: 'app-membres',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule,NgxPaginationModule ,CustomPaginationComponent],
  templateUrl: './membres.component.html',
  styleUrl: './membres.component.css'
})
export class MembresComponent implements OnInit {
 
 users: any[] = [];
 page: number = 1;
 pageSignale :number = 1;
 totalPagesSignale: number = 1;
 searchTerm: string = '';
 totalPages: number = 1;
 filteredUsers: any[] = [];
 signaleStatus: any[] = [];
 private signaleSubscription: Subscription | undefined;
 isSignalePopupVisible: boolean = false;
  selectedUserId: number | null = null;
  signales: any[] = [];
  userSignaleStatus: { [userId: number]: boolean } = {};
  isDetailPopupVisible = false;
  selectedPost: any;
  selectedComment:any;
 constructor(private userService: UserService, private signaleService:SignaleService, private cdr: ChangeDetectorRef)
 { }
  ngOnInit(): void {
   
   this.loadUsers();
   
 
  }



  loadUsers(): void {
    this.userService.getUsers().subscribe(data => {
        this.users = data;
        this.filteredUsers = data; // Initialise filteredUsers avec les données reçues
        this.totalPages = Math.ceil(this.users.length / 4);

        // Crée un tableau d'observables pour vérifier les signalements pour chaque utilisateur
        const observables = this.filteredUsers.map(user => 
            this.checkUserHasSignales(user).pipe(
                map(hasSignales => ({ userId: user.id, hasSignales }))
            )
        );

        // Utilise forkJoin pour attendre que tous les observables soient complétés
        forkJoin(observables).subscribe(results => {
            results.forEach(result => {
                this.userSignaleStatus[result.userId] = result.hasSignales;
            });

            console.log("Mise à jour des statuts des signalements :", this.userSignaleStatus);
        });
    });
}

  search(term: string): void {
    if (!term.trim()) {
      this.filteredUsers = this.users;
      return;
    }
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(term.toLowerCase()) ||
      user.nom.toLowerCase().includes(term.toLowerCase()) ||
      user.prenom.toLowerCase().includes(term.toLowerCase())||
      user.pays.toLowerCase().includes(term.toLowerCase())
    );
    this.totalPages = Math.ceil(this.filteredUsers.length / 2); // Recalcule totalPages après filtrage
  }

  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe(() => {
      this.loadUsers(); // Recharge les utilisateurs après suppression
    });
  }

  blockUser(userId: number): void {
    this.userService.blockUser(userId).subscribe(() => {
      this.loadUsers(); // Recharge les utilisateurs après blocage
    });
  }
  unblockUser(userId: number): void {
    this.userService.unblockUser(userId).subscribe(() => {
      this.loadUsers(); // Recharge les utilisateurs après blocage
    });
  }



  openSignaleDetails(user: User) {
    this.isSignalePopupVisible = true;
    this.signales = []; // Réinitialiser avant d'ajouter les nouveaux signalements
    this.signaleService.getSignalesByPosteOrCommentUser(user.id).subscribe(data => {
        this.signales = data;
        this.totalPagesSignale = Math.ceil(this.signales.length / 2); // Met à jour les pages
        console.log('Signalements reçus:', this.signales);
       
        this.cdr.detectChanges();  // Forcer la détection des changements
    });
}

  checkUserHasSignales(user: User): Observable<boolean> {


    return this.signaleService.getSignalesByPosteOrCommentUser(user.id).pipe(

      map(signales => signales.length > 0)
      
    );
  }

  closeSignalePopup() {
    this.isSignalePopupVisible = false;
  }
  openDetailPopup(signale: any) {
    if (signale.poste) {
      this.selectedPost = signale.poste;
    } else if (signale.comment) {
      this.selectedComment = signale.comment;
    }
    this.isDetailPopupVisible = true;
  }
  
  closeDetailPopup() {
    this.isDetailPopupVisible = false;
    this.selectedPost = null;
    this.selectedComment = null;
  }
}
