import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivateModal } from './deactivate-modal';

describe('DeactivateModal', () => {
  let component: DeactivateModal;
  let fixture: ComponentFixture<DeactivateModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeactivateModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeactivateModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
