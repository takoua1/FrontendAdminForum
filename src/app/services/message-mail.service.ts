import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TokenStorageService } from './token-storage.service';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageMailService {
  private stompClient: any;
  private mailSubject: Subject<any> = new Subject<any>();

  private isConnected = false;
  constructor(private token :TokenStorageService, private http: HttpClient) {

    this.initializeWebSocketConnection();

   }


  private initializeWebSocketConnection(): void {
    const socket = new SockJS('/api/ws-mail');
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, (frame:any) => {
      this.isConnected = true;
      console.log('Connected:', frame);
    }, (error:any) => {
      console.error('Connection error:', error);
      this.isConnected = false;
    });

    
  }

  public getMailUpdates() {
    return this.mailSubject.asObservable();
  }

  public sendMsgAvr(signale: any) {
    this.stompClient.send('/app/sendMsgAvr', {}, JSON.stringify(signale));
  }
  public sendMsgInfor(signale: any) {
    this.stompClient.send('/app/sendMsgInfo', {}, JSON.stringify(signale));
  }

  public sendMsgModif(signale: any) {
    this.stompClient.send('/app/sendMsgModif', {}, JSON.stringify(signale));
  }


  
}
