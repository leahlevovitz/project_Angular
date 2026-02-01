import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { GiftModel } from '../../models/GiftModel';
import { AddGift } from '../add-gift/add-gift';
import { GiftService } from '../../service/gift-service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { UserService } from '../../service/user-service';
import { PurchasersService } from '../../service/purchasers-service';
import { BasketComp } from '../basket-comp/basket-comp';
@Component({
  selector: 'app-gift-list',
  standalone: true,
  imports: [AddGift, CommonModule, CardModule, ButtonModule, DialogModule, BasketComp],
  templateUrl: './gift-list.html',
  styleUrl: './gift-list.scss',
})
export class GiftList {
  @ViewChild('basketComp') basketChild!: BasketComp;
  selectedId: number = -1;
  isEditMode: boolean = false;
  // giftVec: GiftModel[] = [];
  private userService = inject(UserService);
  private addToBasket = inject(PurchasersService);
   role = this.userService.getRole();
   userId = this.userService.getUserId();
  giftSrv: GiftService = inject(GiftService)

  list$ = this.giftSrv.getAll();




  ngOnInit() {
    this.list$ = this.giftSrv.getAll()
    console.log(this.list$);

  }
  opaetEdit(item: boolean) {
    this.isEditMode = item
  }
  updateGift(id: number) {
    this.opaetEdit(true)
    this.selectedId = id;
    console.log(id);
  }

  add() {
    this.opaetEdit(true)
    this.selectedId = -1
  }
  handleClose(wasSaved: boolean) {
    this.isEditMode = false; // סוגר את חלונית ההוספה/עריכה
    this.selectedId = -1;

    if (wasSaved) {
      // כאן הקסם קורה: דריסת ה-Observable בזרם חדש גורמת ל-HTML להתרענן
      this.list$ = this.giftSrv.getAll();
    }
  }
  deleteGift(id: number) {
    this.giftSrv.delete(id).subscribe({
      next: () => {
        // לאחר מחיקה מוצלחת, רענן את הרשימה
        this.list$ = this.giftSrv.getAll();
      },
      error: (err) => console.error('שגיאה במחיקת מתנה:', err)
    });
  }

  @Output() basketUpdated = new EventEmitter<void>();
addGiftToBasket(gift: GiftModel) {
    if (!this.userId || this.userId === 0) return;

    const purchaser = { id: 0, userId: this.userId, giftId: gift.id };

    this.addToBasket.addToBasket(purchaser).subscribe({
      next: () => {
        console.log('מתנה נוספה לעגלה:', purchaser);
        
        // כאן הקסם קורה: קריאה ישירה למתודת הריענון של רכיב הסל
        if (this.basketChild) {
          this.basketChild.refreshBasket();
        }
        
        this.basketUpdated.emit(); 
      },
      error: (err) => console.error('שגיאה בהוספה:', err)
    });
  }

}