import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // פונקציית עזר ליצירת ה-Headers עם הטוקן העדכני
  public getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken') ?? '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }


}
