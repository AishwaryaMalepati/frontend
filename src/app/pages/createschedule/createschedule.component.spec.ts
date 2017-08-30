import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatescheduleComponent } from './createschedule.component';

describe('CreatescheduleComponent', () => {
  let component: CreatescheduleComponent;
  let fixture: ComponentFixture<CreatescheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatescheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatescheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
