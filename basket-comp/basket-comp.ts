import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { PurchasersService } from '../../service/purchasers-service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { map } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-basket-comp',
  templateUrl: './basket-comp.html',
  styleUrls: ['./basket-comp.scss'],
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ToastModule,
    DialogModule
  ],
  providers: [MessageService]
})
export class BasketComp implements OnChanges {
  @Input() userId!: number;

  // משתנה לשליטה בתצוגת הדיאלוג
  showPaymentDialog: boolean = false;

  private pSrv = inject(PurchasersService);
  private msg = inject(MessageService);

  // הגדרת ה-Observable של רשימת המוצרים
  list$: Observable<any[]> = this.pSrv.GetBasketByUserId().pipe(
    map(items => this.groupItems(items))
  );

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userId'] && this.userId) {
      this.refreshBasket();
    }
  }

  // פונקציה לריענון הנתונים בסל
  refreshBasket() {
    this.list$ = this.pSrv.GetBasketByUserId().pipe(
      map(items => this.groupItems(items))
    );
  }

  // פונקציית עזר לקיבוץ מוצרים זהים (Grouping)
  private groupItems(items: any[]): any[] {
    const grouped = new Map<number, any>();
    items.forEach(item => {
      if (grouped.has(item.giftId)) {
        const existing = grouped.get(item.giftId);
        existing.quantity += 1;
        existing.totalPrice += item.giftPrice;
      } else {
        grouped.set(item.giftId, { ...item, quantity: 1, totalPrice: item.giftPrice });
      }
    });
    return Array.from(grouped.values());
  }

  // הסרה מהסל
  removeFromBasket(id: number) {
    this.pSrv.delete(id).subscribe({
      next: () => {
        this.refreshBasket();
        this.msg.add({ severity: 'info', summary: 'עודכן', detail: 'המוצר הוסר מהסל' });
      },
      error: () => {
        this.msg.add({ severity: 'error', summary: 'שגיאה', detail: 'לא ניתן היה להסיר את המוצר' });
      }
    });
  }

 completePayment() {
  // שולפים את סל המשתמש
  this.pSrv.GetBasketByUserId().subscribe({
    next: (basketItems) => {
      // שולחים את המערך של הפריטים ל-Service
      this.pSrv.add(basketItems).subscribe({
        next: () => {
          this.refreshBasket();
          this.msg.add({ severity: 'info', summary: 'בוצע', detail: 'התשלום הושלם בהצלחה' });
        },
        error: () => {
          this.msg.add({ severity: 'error', summary: 'שגיאה', detail: 'לא ניתן היה להשלים את התשלום' });
        }
      });

      this.msg.add({
        severity: 'success',
        summary: 'בוצע',
        detail: 'התשלום עבר בהצלחה נכנסת להגרלה תזכו למצוות!!'
      });

      this.showPaymentDialog = false;

      // ריענון הסל לאחר תשלום
      setTimeout(() => this.refreshBasket(), 1000);
    },
    error: () => {
      this.msg.add({ severity: 'error', summary: 'שגיאה', detail: 'לא ניתן להביא את פרטי הסל' });
    }
  });
}
}