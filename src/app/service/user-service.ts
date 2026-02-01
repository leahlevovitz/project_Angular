import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { UserModel } from '../models/UserModel';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpClient = inject(HttpClient);
  private readonly AUTH_URL = 'https://localhost:7105/api/Auth';

  /**
   * הרשמת משתמש חדש
   */
  register(userData: UserModel): Observable<UserModel> {
    return this.httpClient.post<UserModel>(`${this.AUTH_URL}/register`, userData);
  }

  /**
   * התחברות, שמירת טוקן ופיענוח נתונים
   */
  login(loginData: UserModel): Observable<any> {
    return this.httpClient.post<any>(`${this.AUTH_URL}/login`, loginData).pipe(
      tap((response: any) => {
        // חילוץ הטוקן מהתגובה
        const token = response.token || response;

        if (token && typeof token === 'string') {
          // 1. שמירת הטוקן
          localStorage.setItem('authToken', token);

          try {
            // 2. פיענוח הטוקן
            const decoded: any = jwtDecode(token);
            console.log('Decoded Token:', decoded);

            // 3. חילוץ התפקיד (Role) - לפי המפתח שנמצא בטוקן שלך
            const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            if (role) {
              localStorage.setItem('userRole', role);
            }

            // 4. חילוץ מזהה המשתמש (ID) - לפי המפתח המדויק מהטוקן שלך
            const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            if (userId) {
              localStorage.setItem('userId', userId.toString());
              console.log('User ID saved:', userId);
            }

          } catch (error) {
            console.error('Error decoding token:', error);
          }
        }
      })
    );
  }

  /**
   * שליפת מזהה המשתמש מהאחסון
   */
  getUserId(): number {
    const id = localStorage.getItem('userId');
    return id ? parseInt(id, 10) : 0;
  }

  /**
   * שליפת התפקיד מהאחסון
   */
  getRole(): string | null {
    return localStorage.getItem('userRole');
  }

  /**
   * שליפת הטוקן מהאחסון
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * יציאה מהמערכת וניקוי נתונים
   */
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    // או פשוט localStorage.clear();
  }
}