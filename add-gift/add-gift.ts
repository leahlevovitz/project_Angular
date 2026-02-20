import { Component, EventEmitter, inject, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GiftService } from '../../service/gift-service';
import { GiftModel } from '../../models/GiftModel';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-add-gift',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    CardModule,
    DialogModule,
    FormsModule,
    SelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-gift.html',
  styleUrls: ['./add-gift.scss']
})
export class AddGift implements OnChanges {
  giftSrv: GiftService = inject(GiftService);

  @Input() id: number = -1;
  @Output() closeEdit = new EventEmitter<boolean>();

  visible: boolean = true; // מנהל את מצב הדיאלוג

  categories = [
    { label: 'כל הפרסים', value: 'All_prizes' },
    { label: 'רכבים', value: 'Vehicles' },
    { label: 'בית ומשפחה', value: 'Home_and_Family' },
    { label: 'מתנות לנשים', value: 'Gifts_for_Women' },
    { label: 'מתנות לגברים', value: 'Gifts_for_Men' },
    { label: 'תיירות וחופשות', value: 'Tourism_and_Vacations' },
    { label: 'קניות לילדים', value: 'Kids_Shopping' },
    { label: 'יופי וטיפוח', value: 'Beauty_and_Personal_Care' },
    { label: 'מוצרי חשמל', value: 'Electrical_Appliances' }
  ];

  formGift: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(5)]),
    donorId: new FormControl(0, [Validators.required]),
    price: new FormControl(0, [Validators.required, Validators.min(10), Validators.max(70)]),
    image: new FormControl('', Validators.required),
    category: new FormControl(this.categories[0].value, [Validators.required]),
    quantity: new FormControl(1, [Validators.required, Validators.min(1)])
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id'] && this.id !== -1) {
      this.giftSrv.getById(this.id).subscribe({
        next: gift => {
          if (gift) {
            this.formGift.patchValue({
              name: gift.name,
              donorId: gift.donorId,
              price: gift.price,
              image: gift.image,
              category: gift.category || this.categories[0].value,
              quantity: gift.quantity || 1
            });
          }
        }
      });
    } else if (this.id === -1) {
      this.formGift.reset({
        name: '',
        donorId: null,
        price: null,
        image: '',
        category: this.categories[0].value,
        quantity: 1
      });
    }
  }

  saveGift() {
    if (this.formGift.invalid) return;

    const giftToSend: GiftModel = {
      id: this.id === -1 ? 0 : this.id,
      name: this.formGift.value.name,
      donorId: Number(this.formGift.value.donorId),
      price: Number(this.formGift.value.price),
      image: this.formGift.value.image,
      category: this.formGift.value.category,
      donorName: "",
      isLocked: false,
      quantity: Number(this.formGift.value.quantity) || 1
    };

    if (this.id !== -1) {
      this.giftSrv.update(giftToSend).subscribe({ next: () => this.closeEdit.emit(true) });
    } else {
      this.giftSrv.add(giftToSend).subscribe({ next: () => this.closeEdit.emit(true) });
    }
  }

  finish() {
    this.visible = false;
    this.closeEdit.emit(false);
  }
}
