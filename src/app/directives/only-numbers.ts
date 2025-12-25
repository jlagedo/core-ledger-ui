import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]',
})
export class OnlyNumbers {

  private readonly allowedKeys = [
    'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter'
  ];

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow navigation/editing keys
    if (this.allowedKeys.includes(event.key)) {
      return;
    }

    // Block anything that is not a digit
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const pasted = event.clipboardData?.getData('text') ?? '';
    if (!/^[0-9]+$/.test(pasted)) {
      event.preventDefault();
    }
  }

}
