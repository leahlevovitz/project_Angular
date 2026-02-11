import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PurchasersModel } from '../models/PurchasersModel';
import { AuthService } from './auth-service';
import { TotalRevenueDTO } from '../models/TotalRevenueDTO ';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class PurchasersService {
  private httpClient = inject(HttpClient);
  private readonly AUTH_URL = 'https://localhost:7105/api/Purchasers';

  private getHeaders = inject(AuthService).getHeaders;

  add(purchaser: PurchasersModel[]) {
    return this.httpClient.post<PurchasersModel[]>(this.AUTH_URL, purchaser, { headers: this.getHeaders() });
  }
  addToBasket(purchaser: PurchasersModel) {
    return this.httpClient.post<PurchasersModel>(`${this.AUTH_URL}/Basket`, purchaser, { headers: this.getHeaders() });
  }
  delete(id: number) {
    return this.httpClient.delete<void>(`${this.AUTH_URL}/${id}`, { headers: this.getHeaders() });
  }
  // src/app/services/purchasers.service.ts

  getAll(sortBy?: string) {
    // אם נשלח sortBy, נוסיף אותו כ-Query String
    let url = this.AUTH_URL;
    if (sortBy) {
      url += `?sortBy=${sortBy}`;
    } return this.httpClient.get<PurchasersModel[]>(url, { headers: this.getHeaders() });
  }
  getById(id: number) {
    return this.httpClient.get<PurchasersModel>(`${this.AUTH_URL}/${id}`, { headers: this.getHeaders() });
  }
  GetBasketByUserId() {
    return this.httpClient.get<PurchasersModel[]>(`${this.AUTH_URL}/basket`, { headers: this.getHeaders() });
  }
  getReport() {
    return this.httpClient.get<TotalRevenueDTO>(`${this.AUTH_URL}/total-revenue`, { headers: this.getHeaders() });
  }
  getByGift(giftId: number, sortBy?: string): Observable<PurchasersModel[]> {
  return this.httpClient.get<PurchasersModel[]>(`${this.AUTH_URL}/by-gift?giftId=${giftId}&sortBy=${sortBy || ''}`, { headers: this.getHeaders() });
}
}
