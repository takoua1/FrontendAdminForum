import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | boolean {
    
    
    return this.authService.userRole$.pipe(
      take(1),
      map((role: string) => {
        if (role === "ADMIN") {
          return true;
        } else {
          
          this.router.navigate(['/login']); // Redirige vers la page de connexion si le rôle ne correspond pas
          return false;
        }
      })
    );
  }
}
