import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketComp } from './basket-comp';

describe('BasketComp', () => {
  let component: BasketComp;
  let fixture: ComponentFixture<BasketComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasketComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasketComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
