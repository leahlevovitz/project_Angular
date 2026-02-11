import { Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { inject } from '@angular/core/primitives/di';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DonorModel } from '../models/DonorModel';

@Injectable({
  providedIn: 'root',
})
export class DonorService {

  private httpClient = inject(HttpClient);
  private readonly BASE_URL = 'https://localhost:7105/api/Donors';
  private getHeaders = inject(AuthService).getHeaders;

  getAll() {
    return this.httpClient.get<DonorModel[]>(this.BASE_URL);
  }

  getById(id: number) {
    return this.httpClient.get<DonorModel>(
      `${this.BASE_URL}/${id}`,
      { headers: this.getHeaders() }
    );
  }

  add(donor: DonorModel) {
    return this.httpClient.post(
      this.BASE_URL,
      donor,
      { headers: this.getHeaders() }
    );
  }

  update(donor: DonorModel) {
    return this.httpClient.put(
      `${this.BASE_URL}/${donor.id}`,
      donor,
      { headers: this.getHeaders() }
    );
  }

  delete(id: number) {
    return this.httpClient.delete(
      `${this.BASE_URL}/${id}`,
      { headers: this.getHeaders() }
    );
  }

  filterBy(str: string) {
    return this.httpClient.get(
      `${this.BASE_URL}/search`,
      { params: { str } }
    );
  }

  // ===== סינון חדש =====
  filter(name?: string, email?: string, gift?: string) {
    let params = new HttpParams();

    if (name) params = params.set('name', name);
    if (email) params = params.set('email', email);
    if (gift) params = params.set('gift', gift);

    return this.httpClient.get<DonorModel[]>(
      `${this.BASE_URL}/filter`,
      {
        headers: this.getHeaders(),
        params
      }
    );
  }
}
