import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotteryComp } from './lottery-comp';

describe('LotteryComp', () => {
  let component: LotteryComp;
  let fixture: ComponentFixture<LotteryComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LotteryComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LotteryComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
