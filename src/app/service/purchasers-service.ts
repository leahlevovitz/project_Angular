import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PurchasersModel } from '../models/PurchasersModel';
import { AuthService } from './auth-service';
@Injectable({
  providedIn: 'root',
})
export class PurchasersService {
  private httpClient = inject(HttpClient);
  private readonly AUTH_URL = 'https://localhost:7105/api/Purchasers';

  private getHeaders = inject(AuthService).getHeaders;

  add(purchaser: PurchasersModel) {
    return this.httpClient.post<PurchasersModel>(this.AUTH_URL, purchaser, { headers: this.getHeaders() });
  }
  addToBasket(purchaser: PurchasersModel) {
    return this.httpClient.post<PurchasersModel>(`${this.AUTH_URL}/Basket`, purchaser, { headers: this.getHeaders() });
  }
  delete(id: number) {
    return this.httpClient.delete<void>(`${this.AUTH_URL}/${id}`, { headers: this.getHeaders() });
  }
  getAll() {
    return this.httpClient.get<PurchasersModel[]>(this.AUTH_URL, { headers: this.getHeaders() });
  }
  getById(id: number) {
    return this.httpClient.get<PurchasersModel>(`${this.AUTH_URL}/${id}`, { headers: this.getHeaders() });
  }
  GetBasketByUserId() {
    return this.httpClient.get<PurchasersModel[]>(`${this.AUTH_URL}/basket`, { headers: this.getHeaders() });
  }
}
