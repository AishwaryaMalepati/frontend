import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerdiemcalculatorComponent } from './perdiemcalculator.component';

describe('PerdiemcalculatorComponent', () => {
  let component: PerdiemcalculatorComponent;
  let fixture: ComponentFixture<PerdiemcalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerdiemcalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerdiemcalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
