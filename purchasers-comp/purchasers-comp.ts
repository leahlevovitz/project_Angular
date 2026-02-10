import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchasersService } from '../../service/purchasers-service';
import { PurchasersModel } from '../../models/PurchasersModel';
import { GiftModel } from '../../models/GiftModel';
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

  // מערך שיחזיק את המתנות, ולכל מתנה נוסיף שדה דינמי של רוכשים
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
  loadInitialData(): void {
    // 1. נטען קודם את הדו"ח הכללי (סך הכנסות)
    this.purchasersService.getReport().subscribe({
      next: (data: any) => {
        this.totalRevenue = data.PurchasersCount || 0;
      },
      error: (err) => console.error('Error fetching report', err)
    });
    // 2. נטען את כל הרכישות כדי לקבל את רשימת המתנות והפרטים שלהן  
    this.purchasersService.getAll().subscribe({
      next: (data: PurchasersModel[]) => {
        // ניקח רשימה ייחודית של מתנות מתוך הרכישות כדי ליצור כותרות
        const uniqueGifts = Array.from(new Set(data.map(p => p.giftId)));
        
        this.gifts = uniqueGifts.map(id => {
          const firstMatch = data.find(p => p.giftId === id);
          return {
            id: id,
            name: firstMatch?.giftName || 'מתנה ללא שם',
            price: firstMatch?.giftPrice || 0,
            purchasers: [] // יתמלא מיד
          };
        });

        // 3. עבור כל מתנה, נמשוך את הרוכשים הספציפיים שלה מהשרת לפי ה-ID
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