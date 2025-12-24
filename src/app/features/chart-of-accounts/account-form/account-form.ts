import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OnlyNumbers } from '../../../directives/only-numbers';
import { AccountService } from '../../../services/account';
import { AccountType } from '../../../models/account_type.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-account-form',
  imports: [CommonModule, ReactiveFormsModule, OnlyNumbers],
  templateUrl: './account-form.html',
  styleUrl: './account-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  private accountService = inject(AccountService);

  accountForm = this.formBuilder.group({
    accountNumber: ['', [Validators.required, Validators.maxLength(10)]],
    description: ['', Validators.required],
    normalBalance: ['2', Validators.required],
    type: ['', Validators.required]
  });

  accountTypes = toSignal(this.accountService.getAccountTypes(), { initialValue: [] });

  ngOnInit(): void {
    console.log('ngOnInit');
  }

  onSubmit() {
    console.log(this.accountForm.value);
  }

  clearForm() {
    this.accountForm.reset();
    this.accountForm.markAsUntouched();
    this.accountForm.markAsPristine();
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
}
