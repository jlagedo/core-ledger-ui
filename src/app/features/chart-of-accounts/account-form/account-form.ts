import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {OnlyNumbers} from '../../../directives/only-numbers';
import {AccountService} from '../../../services/account';
import {toSignal} from '@angular/core/rxjs-interop';
import {ToastService} from '../../../services/toast-service';
import {AccountStatus, CreateAccount, NormalBalance} from '../../../models/account.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-account-form',
  imports: [CommonModule, ReactiveFormsModule, OnlyNumbers],
  templateUrl: './account-form.html',
  styleUrl: './account-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountForm implements OnInit {
  isSubmitting = signal(false);
  submitStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  errorMessage = signal<string>('');
  private formBuilder = inject(FormBuilder);
  accountForm = this.formBuilder.group({
    accountNumber: ['', [Validators.required, Validators.maxLength(10)]],
    description: ['', Validators.required],
    normalBalance: ['2', Validators.required],
    type: ['', Validators.required]
  });
  private accountService = inject(AccountService);
  accountTypes = toSignal(this.accountService.getAccountTypes(), {initialValue: []});
  private toastService = inject(ToastService);
  private router = inject(Router);

  ngOnInit(): void {
    // Component initialization
  }

  onSubmit() {
    if (this.isSubmitting()) {
      return;
    }

    this.accountForm.markAllAsTouched();

    if (this.accountForm.invalid) {
      return;
    }

    this.isSubmitting.set(true);
    this.submitStatus.set('loading');
    this.errorMessage.set('');

    const formValue = this.accountForm.value;
    const createAccountDto: CreateAccount = {
      code: Number(formValue.accountNumber),
      name: formValue.description!,
      typeId: Number(formValue.type),
      status: AccountStatus.Active,
      normalBalance: Number(formValue.normalBalance) as NormalBalance
    };

    this.accountService.createAccount(createAccountDto).subscribe({
      next: (account) => {
        this.isSubmitting.set(false);
        this.submitStatus.set('success');
        this.toastService.success('Account created successfully', 5000);

        setTimeout(() => {
          this.router.navigate(['/chart-of-accounts']);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.submitStatus.set('error');

        const message = error.error?.message || 'Failed to create account. Please try again.';
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
    this.accountForm.reset({normalBalance: '2'});
    this.accountForm.markAsUntouched();
    this.accountForm.markAsPristine();
    this.submitStatus.set('idle');
    this.errorMessage.set('');
  }

  getControl(name: string) {
    return this.accountForm.get(name)!;
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
    this.accountForm.reset();
    this.router.navigate(['/chart-of-accounts']).then(r => this.clearForm());
  }
}
