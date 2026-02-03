import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { PurchasersService } from '../../service/purchasers-service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-basket-comp',
  templateUrl: './basket-comp.html',
  styleUrls: ['./basket-comp.scss'],
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule]
})
export class BasketComp implements OnChanges {
  @Input() userId!: number; 

  private pSrv = inject(PurchasersService);
  
  // כאן אנחנו מבצעים את הקיבוץ (Grouping) לפי ה-giftId
  list$ = this.pSrv.GetBasketByUserId().pipe(
    map(items => {
      const grouped = new Map<number, any>();
      
      items.forEach(item => {
        if (grouped.has(item.giftId)) {
          const existing = grouped.get(item.giftId);
          existing.quantity += 1; // הוספת כמות
          existing.totalPrice += item.giftPrice; // עדכון מחיר כולל לסוג מוצר זה
        } else {
          // יצירת אובייקט חדש עם שדה כמות
          grouped.set(item.giftId, { ...item, quantity: 1, totalPrice: item.giftPrice });
        }
      });
      
      return Array.from(grouped.values());
    })
  );

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userId'] && this.userId) {
      this.refreshBasket();
    }
  }

  refreshBasket() {
    this.list$ = this.pSrv.GetBasketByUserId().pipe(
      map(items => {
        const grouped = new Map<number, any>();
        items.forEach(item => {
          if (grouped.has(item.giftId)) {
            const existing = grouped.get(item.giftId);
            existing.quantity += 1;
          } else {
            grouped.set(item.giftId, { ...item, quantity: 1 });
          }
        });
        return Array.from(grouped.values());
      })
    );
  }

  removeFromBasket(id: number) {
    // הערה: אם את רוצה להסיר רק אחד מהכמות, השרת צריך לתמוך בזה.
    // הקוד כרגע מסיר את המופע הספציפי שנשלח מהשרת.
    this.pSrv.delete(id).subscribe(() => {
      this.refreshBasket();
    });
  }
}