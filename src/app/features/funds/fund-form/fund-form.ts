import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgbDatepickerModule, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {FundService} from '../../../services/fund';
import {ToastService} from '../../../services/toast-service';
import {CreateFund, ValuationFrequency} from '../../../models/fund.model';
import {Router} from '@angular/router';
import {PageHeader} from '../../../layout/page-header/page-header';

@Component({
  selector: 'app-fund-form',
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule, PageHeader],
  templateUrl: './fund-form.html',
  styleUrl: './fund-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FundForm implements OnInit {
  isSubmitting = signal(false);
  submitStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  errorMessage = signal<string>('');
  private formBuilder = inject(FormBuilder);
  fundForm = this.formBuilder.group({
    code: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[A-Z0-9]+$/)]],
    name: ['', [Validators.required, Validators.maxLength(200)]],
    baseCurrency: ['USD', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
    inceptionDate: [null as NgbDateStruct | null, Validators.required],
    valuationFrequency: ['1', Validators.required]
  });
  private fundService = inject(FundService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  ngOnInit(): void {
    const today = this.dateToNgbDate(new Date());
    this.fundForm.patchValue({inceptionDate: today});
  }

  onSubmit(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.fundForm.markAllAsTouched();

    if (this.fundForm.invalid) {
      return;
    }

    this.isSubmitting.set(true);
    this.submitStatus.set('loading');
    this.errorMessage.set('');

    const formValue = this.fundForm.value;
    const createFundDto: CreateFund = {
      code: formValue.code!.toUpperCase(),
      name: formValue.name!,
      baseCurrency: formValue.baseCurrency!.toUpperCase(),
      inceptionDate: this.ngbDateToISOString(formValue.inceptionDate!),
      valuationFrequency: Number(formValue.valuationFrequency) as ValuationFrequency
    };

    this.fundService.createFund(createFundDto).subscribe({
      next: (fund) => {
        this.isSubmitting.set(false);
        this.submitStatus.set('success');
        this.toastService.success('Fund created successfully', 5000);

        setTimeout(() => {
          this.router.navigate(['/funds/list']);
        }, 1500);
      },
      error: (error: unknown) => {
        this.isSubmitting.set(false);
        this.submitStatus.set('error');

        const message = (error as any).error?.message || 'Failed to create fund. Please try again.';
        this.errorMessage.set(message);
        this.toastService.error(message, 8000);
      }
    });
  }

  retrySubmit(): void {
    this.submitStatus.set('idle');
    this.errorMessage.set('');
    this.onSubmit();
  }

  clearForm(): void {
    const today = this.dateToNgbDate(new Date());
    this.fundForm.reset({
      code: '',
      baseCurrency: 'USD',
      valuationFrequency: '1',
      inceptionDate: today
    });
    this.fundForm.markAsUntouched();
    this.fundForm.markAsPristine();
    this.submitStatus.set('idle');
    this.errorMessage.set('');
  }

  getControl(name: string): AbstractControl {
    return this.fundForm.get(name)!;
  }

  isInvalid(name: string): boolean {
    const c = this.getControl(name);
    return c.touched && c.invalid;
  }

  isValid(name: string): boolean {
    const c = this.getControl(name);
    return c.touched && c.valid;
  }

  hasError(name: string, error: string): boolean {
    return this.getControl(name).errors?.[error];
  }

  protected cancelback(): void {
    this.fundForm.reset();
    this.router.navigate(['/funds/list']).then(r => this.clearForm());
  }

  private dateToNgbDate(date: Date): NgbDateStruct {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }

  private ngbDateToISOString(date: NgbDateStruct): string {
    const month = String(date.month).padStart(2, '0');
    const day = String(date.day).padStart(2, '0');
    return `${date.year}-${month}-${day}`;
  }
}
