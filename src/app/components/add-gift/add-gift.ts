import { Component, EventEmitter, inject, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GiftService } from '../../service/gift-service';
import { Category, GiftModel } from '../../models/GiftModel';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-add-gift',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InputTextModule, InputNumberModule, ButtonModule, CardModule],
  templateUrl: './add-gift.html',
  styleUrl: './add-gift.scss',
})
export class AddGift implements OnChanges {
  giftSrv: GiftService = inject(GiftService);

  @Input() id: number = -1; 
  @Output() closeEdit = new EventEmitter<boolean>();

  formGift: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(5)]),
    donorId: new FormControl(0, [Validators.required]),
    price: new FormControl(0, [Validators.required, Validators.min(10), Validators.max(70)]),
    image: new FormControl('')

  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id'] && this.id !== -1) {
      this.giftSrv.getById(this.id).subscribe({
        next: (gift) => {
          console.log('נתוני המתנה שהתקבלו מהשרת:', gift);
          if (gift) {
            this.formGift.patchValue({
              name: gift.name,
              donorId: gift.donorId,
              price: gift.price,
              image: gift.image,
            });
          }
        },
        error: (err) => console.error('שגיאה בטעינת נתוני מתנה:', err)
      });
    } else if (this.id === -1) {
      this.formGift.reset({ name: '', donorId: 0, price: 0, image: '' });
    }
  }

  saveGift() {
    if (this.formGift.invalid) return;

    // בניית האובייקט המלא כולל השדה donorName שנוסף ב-DTO
    const giftToSend: GiftModel = {
      id: this.id === -1 ? 0 : this.id,
      name: this.formGift.value.name,
      donorId: Number(this.formGift.value.donorId),
      price: Number(this.formGift.value.price),
      category: "All_prizes", 
      image: this.formGift.value.image,
      // אנחנו משאירים את זה ריק בשליחה, השרת יחזיר לנו את השם הנכון
      donorName: "" 
    };

    if (this.id !== -1) {
      this.giftSrv.update(giftToSend).subscribe({
        next: (res) => {
          console.log('עודכן בהצלחה:', res);
          this.closeEdit.emit(true);
        },
        error: (err) => console.error('שגיאה בעדכון:', err)
      });
    } else {
      this.giftSrv.add(giftToSend).subscribe({
        next: (res) => {
          console.log('נוסף בהצלחה:', res);
          // כעת res מכיל את ה-donorName שהשרת שלף
          this.closeEdit.emit(true);
        },
        error: (err) => console.error('שגיאה בהוספה:', err)
      });
    }
  }

  finish() {
    this.closeEdit.emit(false);
  }
}