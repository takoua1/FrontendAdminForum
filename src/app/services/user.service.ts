import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http :HttpClient) { }

  getUsers(): Observable<any[]> {
    let url =`/api/user/findAll`;
    return this.http.get<any[]>(url);
  }
  deleteUser(userId: number): Observable<void> {
    const url = `/api/user/delete/${userId}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`Deleted user with id=${userId}`)),
      catchError(this.handleError<void>('deleteUser'))
    );
  }


  blockUser(userId: number): Observable<void> {
    const url = `/api/user/block/${userId}`;
    return this.http.patch<void>(url, {}).pipe(
      tap(() => console.log(`Blocked user with id=${userId}`)),
      catchError(this.handleError<void>('blockUser'))
    );
  }

  unblockUser(userId: number): Observable<void> {
    const url = `/api/user/unblock/${userId}`;
    return this.http.patch<void>(url, {}).pipe(
      tap(() => console.log(`Blocked user with id=${userId}`)),
      catchError(this.handleError<void>('blockUser'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
