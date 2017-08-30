import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerdiemComponent } from './perdiem.component';

describe('PerdiemComponent', () => {
  let component: PerdiemComponent;
  let fixture: ComponentFixture<PerdiemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerdiemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerdiemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
