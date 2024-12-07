import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, catchError, from, fromEvent, interval, map, Observable, of, Subscription, switchMap, tap, throwError } from 'rxjs';
import { TokenStorageService } from './token-storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy{
  private baseUrl = `/api/auth`; 
  private loggedIn: BehaviorSubject<boolean>;
  private userRole = new BehaviorSubject<string>(localStorage.getItem('userRole') || '');
  private errorMessage = new BehaviorSubject<string | null>(null);
  errorMessage$ = this.errorMessage.asObservable();
  private accessTokenSubject: BehaviorSubject<string | null>;
  public isLoggedIn$: Observable<boolean>;
  userRole$: Observable<string> = this.userRole.asObservable();
  public accessToken$: Observable<string | null>;
  private heartbeatInterval: Subscription | undefined;
  private visibilityChangeSubscription: Subscription | undefined;
  private activityTimer: any;
  constructor(private http :HttpClient, private tokenService :TokenStorageService ,private router: Router) {  this.loggedIn = new BehaviorSubject<boolean>(this.isTokenAvailable());
    this.accessTokenSubject = new BehaviorSubject<string | null>(this.tokenService.getToken());
    this.accessToken$ = this.accessTokenSubject.asObservable();
    this.isLoggedIn$ = this.loggedIn.asObservable();
    this.monitorVisibility();}
  
  private isTokenAvailable(): boolean {
    return this.tokenService.getToken() !== null;
  }
  login(username: string, password: string): void { 
    this.http.post<any>(`${this.baseUrl}/signinAdmin`, { username, password }).subscribe({
      next: (response) => {
        if (response.access_token && response.refresh_token) {
          this.tokenService.saveToken(response.access_token);
          this.tokenService.saveRefreshToken(response.refresh_token);
          this.tokenService.saveUser({ username: response.username });
  
          this.startHeartbeat();
          this.setLoggedIn(true);
          window.sessionStorage.setItem('userRole', response.role);
          this.clearErrorMessage();  // Clear any previous error messages
  
          // Vérification du rôle de l'utilisateur
          if (response.role === 'ADMIN') {
            this.router.navigate(['/dashboard']);
          } else {
            this.setErrorMessage(`Accès refusé. Vous n'avez pas la permission d'accéder à cette page.`);
            this.router.navigate(['/login']);
          }
        } else {
          this.setErrorMessage('Connexion échouée : réponse non valide.');
          this.router.navigate(['/login']);
          console.error('Login failed: Invalid response');
        }
      },
      error: (error) => {
        if (error.status === 401) {
          this.setErrorMessage('Invalid credentials. Please check your username and password.');
        } else {
          this.setErrorMessage("Identifiants non valides. Veuillez vérifier votre nom d'utilisateur et votre mot de passe.");
        }
        
        console.error('Login failed', error);
        this.tokenService.signOut();
        this.router.navigate(['/login']);
      }
    });
  }
  signup(username: string, password: string, email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/signup`, { username, password, email });
  }

  public refreshToken(): Observable<any> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      return from([]); // Handle case where there is no refresh token
    }

    return this.http.post<any>(`/api/auth/refresh-token`, {}, {
      headers: {
        Authorization: `Bearer ${refreshToken}`
      }
    }).pipe(
      tap(response => {
        this.tokenService.saveToken(response.access_token);
        this.tokenService.saveRefreshToken(response.refresh_token);

      }),
      catchError(error => {
        console.error('Token refresh failed', error);
        this.logout();
        return from([]); // or throw an error
      })
    );
  }
  setLoggedIn(state: boolean): void {
    this.loggedIn.next(state);
  }
  getUserRole(): string {
    return  window.sessionStorage.getItem('userRole') || '';
  }
  setErrorMessage(message: string): void {
    this.errorMessage.next(message);
  }

  clearErrorMessage(): void {
    this.errorMessage.next(null);
  }
  logout(): void {
    this.tokenService.signOut(); // Supprime les tokens et les informations utilisateur
    this.setLoggedIn(false);
    this.router.navigate(['/login']); // Redirige vers la page de connexion
  }

  private startHeartbeat() {
    const user = this.tokenService.getUser();
    if (user) {
      this.http.post(`/api/auth/heartbeat`, { username: user.username }).subscribe();
      console.log("heartbeat");
      this.heartbeatInterval = interval(60000).subscribe(() => {
        this.http.post(`/api/auth/heartbeat`, { username: user.username }).subscribe();
        console.log("heartbeat");
      });
    }
  }
  

  
  private startActivityTimer() {
    const user = this.tokenService.getUser();
    this.activityTimer = setTimeout(() => {
      // Utilisateur inactif, effectuer une action (comme la déconnexion)
      this.http.post(`/api/auth/disconnect`, { username: user.username }).subscribe();
    }, 30000); // 30 secondes
  }
  
  private resetActivityTimer() {
    clearTimeout(this.activityTimer);
    this.startActivityTimer();
  }
  private monitorUserActivity() {
    fromEvent(window, 'mousemove').subscribe(() => this.startHeartbeat() );
    fromEvent(window, 'keydown').subscribe(() => this.startHeartbeat() );
   // this.startActivityTimer(); 
  }
 
  private stopHeartbeat() {
    const user = this.tokenService.getUser();
    if (this.heartbeatInterval) {
      this.heartbeatInterval.unsubscribe();
      if (user) {
        this.http.post(`/api/auth/disconnect`, { username: user.username }).subscribe();
      }
      console.log('stop');
    }
  }
  private monitorVisibility(): void {
    this.visibilityChangeSubscription = fromEvent(document, 'visibilitychange')
    .subscribe(() => {
        if (document.hidden) {
          this.stopHeartbeat();
        } else {
          this.startHeartbeat();
        }
      });


}
ngOnDestroy() {
  this.stopHeartbeat();
  if (this.visibilityChangeSubscription) {
    this.visibilityChangeSubscription.unsubscribe();
  }
}
}
