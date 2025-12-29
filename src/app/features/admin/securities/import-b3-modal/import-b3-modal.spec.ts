import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ImportB3Modal} from './import-b3-modal';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

describe('ImportB3Modal', () => {
  let component: ImportB3Modal;
  let fixture: ComponentFixture<ImportB3Modal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportB3Modal],
      providers: [NgbActiveModal]
    }).compileComponents();

    fixture = TestBed.createComponent(ImportB3Modal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
