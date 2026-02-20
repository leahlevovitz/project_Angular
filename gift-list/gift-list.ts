import { Component, EventEmitter, inject, Output, ViewChild, OnInit } from '@angular/core';
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
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { LotteryService } from '../../service/lottery-service';
import { tap } from 'rxjs';
import { LotteryModel } from '../../models/LotteryModel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-gift-list',
  standalone: true,
  imports: [
    AddGift,
    CommonModule,
    CardModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    InputTextModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './gift-list.html',
  styleUrl: './gift-list.scss',
})
export class GiftList implements OnInit {
  @ViewChild('basketComp') basketChild!: BasketComp;
  showBasketDialog = false;

  private userService = inject(UserService);
  private addToBasketSrv = inject(PurchasersService);
  private lotteryService = inject(LotteryService);
  giftSrv: GiftService = inject(GiftService);
private messageService = inject(MessageService);
  selectedId: number = -1;
  isEditMode: boolean = false;
  role = this.userService.getRole();
  userId = this.userService.getUserId();
  loadingLottery: boolean = false;

  // ניהול דיאלוג
  displayWinnersDialog: boolean = false;
  currentWinners: string[] = [];
  currentGiftName: string = '';

  giftName?: string;
  donorName?: string;
  minPurchasers?: number;

  list$ = this.giftSrv.getAll();
  winnersMap: { [giftId: number]: string[] } = {};

  ngOnInit() {
    this.refreshList();
  }

  refreshList() {
    this.list$ = this.giftSrv.getAll().pipe(
      tap(gifts => {
        gifts.forEach(gift => {
          if (gift.isLocked && !this.winnersMap[gift.id]) {
            this.loadWinnersData(gift.id);
          }
        });
      })
    );
  }

  loadWinnersData(giftId: number) {
    this.lotteryService.getWinnersForGift(giftId).subscribe({
      next: (res: LotteryModel[]) => {
        // חילוץ השם לפי כל אופציה אפשרית שהשרת מחזיר
        this.winnersMap[giftId] = res.map(w => w.user?.userName || 'זוכה');
      },
      error: (err) => console.error('Error loading winners:', err)
    });
  }

  showWinnersInDialog(giftId: number, giftName: string) {
    this.currentGiftName = giftName;
    this.lotteryService.getWinnersForGift(giftId).subscribe({
      next: (res: LotteryModel[]) => {
        this.winnersMap[giftId] = res.map(w => w.user?.userName || 'זוכה');
        this.currentWinners = this.winnersMap[giftId];
        this.displayWinnersDialog = true;
      },
      error: (err) => {
        console.error('Could not load winners for dialog', err);
        this.currentWinners = [];
        this.displayWinnersDialog = true;
      }
    });
  }

  drawLottery(giftId: number) {
    this.loadingLottery = true;
    this.lotteryService.drawLottery(giftId).subscribe({
      next: () => {
        this.loadWinnersData(giftId);
        this.refreshList();
        this.loadingLottery = false;
      },
      error: () => this.loadingLottery = false
    });
  }

  search() {
    this.list$ = this.giftSrv.search(this.giftName, this.donorName, this.minPurchasers).pipe(
      tap(gifts => gifts.forEach(g => { if (g.isLocked) this.loadWinnersData(g.id) }))
    );
  }

  // פונקציות ניהול נוספות
  updateGift(id: number) { this.selectedId = id; this.isEditMode = true; }
  add() { this.selectedId = -1; this.isEditMode = true; }
  handleClose(wasSaved: boolean) { this.isEditMode = false; this.selectedId = -1; if (wasSaved) this.refreshList(); }
  deleteGift(gift: any) {
    // בדיקה האם קיימים רוכשים למתנה
    if (gift.purchasers && gift.purchasers.length > 0) {
      alert('לא ניתן למחוק מתנה שנרכשה כבר!');
      return;
    }

    // בדיקה אם המתנה נעולה (אופציונלי, לפי הלוגיקה שלך)
    if (gift.isLocked) {
      alert('מתנה זו הוגרלה ולא ניתן למחוק אותה.');
      return;
    }

    // אישור מחיקה מהמשתמש
    if (confirm(`האם אתה בטוח שברצונך למחוק את ${gift}?`)) {

      this.giftSrv.delete(gift).subscribe({
        next: () => {
          this.refreshList();
        },
        error: (err) => {
          console.error(err);
          alert('שגיאה במחיקה: ' + ('לא ניתן למחוק את המתנה'));
        }
      });
    }
  }
addGiftToBasket(gift: GiftModel) {
    if (!this.userId) return;
    const p = { id: 0, userId: this.userId, giftId: gift.id, giftImage: gift.image, giftName: gift.name, giftPrice: gift.price };
    
    this.addToBasketSrv.addToBasket(p).subscribe({
      next: () => {
        // 5. הודעה מגניבה בהצלחה
        this.messageService.add({ 
          severity: 'success', 
          summary: 'איזה כיף!', 
          detail: `המתנה "${gift.name}" נוספה לסל שלך `,
          life: 2500 
        });

        if (this.basketChild) this.basketChild.refreshBasket();
      },
      error: () => {
        // הודעת שגיאה במקרה הצורך
        this.messageService.add({ 
          severity: 'error', 
          summary: 'אופס...', 
          detail: 'לא הצלחנו להוסיף את המוצר, נסה שוב.' 
        });
      }
    });
  }
}