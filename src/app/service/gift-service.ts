import { inject, Injectable } from '@angular/core';
import { Category, GiftModel } from '../models/GiftModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class GiftService {
  private httpClient = inject(HttpClient);
  private readonly BASE_URL = 'https://localhost:7105/api/Gifts';

  private getHeaders = inject(AuthService).getHeaders;

  getAll(): Observable<GiftModel[]> {
    return this.httpClient.get<GiftModel[]>(this.BASE_URL, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<GiftModel> {
    return this.httpClient.get<GiftModel>(`${this.BASE_URL}/${id}`, { headers: this.getHeaders() });
  }

  add(item: GiftModel): Observable<GiftModel> {
    return this.httpClient.post<GiftModel>(this.BASE_URL, item, { headers: this.getHeaders() });
  }

  update(gift: GiftModel): Observable<GiftModel> {
    return this.httpClient.put<GiftModel>(`${this.BASE_URL}/${gift.id}`, gift, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.BASE_URL}/${id}`, { headers: this.getHeaders() });
  }
  addToBaskect(gift: GiftModel): Observable<GiftModel> {
    return this.httpClient.post<GiftModel>(`${this.BASE_URL}/addToBasket/${gift.id}`, {}, { headers: this.getHeaders() });
  }

  
  filterBy(str: string): Observable<GiftModel[]> {
    return this.httpClient.get<GiftModel[]>(`${this.BASE_URL}/search`, {
      headers: this.getHeaders(),
      params: { str: str }
    });
  }
}
