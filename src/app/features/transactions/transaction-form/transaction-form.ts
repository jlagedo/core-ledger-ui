import {ChangeDetectionStrategy, Component, computed, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgbDatepickerModule, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {PageHeader} from '../../../layout/page-header/page-header';
import {TransactionService} from '../../../services/transaction';
import {FundService} from '../../../services/fund';
import {SecurityService} from '../../../services/security';
import {ToastService} from '../../../services/toast-service';
import {CreateTransaction, TransactionSubType} from '../../../models/transaction.model';
import {Fund} from '../../../models/fund.model';
import {Security} from '../../../models/security.model';

@Component({
  selector: 'app-transaction-form',
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule, PageHeader],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionForm implements OnInit {
  isSubmitting = signal(false);
  submitStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  errorMessage = signal<string>('');

  // Lookup data
  funds = signal<Fund[]>([]);
  securities = signal<Security[]>([]);
  transactionSubTypes = signal<TransactionSubType[]>([]);

  private formBuilder = inject(FormBuilder);
  private transactionService = inject(TransactionService);
  private fundService = inject(FundService);
  private securityService = inject(SecurityService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  transactionForm = this.formBuilder.group({
    fundId: [null as number | null, Validators.required],
    securityId: [null as number | null],
    transactionSubTypeId: [null as number | null, Validators.required],
    tradeDate: [null as NgbDateStruct | null, Validators.required],
    settleDate: [null as NgbDateStruct | null, Validators.required],
    quantity: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
    amount: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    currency: ['USD', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]]
  });

  // Computed amount based on quantity and price
  calculatedAmount = computed(() => {
    const qty = parseFloat(this.transactionForm.get('quantity')?.value || '0');
    const price = parseFloat(this.transactionForm.get('price')?.value || '0');
    return qty * price;
  });

  ngOnInit(): void {
    const today = this.dateToNgbDate(new Date());
    this.transactionForm.patchValue({tradeDate: today, settleDate: today});

    // Load lookup data
    this.loadFunds();
    this.loadSecurities();
    this.loadTransactionSubTypes();

    // Auto-calculate amount when quantity or price changes
    this.transactionForm.get('quantity')?.valueChanges.subscribe(() => this.calculateAmount());
    this.transactionForm.get('price')?.valueChanges.subscribe(() => this.calculateAmount());
  }

  private loadFunds(): void {
    this.fundService.getFunds(1000, 0).subscribe({
      next: response => this.funds.set(response.items),
      error: () => this.toastService.error('Failed to load funds')
    });
  }

  private loadSecurities(): void {
    this.securityService.getSecurities(1000, 0).subscribe({
      next: response => this.securities.set(response.items),
      error: () => this.toastService.error('Failed to load securities')
    });
  }

  private loadTransactionSubTypes(): void {
    this.transactionService.getTransactionSubTypes().subscribe({
      next: subTypes => this.transactionSubTypes.set(subTypes),
      error: () => this.toastService.error('Failed to load transaction types')
    });
  }

  private calculateAmount(): void {
    const qty = parseFloat(this.transactionForm.get('quantity')?.value || '0');
    const price = parseFloat(this.transactionForm.get('price')?.value || '0');
    if (!isNaN(qty) && !isNaN(price)) {
      const amount = (qty * price).toFixed(2);
      this.transactionForm.patchValue({amount}, {emitEvent: false});
    }
  }

  onSubmit() {
    if (this.isSubmitting()) {
      return;
    }

    this.transactionForm.markAllAsTouched();

    if (this.transactionForm.invalid) {
      return;
    }

    this.isSubmitting.set(true);
    this.submitStatus.set('loading');
    this.errorMessage.set('');

    const formValue = this.transactionForm.value;
    const createDto: CreateTransaction = {
      fundId: formValue.fundId!,
      securityId: formValue.securityId || null,
      transactionSubTypeId: formValue.transactionSubTypeId!,
      tradeDate: this.ngbDateToISOString(formValue.tradeDate!),
      settleDate: this.ngbDateToISOString(formValue.settleDate!),
      quantity: parseFloat(formValue.quantity!),
      price: parseFloat(formValue.price!),
      amount: parseFloat(formValue.amount!),
      currency: formValue.currency!.toUpperCase()
    };

    this.transactionService.createTransaction(createDto).subscribe({
      next: (transaction) => {
        this.isSubmitting.set(false);
        this.submitStatus.set('success');
        this.toastService.success('Transaction created successfully', 5000);

        setTimeout(() => {
          this.router.navigate(['/transactions/capture']);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.submitStatus.set('error');

        const message = error.error?.message || 'Failed to create transaction. Please try again.';
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
    const today = this.dateToNgbDate(new Date());
    this.transactionForm.reset({
      fundId: null,
      securityId: null,
      transactionSubTypeId: null,
      tradeDate: today,
      settleDate: today,
      quantity: '',
      price: '',
      amount: '',
      currency: 'USD'
    });
    this.transactionForm.markAsUntouched();
    this.transactionForm.markAsPristine();
    this.submitStatus.set('idle');
    this.errorMessage.set('');
  }

  getControl(name: string) {
    return this.transactionForm.get(name)!;
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

  protected cancel() {
    this.transactionForm.reset();
    this.router.navigate(['/transactions/capture']).then(() => this.clearForm());
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
