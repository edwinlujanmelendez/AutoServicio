import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsientosRetornoComponent } from './asientos-retorno.component';

describe('AsientosRetornoComponent', () => {
  let component: AsientosRetornoComponent;
  let fixture: ComponentFixture<AsientosRetornoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsientosRetornoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsientosRetornoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
