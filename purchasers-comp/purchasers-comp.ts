import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchasersService } from '../../service/purchasers-service';
import { PurchasersModel } from '../../models/PurchasersModel';
import { TotalRevenueDTO } from '../../models/TotalRevenueDTO ';

@Component({
  selector: 'app-purchasers-comp',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchasers-comp.html',
  styleUrl: './purchasers-comp.scss',
})
export class PurchasersComp implements OnInit {
  private purchasersService = inject(PurchasersService);

  gifts: any[] = []; 
  totalRevenue: number = 0;
  report?: TotalRevenueDTO;
  loading = true;
  error = '';
  
  ngOnInit(): void {
    this.loadInitialData();
    this.loadReport();
  }

  loadReport(): void {
    this.purchasersService.getReport().subscribe({
      next: res => {
        this.report = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'שגיאה בטעינת הנתונים';
        this.loading = false;
      }
    });
  }

  // פונקציית המיון החדשה
  sortGifts(criteria: string): void {
    if (criteria === 'price') {
      // מיון מהיקר לזול
      this.gifts.sort((a, b) => b.price - a.price);
    } else if (criteria === 'popularity') {
      // מיון לפי כמות רוכשים (מהנרכש ביותר)
      this.gifts.sort((a, b) => (b.purchasers?.length || 0) - (a.purchasers?.length || 0));
    }
  }

  loadInitialData(): void {
    this.purchasersService.getReport().subscribe({
      next: (data: any) => {
        this.totalRevenue = data.PurchasersCount || 0;
      },
      error: (err) => console.error('Error fetching report', err)
    });

    this.purchasersService.getAll().subscribe({
      next: (data: PurchasersModel[]) => {
        const uniqueGifts = Array.from(new Set(data.map(p => p.giftId)));
        
        this.gifts = uniqueGifts.map(id => {
          const firstMatch = data.find(p => p.giftId === id);
          return {
            id: id,
            name: firstMatch?.giftName || 'מתנה ללא שם',
            price: firstMatch?.giftPrice || 0,
            purchasers: []
          };
        });

        this.gifts.forEach(gift => {
          this.purchasersService.getByGift(gift.id).subscribe({
            next: (purchasers: any[]) => {
              gift.purchasers = purchasers;
            },
            error: (err) => console.error('Error fetching by-gift', err)
          });
        });
      }
    });
  }
}