import { Component, OnInit, ChangeDetectionStrategy, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-account-form',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './account-form.html',
    styleUrl: './account-form.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountForm implements OnInit {
    accountForm: FormGroup;
    readonly submitted = signal(false);
    readonly isSubmitting = signal(false);
    readonly progress = computed(() => {
        const controls = this.accountForm.controls;
        let filledCount = 0;
        const totalControls = Object.keys(controls).length;

        Object.values(controls).forEach(control => {
            if (control.value && control.value !== '' && control.valid) {
                filledCount++;
            }
        });

        return Math.round((filledCount / totalControls) * 100);
    });

    readonly accountTypes = [
        { value: 'ASSET', label: 'Asset' },
        { value: 'LIABILITY', label: 'Liability' },
        { value: 'EQUITY', label: 'Equity' },
        { value: 'INCOME', label: 'Income' },
        { value: 'EXPENSE', label: 'Expense' }
    ] as const;

    constructor(
        private fb: FormBuilder,
        private router: Router
    ) {
        this.accountForm = this.fb.group({
            code: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
            name: ['', [Validators.required, Validators.maxLength(100)]],
            type: ['ASSET', Validators.required],
            status: ['ACTIVE', Validators.required]
        });
    }

    ngOnInit(): void {
        effect(() => {
            // Trigger change detection when form values change
            this.accountForm.valueChanges.subscribe(() => {
                // Progress is computed automatically
            });
        });
    }

    onSubmit(): void {
        this.submitted.set(true);
        if (this.accountForm.valid) {
            this.isSubmitting.set(true);
            console.log('Form submitted:', this.accountForm.value);
            // TODO: Call service to save account
            setTimeout(() => {
                this.router.navigate(['/chart-of-accounts']);
            }, 1500); // Simulate API call
        }
    }

    cancel(): void {
        this.router.navigate(['/chart-of-accounts']);
    }
}
