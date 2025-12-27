import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FundService } from '../../../services/fund';
import { ToastService } from '../../../services/toast-service';
import { ValuationFrequency, CreateFund } from '../../../models/fund.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-fund-form',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './fund-form.html',
    styleUrl: './fund-form.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FundForm implements OnInit {
    private formBuilder = inject(FormBuilder);
    private fundService = inject(FundService);
    private toastService = inject(ToastService);
    private router = inject(Router);

    fundForm = this.formBuilder.group({
        code: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[A-Z0-9]+$/)]],
        name: ['', [Validators.required, Validators.maxLength(200)]],
        baseCurrency: ['USD', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
        inceptionDate: ['', Validators.required],
        valuationFrequency: ['1', Validators.required]
    });

    isSubmitting = signal(false);
    submitStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
    errorMessage = signal<string>('');

    ngOnInit(): void {
        const today = new Date().toISOString().split('T')[0];
        this.fundForm.patchValue({ inceptionDate: today });
    }

    onSubmit() {
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
            inceptionDate: formValue.inceptionDate!,
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
            error: (error) => {
                this.isSubmitting.set(false);
                this.submitStatus.set('error');

                const message = error.error?.message || 'Failed to create fund. Please try again.';
                this.errorMessage.set(message);
                this.toastService.error(message, 8000);
            }
        });
    }

    retrySubmit() {
        this.submitStatus.set('idle');
        this.errorMessage.set('');
        this.onSubmit();
    }

    clearForm() {
        const today = new Date().toISOString().split('T')[0];
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

    getControl(name: string) {
        return this.fundForm.get(name)!;
    }

    isInvalid(name: string) {
        const c = this.getControl(name);
        return c.touched && c.invalid;
    }

    isValid(name: string) {
        const c = this.getControl(name);
        return c.touched && c.valid;
    }

    hasError(name: string, error: string) {
        return this.getControl(name).errors?.[error];
    }

    protected cancelback() {
        this.fundForm.reset();
        this.router.navigate(['/funds/list']).then(r => this.clearForm());
    }
}
