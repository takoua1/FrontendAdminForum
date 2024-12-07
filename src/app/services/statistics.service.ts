import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';


export interface PostStatistics {
  category: string;
  period: string;
  count: number;
}
@Injectable({
  providedIn: 'root'
})


export class StatisticsService {

  constructor(private http: HttpClient) { }

  private apiUrl = '/api/statistics/postes/period';


 
 /* fetchStatistics(period: string): Observable<any> {
    let url =`/api/statistics/postes/period`;
    return this.http.get<any>(`${url}?period=${period}`);
  }*/

  getPostesStatistics(period: string): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(`${this.apiUrl}?period=${period}`);
  }
  getPostesCatgeStatistics(category: string, period: string, selectedDate: string | Date): Observable<any> {
    console.log('Category:', category);
    console.log('Period:', period);
    console.log('Selected Date:', selectedDate);
    const date = new Date(selectedDate);

    // Vérifiez si la date est invalide
    if (isNaN(date.getTime())) {
      console.error('Invalid date passed:', selectedDate);
      return of(null); // ou gérer l'erreur comme approprié
    }
  
    // Convertir la date en format ISO
    const formattedDate = date.toISOString();

    // Format de la date en ISO string
  

    // Créer les paramètres de la requête
    const params = new HttpParams()
      .set('category', category)
      .set('period', period)
      .set('selectedDate', formattedDate);



   let url =`/api/statistics/postes`
    return this.http.get<any>(url,{ params });
  }

  getCommentsCatgeStatistics(category: string, period: string, selectedDate: string | Date): Observable<any> {
    console.log('Category:', category);
    console.log('Period:', period);
    console.log('Selected Date:', selectedDate);
    const date = new Date(selectedDate);

    // Vérifiez si la date est invalide
    if (isNaN(date.getTime())) {
      console.error('Invalid date passed:', selectedDate);
      return of(null); // ou gérer l'erreur comme approprié
    }
  
    // Convertir la date en format ISO
    const formattedDate = date.toISOString();

    // Format de la date en ISO string
  

    // Créer les paramètres de la requête
    const params = new HttpParams()
      .set('category', category)
      .set('period', period)
      .set('selectedDate', formattedDate);



   let url =`/api/statistics/comments`
    return this.http.get<any>(url,{ params });
  }

  getGroupesCatgeStatistics(category: string, period: string, selectedDate: string | Date): Observable<any> {
    console.log('Category:', category);
    console.log('Period:', period);
    console.log('Selected Date:', selectedDate);
    const date = new Date(selectedDate);

    // Vérifiez si la date est invalide
    if (isNaN(date.getTime())) {
      console.error('Invalid date passed:', selectedDate);
      return of(null); // ou gérer l'erreur comme approprié
    }
  
    // Convertir la date en format ISO
    const formattedDate = date.toISOString();

    // Format de la date en ISO string
  

    // Créer les paramètres de la requête
    const params = new HttpParams()
      .set('category', category)
      .set('period', period)
      .set('selectedDate', formattedDate);



   let url =`/api/statistics/groupes`
    return this.http.get<any>(url,{ params });
  }


  getPercentagePostesStatistics(startDate: string, endDate: string): Observable<any> {
     let url =`/api/statistics/postes/percentage`
    return this.http.get<any>(`${url}?startDate=${startDate}&endDate=${endDate}`);
  }
  getPercentageCommentsStatistics(startDate: string, endDate: string): Observable<any> {
    let url =`/api/statistics/comments/percentage`
   return this.http.get<any>(`${url}?startDate=${startDate}&endDate=${endDate}`);
 }
 getPercentageGroupsStatistics(startDate: string, endDate: string): Observable<any> {
  let url =`/api/statistics/groups/percentage`
 return this.http.get<any>(`${url}?startDate=${startDate}&endDate=${endDate}`);
}
getPercentageUsersStatistics(startDate: string, endDate: string, granularity: string): Observable<any> {
  let url =`/api/statistics/users/percentage`
 return this.http.get<any>(`${url}?startDate=${startDate}&endDate=${endDate}&granularity=${granularity}`);
}
getUserStatusPercentage(): Observable<Map<string, number>> {
let url =`/api/statistics/users/status/percentage`

  return this.http.get<Map<string, number>>(`${url}`);
}
}
