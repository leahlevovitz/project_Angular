import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasersComp } from './purchasers-comp';

describe('PurchasersComp', () => {
  let component: PurchasersComp;
  let fixture: ComponentFixture<PurchasersComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasersComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasersComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
