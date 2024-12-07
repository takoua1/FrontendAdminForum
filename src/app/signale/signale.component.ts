import { Component, OnInit } from '@angular/core';
import { SignaleService } from '../services/signale.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CustomPaginationComponent } from '../shared/custom-pagination/custom-pagination.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { Signale } from '../model/signale';
import { TokenStorageService } from '../services/token-storage.service';
import { Decision } from '../model/decision.enum';
import { MessageMailService } from '../services/message-mail.service';

@Component({
  selector: 'app-signale',
  standalone: true,
  imports: [CommonModule,CustomPaginationComponent,FormsModule,NgxPaginationModule ],
  templateUrl: './signale.component.html',
  styleUrl: './signale.component.css'
})


export class SignaleComponent  implements OnInit {
  signaleStatus: any[] = [];
   signaleSubscription: Subscription | undefined;
   signales: any[] = [];
  
   page: number = 1;
 searchTerm: string = '';
 totalPages: number = 1;
 filteredSignales: any[] = [];
  unTraitesCountSubscription: Subscription | undefined;
 unTraitesCount: number = 0;
 isPopupVisible = false;
 isDecisionMenuVisible = false;
 selectedPost: any = null;
 selectedComment: any = null;
 isDecisionPopupVisible: boolean = false;
  decisionDetails: any; 
 admin:any;
 signale:any;
 filterStatus: string = '';
  isVisible: boolean = false;
   
  constructor(private signaleService: SignaleService ,private token :TokenStorageService, private mailService:MessageMailService)
  { }
   ngOnInit(): void {

     this.admin = this.token.getUser();

    console.log('admin', this.admin);
     this.signaleSubscription = this.signaleService.getSignaleStatus().subscribe(
       (status) => {
         if (status) {
          
           this.loadSignales();
        
         }
       },
       (error) => {
         console.error('Error receiving signale status:', error);
       }
       
     );

  this.loadSignales();
  this.initDropdowns();
   }

   loadSignales()
   {
    this.signaleService.getSignales().subscribe(
      (data: any[]) => {
        this.signales = data;
        this.filteredSignales = data; // Initialise filteredUsers avec les données reçues
        this.totalPages = Math.ceil(this.signales.length / 4);
       
      },
      error => {
        console.error('Erreur lors de la récupération des signalements', error);
      }
    );
    this.unTraitesCountSubscription = this.signaleService.getUnTraitesCount().subscribe(count => {
    
      this.unTraitesCount = count;
      console.log(this.unTraitesCount);
    });
  }


  initDropdowns(): void {
    // Initialisation des dropdowns pour la période
    const periodDropdown = document.querySelector(".dropdown-status")!;
    const selectPeriod = periodDropdown.querySelector('.select') as HTMLElement;
    const caretPeriod = periodDropdown.querySelector('.caret') as HTMLElement;
    const menuPeriod = periodDropdown.querySelector('.menu') as HTMLElement;
    const optionsPeriod = periodDropdown.querySelectorAll('.menu li');
    const selectedPeriod = periodDropdown.querySelector('.selected') as HTMLElement;

    selectPeriod.addEventListener('click', () => {
      selectPeriod.classList.toggle('select-clicked');
      caretPeriod.classList.toggle('caret-rotate');
      menuPeriod.classList.toggle('menu-open');
    });

    optionsPeriod.forEach(option => {
      option.addEventListener('click', () => {
        selectedPeriod.innerText = (option as HTMLElement).innerText;
        selectedPeriod.classList.remove('selected-clicked');
        caretPeriod.classList.remove('caret-rotate');
        menuPeriod.classList.remove('menu-open');
        optionsPeriod.forEach(opt => (opt as HTMLElement).classList.remove('active'));
        (option as HTMLElement).classList.add('active');
      
      });
    });
  }
  filterSignales(status: string): void {
    this.filterStatus = status;
    if (status === '') {
      this.filteredSignales = this.signales; // Montre tous les signaux
    } else if (status === 'en_attente') {
      this.filteredSignales = this.signales.filter(signale => !signale.estTraite);
    } else if (status === 'resolu') {
      this.filteredSignales = this.signales.filter(signale => signale.estTraite);
    }
  }
  search(term: string): void {
    if (!term.trim()) {
      this.filteredSignales = this.signales;
      return;
    }
    this.filteredSignales = this.signales.filter(signale =>
      signale.titre?.toLowerCase().includes(term.toLowerCase()) ||
      signale.raison?.toLowerCase().includes(term.toLowerCase()) ||
      signale.user?.nom?.toLowerCase().includes(term.toLowerCase()) ||
      signale.user?.prenom?.toLowerCase().includes(term.toLowerCase()) ||
      signale.poste?.user?.username?.toLowerCase().includes(term.toLowerCase())||
      signale.comment?.user?.username?.toLowerCase().includes(term.toLowerCase())
    );
    this.totalPages = Math.ceil(this.filteredSignales.length / 2); // Recalcule totalPages après filtrage
  }
  toggleDecisionMenu(): void {
    this.isDecisionMenuVisible = !this.isDecisionMenuVisible;
  }
  openPopup(signale: Signale): void {
    this.selectedPost = signale.poste; 
    this.selectedComment=signale.comment // Adaptez selon votre structure de données
    this.isPopupVisible = true;
    this.signale=signale;
  }
  // Méthode pour gérer les actions de décision
  takeAction(action: string): void {
    let decision: Decision | undefined;
  
    switch (action) {
      case 'supprimer':
        decision = this.signale.poste ? Decision.SUPPRIMER_POSTE : Decision.SUPPRIMER_COMMENTAIRE;
        break;
      case 'bloquer':
        decision = Decision.BLOQUER_UTILISATEUR;
        break;
      case 'bloquer_supprimer':
        decision = Decision.SUPPRIMER_BLOQUER;
        break;
      case 'ne_rien_faire':
        decision = Decision.NE_RIEN_FAIRE;
        break;
      default:
        console.error('Action non reconnue');
        return;
    }
  
    if (decision) {
      this.signaleService.addDecision(this.signale.id, decision, this.admin.username)
        .subscribe(
          response => {
            console.log('Décision appliquée avec succès:', response);
           
            this.loadSignales();
            this.signaleService.getSignales().subscribe(signales => {
              this.signaleService.updateUnTraitesCount(signales);
              
              if(decision ===  Decision.SUPPRIMER_POSTE ||decision === Decision.SUPPRIMER_COMMENTAIRE)
              {
                this.mailService.sendMsgAvr(this.signale);
                this.mailService.sendMsgInfor(this.signale);
              }
            });
            this.isDecisionMenuVisible = false;
            this.closePopup();
          },
          error => {
            console.error('Erreur lors de l\'application de la décision:', error);
          }
        );
    }}

  // Méthode pour fermer le pop-up
  closePopup(): void {
    this.isPopupVisible = false;
    this.isDecisionMenuVisible = false;
  }

  takeActionUpdate(action: string): void {
    let decision: Decision | undefined;
  
    switch (action) {
      case 'supprimer':
        decision = this.signale.poste ? Decision.SUPPRIMER_POSTE : Decision.SUPPRIMER_COMMENTAIRE;
        break;
      case 'bloquer':
        decision = Decision.BLOQUER_UTILISATEUR;
        break;
      case 'bloquer_supprimer':
        decision = Decision.SUPPRIMER_BLOQUER;
        break;
      case 'ne_rien_faire':
        decision = Decision.NE_RIEN_FAIRE;
        break;
      default:
        console.error('Action non reconnue');
        return;
    }
  
    if (decision) {
      this.signaleService.updateDecision(this.signale.id, decision, this.admin.username)
        .subscribe(
          response => {
            console.log('Décision appliquée avec succès:', response);
           
            this.loadSignales();
            this.signaleService.getSignales().subscribe(signales => {
              this.signaleService.updateUnTraitesCount(signales); 
              
              if(decision ===  Decision.NE_RIEN_FAIRE)
                {
                  this.mailService.sendMsgModif(this.signale);
                  
                }
            });
            this.isDecisionMenuVisible = false;
            this.closeDecisionPopup();
          },
          error => {
            console.error('Erreur lors de l\'application de la décision:', error);
          }
        );
    }}

  // Méthode pour fermer le pop-up


  addDecision(signale: Signale, admin: string, decision:Decision) {

     
    this.signaleService.addDecision(signale.id, decision, admin).subscribe(
      (response: Signale) => {
        console.log('Décision ajoutée avec succès :', response);

        
      },
      error => {
        console.error('Erreur lors de l\'ajout de la décision :', error);
      }
    );
  }

  // Mettre à jour une décision
  updateDecision(signale: Signale, admin: string, decision:Decision) {
     // Exemple de décision
    this.signaleService.updateDecision(signale.id, decision, admin).subscribe(
      (response: Signale) => {
        console.log('Décision mise à jour avec succès :', response);
      },
      error => {
        console.error('Erreur lors de la mise à jour de la décision :', error);
      }
    );
  }
  openDecisionPopup(signale:Signale): void {
    this.signale=signale;
    
    this.decisionDetails = signale; 
    this.isDecisionPopupVisible = true;
  }

  // Méthode pour fermer le popup de décision
  closeDecisionPopup(): void {
    this.isDecisionPopupVisible = false;
  }

  disableSignale(id: number): void {
    this.signaleService.disableSignale(id).subscribe(() => {
      this.loadSignales(); 
    });
  }
  openDeletePopup(signale:Signale)
  {
    this.signale=signale;
    this.isVisible=true;
  }
  onConfirm(): void {
    this.disableSignale(this.signale.id)
   
    this.isVisible = false;
  }

  onCancel(): void {
  
    this.isVisible = false;
  }
}
   

