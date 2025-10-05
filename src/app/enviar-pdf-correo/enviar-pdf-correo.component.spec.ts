import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviarPdfCorreoComponent } from './enviar-pdf-correo.component';

describe('EnviarPdfCorreoComponent', () => {
  let component: EnviarPdfCorreoComponent;
  let fixture: ComponentFixture<EnviarPdfCorreoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnviarPdfCorreoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnviarPdfCorreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
