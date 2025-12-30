import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PageHeader } from '../../layout/page-header/page-header';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile',
  imports: [PageHeader],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile {
  private readonly authService = inject(AuthService);

  readonly userProfile = this.authService.userProfile;
}
