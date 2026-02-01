import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DonorService } from '../../service/donor-service';

@Component({
  selector: 'app-add-and-updte-donor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule],
  templateUrl: './add-and-updte-donor.html',
  styleUrl: './add-and-updte-donor.scss',
})
export class AddAndUpdateDonorComponent implements OnChanges {

  private donorSrv = inject(DonorService);

  @Input() id: number = -1; // -1 = הוספה
  @Output() closeEdit = new EventEmitter<boolean>();

  visible: boolean = true;

  formDonor: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(5)]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id']) {
      if (this.id === -1) {
        this.formDonor.reset();
      } else {
        this.loadDonor();
      }
    }
  }

  private loadDonor(): void {
    this.donorSrv.getById(this.id).subscribe({
      next: donor => {
        if (donor) {
          this.formDonor.patchValue({
            name: donor.name,
            email: donor.email,
          });
        }
      },
      error: err => console.error('שגיאה בטעינת תורם', err),
    });
  }

  saveDonor(): void {
    if (this.formDonor.invalid) return;

    const donorToSend = {
      id: this.id === -1 ? 0 : this.id,
      name: this.formDonor.value.name!,
      email: this.formDonor.value.email!,
    };

    const request$ = this.id === -1
      ? this.donorSrv.add(donorToSend)
      : this.donorSrv.update(donorToSend);

    request$.subscribe({
      next: () => this.finish(true),
      error: err => {
        console.error('שגיאה בשמירה', err);
        alert('שגיאה בשמירת התורם');
      }
    });
  }

  finish(wasSaved: boolean): void {
    this.visible = false;
    this.closeEdit.emit(wasSaved);
  }
}
