import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormControl, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-account-form',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './account-form.html',
    styleUrl: './account-form.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountForm  {
  accountForm = new FormGroup({
    accountNumber: new FormControl(''),
    description: new FormControl(''),
    normalBalance: new FormControl(''),
    type: new FormControl('')
  });

  onSubmit() {
    console.log(this.accountForm.value);
  }
}
