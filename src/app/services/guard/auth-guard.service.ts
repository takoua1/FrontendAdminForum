import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { map, Observable, of, switchMap, take } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | boolean {
    return this.authService.isLoggedIn$.pipe(
      take(1),
      switchMap(isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigate(['/login']);
          return of(false); // Retourne false pour indiquer que l'accès est refusé
        }
        return this.authService.userRole$.pipe(
          take(1),
          map(role => {
            if (role === 'ADMIN') {
              return true;
            } else {
              this.router.navigate(['/login']);
              return false;
            }
          })
        );
      })
    );
  }
}
