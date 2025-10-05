import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItinerarioRetornoComponent } from './itinerario-retorno.component';

describe('ItinerarioRetornoComponent', () => {
  let component: ItinerarioRetornoComponent;
  let fixture: ComponentFixture<ItinerarioRetornoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItinerarioRetornoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItinerarioRetornoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
