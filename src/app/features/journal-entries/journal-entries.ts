import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PageHeader} from '../../layout/page-header/page-header';

@Component({
  selector: 'app-journal-entries',
  imports: [PageHeader],
  templateUrl: './journal-entries.html',
  styleUrl: './journal-entries.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JournalEntries {

}
