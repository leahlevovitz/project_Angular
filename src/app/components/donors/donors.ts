
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAndUpdateDonorComponent } from '../add-and-updte-donor/add-and-updte-donor';
import { DonorService } from '../../service/donor-service';
import { DonorModel } from '../../models/DonorModel';
import { Observable } from 'rxjs';      
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-donors',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, AddAndUpdateDonorComponent],
  templateUrl: './donors.html',
  styleUrl: './donors.scss',
})
export class Donors implements OnInit {


donorsrv: DonorService = inject(DonorService);
list$ : Observable<DonorModel[]>= this.donorsrv.getAll();
ngOnInit(): void {
  this.list$ = this.donorsrv.getAll();
  console.log(this.list$);
}


deleteDonor(id: number) {
  this.donorsrv.delete(id).subscribe({
    next: () => {
      console.log(`Donor with ID ${id} deleted successfully.`);
      // Refresh the list after deletion
      this.list$ = this.donorsrv.getAll();
    },
    error: (err) =>{ console.error('Error deleting donor:', err)

      alert('לא ניתן למחוק תורם שיש לו מתנות משוייכות')
    }
    
  });
  
}
selectedId: number = -1;
isEditMode: boolean = false;
openAddDonor() {
  this.isEditMode = true;
  this.selectedId = -1;
}
updateDonor(id: number) {
  this.isEditMode = true;
  this.selectedId = id;
  console.log(id);
}
handleClose(wasSaved: boolean) {
    this.isEditMode = false; // סוגר את חלונית ההוספה/עריכה
    this.selectedId = -1;

    if (wasSaved) {
      // כאן הקסם קורה: דריסת ה-Observable בזרם חדש גורמת ל-HTML להתרענן
      this.list$ = this.donorsrv.getAll();
    }
  }
}