import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimprimirBoletosComponent } from './reimprimir-boletos.component';

describe('ReimprimirBoletosComponent', () => {
  let component: ReimprimirBoletosComponent;
  let fixture: ComponentFixture<ReimprimirBoletosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReimprimirBoletosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReimprimirBoletosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
