import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RacescheduleComponent } from './raceschedule.component';

describe('RacescheduleComponent', () => {
  let component: RacescheduleComponent;
  let fixture: ComponentFixture<RacescheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RacescheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RacescheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
