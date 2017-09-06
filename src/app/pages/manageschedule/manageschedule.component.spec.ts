import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagescheduleComponent } from './manageschedule.component';

describe('ManagescheduleComponent', () => {
  let component: ManagescheduleComponent;
  let fixture: ComponentFixture<ManagescheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagescheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagescheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
