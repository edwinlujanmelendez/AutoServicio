import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaErrorComponent } from './pantalla-error.component';

describe('PantallaErrorComponent', () => {
  let component: PantallaErrorComponent;
  let fixture: ComponentFixture<PantallaErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PantallaErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PantallaErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
