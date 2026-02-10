import { Component } from '@angular/core';
import { PurchasersService } from '../../service/purchasers-service';
import { TotalRevenueDTO } from '../../models/TotalRevenueDTO ';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report-comp',
  imports: [CommonModule],
  templateUrl: './report-comp.html',
  styleUrl: './report-comp.scss',
})
export class ReportComp {


  constructor(private purchasersService: PurchasersService) {}

  ngOnInit(): void {
  }


}


