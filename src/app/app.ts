import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import {BreadCrumbComponent} from './layout/bread-crumb-component/bread-crumb-component';
import {ToastsContainer} from './layout/toasts-container/toasts-container';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, BreadCrumbComponent, ToastsContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('core-ledger-ui');
}
