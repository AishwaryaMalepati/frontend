import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NascarcalendarComponent } from './nascarcalendar.component';

describe('NascarcalendarComponent', () => {
  let component: NascarcalendarComponent;
  let fixture: ComponentFixture<NascarcalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NascarcalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NascarcalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
