import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PageHeader} from './page-header';
import {ActivatedRoute} from '@angular/router';
import {provideRouter} from '@angular/router';

describe('PageHeader', () => {
  let component: PageHeader;
  let fixture: ComponentFixture<PageHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeader],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeader);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the provided title', () => {
    fixture.componentRef.setInput('title', 'Test Page');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Test Page');
  });

  it('should always show breadcrumb component', () => {
    fixture.componentRef.setInput('title', 'Test');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-bread-crumb-component')).toBeTruthy();
  });
});
