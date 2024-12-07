import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SignaleWrapper } from '../model/signale-wrapper.model';

import { User } from '../model/user';
import { Poste } from '../model/poste';
import { Decision } from '../model/decision.enum';
import { Signale } from '../model/signale';

@Injectable({
  providedIn: 'root'
})
export class SignaleService {

  private stompClient: any;
  connectedPromise: Promise<void> | null = null;
  private isConnected = false;
  private signaleStatus: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private unTraitesCount = new BehaviorSubject<number>(0);
  constructor(private tokenService :TokenStorageService, private http :HttpClient) {
    this.loadSignalesInitial();
     this.initializeWebSocketConnection();}


  private initializeWebSocketConnection(): void {
    const socket = new SockJS('/api/ws-signale');
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, (frame:any) => {
      this.isConnected = true;
      console.log('Connected:', frame);
  
      // Subscribe to the topic
      this.stompClient.subscribe('/topic/signale', (message:any) => {
        console.log('Message reçu : ', message);
        
          try {
            // Parse the incoming message
            const signaleStatus = JSON.parse(message.body);
            console.log('Received signale status:', signaleStatus);
        
            // Mise à jour de la liste des statuts
            const currentStatusList = this.signaleStatus.value; // Récupère la liste actuelle
            if (Array.isArray(currentStatusList)) { // Vérifie si c'est bien un tableau
              this.signaleStatus.next([...currentStatusList, signaleStatus]);
    
            // Update the list of signalements
            const updatedSignales = [...this.signaleStatus.value];
            this.signaleStatus.next(updatedSignales);
            this.updateUnTraitesCount(updatedSignales); 
          } else {
            console.error('signaleStatus.value is not an array:', currentStatusList);
          }
          } catch (error) {
            console.error('Error parsing signale event:', error);
          }
        });
      }, (error: any) => {
        console.error('WebSocket connection error:', error);
      });
  }
  public getSignaleStatus(): Observable<any[]> {
    return this.signaleStatus.asObservable();
  }

  public disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        this.isConnected = false;
        console.log('Disconnected from WebSocket');
      });
    }
  }

 
  getSignales(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.tokenService.getToken()}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any[]>('/api/signale/all', { headers });
  }
  getUnTraitesCount(): Observable<number> {
    return this.unTraitesCount.asObservable();
  }
 updateUnTraitesCount(signales: any[]): void {
    const count = signales.filter(signale => !signale.estTraite).length;
    this.unTraitesCount.next(count);
  }
 
   loadSignalesInitial(): void {
    // Imaginons que vous avez une méthode pour récupérer les signalements depuis l'API
    this.getSignales().subscribe((signales: any[]) => {
      this.signaleStatus.next(signales);
      this.updateUnTraitesCount(signales);
    });
  }

  addDecision(signaleId: number, decision: Decision, adminUsername: string): Observable<Signale> {

    
    const url = `/api/signale/add-decision/${signaleId}/${adminUsername}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.tokenService.getToken()}`,
      'Content-Type': 'application/json'
    });

    return this.http.patch<Signale>(url, JSON.stringify(decision), { headers });
  }

// Mettre à jour une décision
updateDecision(signaleId: number, decision: Decision, adminUsername: string): Observable<Signale> {
    const url = `/api/signale/update-decision/${signaleId}/${adminUsername}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.tokenService.getToken()}`,
      'Content-Type': 'application/json'
    });
    return this.http.patch<Signale>(url, JSON.stringify(decision), { headers });
}

getSignalesByPosteOrCommentUser(userId: number): Observable<Signale[]> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.tokenService.getToken()}`,
    'Content-Type': 'application/json'
  });
  let url=`/api/signale/user-posts-comments/${userId}`
  return this.http.get<Signale[]>(url,{headers});
}
disableSignale(id: number): Observable<Signale> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.tokenService.getToken()}`,
    'Content-Type': 'application/json'
  });
  let url=`/api/signale/disable/${id}`

  return this.http.patch<Signale>(url, {headers});
}
}
  
