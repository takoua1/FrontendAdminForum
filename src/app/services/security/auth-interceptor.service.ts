import { Injectable } from '@angular/core';
import { TokenStorageService } from '../token-storage.service';
import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService, private tokenStorageService: TokenStorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(req, next);
        }
        return throwError(error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((tokenResponse: any) => {
          this.isRefreshing = false;
          this.tokenStorageService.saveToken(tokenResponse.access_token);
          this.tokenStorageService.saveRefreshToken(tokenResponse.refresh_token);
          this.refreshTokenSubject.next(tokenResponse.access_token);
          return next.handle(this.addTokenHeader(request, tokenResponse.access_token));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          // Si le rafraîchissement échoue, déconnectez l'utilisateur
          this.authService.logout();
          return throwError(err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(accessToken => {
          return next.handle(this.addTokenHeader(request, accessToken));
        })
      );
    }
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}