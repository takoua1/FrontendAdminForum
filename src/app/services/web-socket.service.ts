import { Injectable } from '@angular/core';

import { Client,  Stomp, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { TokenStorageService } from './token-storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: any;
  connectedPromise: Promise<void> | null = null;
  private isConnected = false;
  private signaleStatus: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  constructor(private tokenService :TokenStorageService) { this.initializeWebSocketConnection();}


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
          const signaleStatus = JSON.parse(message.body);
          console.log('Received signale status:', signaleStatus);
      
          // Mise à jour de la liste des statuts
          const currentStatusList = this.signaleStatus.value; // Récupère la liste actuelle
          if (Array.isArray(currentStatusList)) { // Vérifie si c'est bien un tableau
            this.signaleStatus.next([...currentStatusList, signaleStatus]);
          } else {
            console.error('signaleStatus.value is not an array:', currentStatusList);
          }
        } catch (error) {
          console.error('Error parsing signale event:', error);
        }
      });
    }, (error:any) => {
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
}
  