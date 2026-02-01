import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { PurchasersService } from '../../service/purchasers-service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-basket-comp',
  templateUrl: './basket-comp.html',
  styleUrls: ['./basket-comp.scss'],
  imports: [CommonModule, CardModule, ButtonModule] // זכרי לייבא את CommonModule אם משתמשים ב-*ngFor / *ngIf
})
export class BasketComp implements OnChanges {
  @Input() userId!: number; 

  private pSrv = inject(PurchasersService);
  list$ = this.pSrv.GetBasketByUserId();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userId'] && this.userId) {
      this.list$ = this.pSrv.GetBasketByUserId();
      console.log("Fetching basket for user:", this.userId);
    }
  }
  refreshBasket() {
    this.list$ = this.pSrv.GetBasketByUserId();
    console.log('Basket refreshed for user:', this.userId);
  }
  removeFromBasket(id: number) {
    this.pSrv.delete(id).subscribe(() => {
      this.list$ = this.pSrv.GetBasketByUserId();
    });
  }
}
