import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import {BreadCrumbComponent} from './layout/bread-crumb-component/bread-crumb-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, BreadCrumbComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('core-ledger-ui');
}
