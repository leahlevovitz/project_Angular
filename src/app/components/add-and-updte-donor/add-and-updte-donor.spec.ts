import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAndUpdteDonor } from './add-and-updte-donor';

describe('AddAndUpdteDonor', () => {
  let component: AddAndUpdteDonor;
  let fixture: ComponentFixture<AddAndUpdteDonor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAndUpdteDonor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAndUpdteDonor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
