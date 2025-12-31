import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {SecurityService} from '../../../../services/security';
import {ToastService} from '../../../../services/toast-service';
import {CreateSecurity, SecurityType as SecurityTypeEnum, UpdateSecurity} from '../../../../models/security.model';
import {toSignal} from '@angular/core/rxjs-interop';
import {PageHeader} from '../../../../layout/page-header/page-header';

@Component({
  selector: 'app-security-form',
  imports: [ReactiveFormsModule, PageHeader],
  templateUrl: './security-form.html',
  styleUrl: './security-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecurityForm implements OnInit {
  securityId = signal<number | null>(null);
  isSubmitting = signal(false);
  submitStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  errorMessage = signal<string>('');
  private formBuilder = inject(FormBuilder);
  securityForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    ticker: ['', [Validators.required, Validators.maxLength(20)]],
    isin: ['', [Validators.maxLength(12)]],
    type: [null as number | null, [Validators.required]],
    currency: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3), Validators.pattern(/^[A-Z]{3}$/)]],
  });
  private securityService = inject(SecurityService);
  securityTypes = toSignal(this.securityService.getSecurityTypes(), {initialValue: []});
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.securityId.set(+id);
      this.loadSecurity(+id);
    }
  }

  loadSecurity(id: number): void {
    this.securityService.getSecurityById(id).subscribe({
      next: (security) => {
        this.securityForm.patchValue({
          name: security.name,
          ticker: security.ticker,
          isin: security.isin,
          type: security.type,
          currency: security.currency,
        });
      },
      error: (err) => {
        this.toastService.error('Failed to load security');
        this.router.navigate(['/admin/securities']);
      }
    });
  }

  onSubmit(): void {
    if (this.isSubmitting()) return;

    this.securityForm.markAllAsTouched();
    if (this.securityForm.invalid) return;

    this.isSubmitting.set(true);
    this.submitStatus.set('loading');

    const formValue = this.securityForm.value;

    const id = this.securityId();
    if (id) {
      // Update existing security
      const dto: UpdateSecurity = {
        name: formValue.name!,
        ticker: formValue.ticker!.toUpperCase(),
        isin: formValue.isin || null,
        type: formValue.type! as SecurityTypeEnum,
        currency: formValue.currency!.toUpperCase(),
      };

      this.securityService.updateSecurity(id, dto).subscribe({
        next: () => {
          this.submitStatus.set('success');
          this.toastService.success('Security updated successfully');
          setTimeout(() => {
            this.router.navigate(['/admin/securities']);
          }, 1500);
        },
        error: (error) => {
          this.isSubmitting.set(false);
          this.submitStatus.set('error');
          this.errorMessage.set(error.error?.message || 'Failed to update security');
        }
      });
    } else {
      // Create new security
      const dto: CreateSecurity = {
        name: formValue.name!,
        ticker: formValue.ticker!.toUpperCase(),
        isin: formValue.isin || null,
        type: formValue.type! as SecurityTypeEnum,
        currency: formValue.currency!.toUpperCase(),
      };

      this.securityService.createSecurity(dto).subscribe({
        next: (security) => {
          this.submitStatus.set('success');
          this.toastService.success('Security created successfully');
          setTimeout(() => {
            this.router.navigate(['/admin/securities']);
          }, 1500);
        },
        error: (error) => {
          this.isSubmitting.set(false);
          this.submitStatus.set('error');
          this.errorMessage.set(error.error?.message || 'Failed to create security');
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/securities']);
  }

  retrySubmit(): void {
    this.submitStatus.set('idle');
    this.errorMessage.set('');
    this.onSubmit();
  }

  clearForm(): void {
    this.securityForm.reset({
      name: '',
      ticker: '',
      isin: '',
      type: null,
      currency: ''
    });
    this.securityForm.markAsUntouched();
    this.securityForm.markAsPristine();
    this.submitStatus.set('idle');
    this.errorMessage.set('');
  }

  getControl(name: string) {
    return this.securityForm.get(name)!;
  }

  isInvalid(name: string): boolean {
    const control = this.getControl(name);
    return control.touched && control.invalid;
  }

  isValid(name: string): boolean {
    const control = this.getControl(name);
    return control.touched && control.valid;
  }

  hasError(name: string, error: string): boolean {
    return this.getControl(name).errors?.[error] || false;
  }
}
