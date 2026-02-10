import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LotteryService } from '../../service/lottery-service'
import { LotteryModel } from '../../models/LotteryModel'
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-lottery-comp',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule],
  templateUrl: './lottery-comp.html',
  styleUrl: './lottery-comp.scss',
})
export class LotteryComp implements OnInit {

  report: LotteryModel[] = [];
  totalIncome = 0;
  loading = false;
  message = '';

  constructor(private lotterySrv: LotteryService) {}

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.lotterySrv.getReport().subscribe({
      next: res => {
        this.report = res;
        this.calcIncome();
      },
      error: err => console.error(err)
    });
  }

  draw(giftId: number): void {
    this.loading = true;
    this.lotterySrv.drawLottery(giftId).subscribe({
      next: msg => {
        this.message = msg;
        this.loadReport();
        this.loading = false;
      },
      error: err => {
        this.message = err.error;
        this.loading = false;
      }
    });
  }

  private calcIncome(): void {
    this.totalIncome = this.report.reduce(
      (sum, x) => sum + x.Quantity,
      0
    );
  }
}
