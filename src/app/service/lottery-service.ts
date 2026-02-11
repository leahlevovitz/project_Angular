import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { LotteryModel } from '../models/LotteryModel'
import { AuthService } from './auth-service';
import { inject } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class LotteryService {

  private readonly baseUrl = 'https://localhost:7105/api/Lottery';
  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);
  private getHeaders() {
    return this.authService.getHeaders();
  }
  /**
   * ביצוע הגרלה עבור מתנה
   * השרת מחזיר טקסט
   */
  drawLottery(giftId: number): Observable<string> {
    return this.httpClient.post(
      `${this.baseUrl}/draw/${giftId}`,
      null,
      { responseType: 'text' }
    );
  }

  /**
   * קבלת זוכים עבור מתנה
   */
  getWinnersForGift(giftId: number): Observable<LotteryModel[]> {
    return this.httpClient.get<LotteryModel[]>(
      `${this.baseUrl}/${giftId}/winners`,
      { headers: this.getHeaders() }
    ).pipe(
      map(winners =>
        winners.map(w => ({
          ...w,
          lotteryDate: new Date(w.lotteryDate)
        }))

      )
    );
  }

  /**
   * דו"ח כל המתנות עם הזוכים
   */
  getReport(): Observable<LotteryModel[]> {
    return this.httpClient.get<LotteryModel[]>(
      `${this.baseUrl}/report`,
      { headers: this.getHeaders() }
    ).pipe(
      map(items =>
        items.map(i => ({
          ...i,
          lotteryDate: new Date(i.lotteryDate)
        }))
      )
    );
  }
}
