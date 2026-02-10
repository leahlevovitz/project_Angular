
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAndUpdateDonorComponent } from '../add-and-updte-donor/add-and-updte-donor';
import { DonorService } from '../../service/donor-service';
import { DonorModel } from '../../models/DonorModel';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';     
import { map, switchMap } from 'rxjs/operators';
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

  private refresh$ = new BehaviorSubject<void>(undefined);
  private donors$ = this.refresh$.pipe(switchMap(() => this.donorsrv.getAll()));

  private filterTerm$ = new BehaviorSubject<string>('');
  private filterType$ = new BehaviorSubject<'name' | 'email' | 'gift'>('name');

  list$ : Observable<DonorModel[]> = combineLatest([this.donors$, this.filterTerm$, this.filterType$]).pipe(
    map(([list, term, type]) => {
      if (!term) return list;
      const t = term.trim().toLowerCase();
      return list.filter(d => {
        if (type === 'name') return (d.name || '').toLowerCase().includes(t);
        if (type === 'email') return (d.email || '').toLowerCase().includes(t);
        if (type === 'gift') return (d.GiftList || []).some(g => (g.name || '').toLowerCase().includes(t));
        return true;
      });
    })
  );

  ngOnInit(): void {
    // initial load is handled by refresh$
    console.log('Donors component initialized');
  }


deleteDonor(id: number) {
  this.donorsrv.delete(id).subscribe({
    next: () => {
      console.log(`Donor with ID ${id} deleted successfully.`);
      // Refresh the list after deletion
      this.refresh$.next();
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
      this.refresh$.next();
    }
  }

  onFilterTerm(event: Event) {
    const v = (event.target as HTMLInputElement).value || '';
    this.filterTerm$.next(v);
  }

  onFilterType(event: Event) {
    const v = (event.target as HTMLSelectElement).value as 'name' | 'email' | 'gift';
    this.filterType$.next(v);
  }

  clearFilter() {
    this.filterTerm$.next('');
    this.filterType$.next('name');
  }
}