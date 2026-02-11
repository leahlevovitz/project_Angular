import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GiftModel } from '../models/GiftModel';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class GiftService {

  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);

  private readonly BASE_URL = 'https://localhost:7105/api/Gifts';

  private getHeaders() {
    return this.authService.getHeaders();
  }

  // -------------------- CRUD --------------------

  getAll(): Observable<GiftModel[]> {
    return this.httpClient.get<GiftModel[]>(
      this.BASE_URL,
      { headers: this.getHeaders() }
    );
  }

  getById(id: number): Observable<GiftModel> {
    return this.httpClient.get<GiftModel>(
      `${this.BASE_URL}/${id}`,
      { headers: this.getHeaders() }
    );
  }

  add(item: GiftModel): Observable<GiftModel> {
    return this.httpClient.post<GiftModel>(
      this.BASE_URL,
      item,
      { headers: this.getHeaders() }
    );
  }

  update(gift: GiftModel): Observable<GiftModel> {
    return this.httpClient.put<GiftModel>(
      `${this.BASE_URL}/${gift.id}`,
      gift,
      { headers: this.getHeaders() }
    );
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.BASE_URL}/${id}`,
      { headers: this.getHeaders() }
    );
  }

  // -------------------- Basket --------------------

  addToBasket(gift: GiftModel): Observable<void> {
    return this.httpClient.post<void>(
      `${this.BASE_URL}/addToBasket/${gift.id}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  // -------------------- Search --------------------

  search(
    giftName?: string,
    donorName?: string,
    minPurchasers?: number
  ): Observable<GiftModel[]> {

    let params = new HttpParams();

    if (giftName) {
      params = params.set('giftName', giftName);
    }

    if (donorName) {
      params = params.set('donorName', donorName);
    }

    if (minPurchasers !== null && minPurchasers !== undefined) {
      params = params.set('minPurchasers', minPurchasers.toString());
    }

    return this.httpClient.get<GiftModel[]>(
      `${this.BASE_URL}/search`,
      {
        headers: this.getHeaders(),
        params: params
      }
    );
  }
}
