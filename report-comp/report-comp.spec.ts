import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportComp } from './report-comp';

describe('ReportComp', () => {
  let component: ReportComp;
  let fixture: ComponentFixture<ReportComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
