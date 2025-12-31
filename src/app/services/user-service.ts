import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserDto } from '../models/user.model';
import { API_URL } from '../config/api.config';
import { LoggerService } from './logger';
import { ToastService } from './toast-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = inject(API_URL);
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggerService);
  private readonly toastService = inject(ToastService);

  // Private writable signal
  private readonly _currentUser = signal<UserDto | null>(null);

  // Public read-only signal
  readonly currentUser = this._currentUser.asReadonly();

  /**
   * Fetches the current user from the backend.
   * This triggers the backend's first-login flow if the user doesn't exist.
   *
   * @returns Observable<UserDto>
   */
  fetchCurrentUser(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/users/me`).pipe(
      catchError((error: HttpErrorResponse) => {
        // Special handling for 503 Service Unavailable
        if (error.status === 503) {
          this.logger.error(
            'Backend service unavailable during user fetch',
            {
              status: error.status,
              message: error.error?.message,
              correlationId: error.error?.correlationId,
            },
            'UserService.fetchCurrentUser'
          );
          this.toastService.error(
            'User service is temporarily unavailable. Some features may be limited.',
            15000 // Show for 15 seconds
          );
        } else {
          // Log other errors without showing toast
          this.logger.error(
            'Failed to fetch current user',
            {
              status: error.status,
              errorCode: error.error?.errorCode,
              message: error.error?.message,
              correlationId: error.error?.correlationId,
            },
            'UserService.fetchCurrentUser'
          );
        }

        // Return error to allow caller to handle if needed
        return throwError(() => error);
      })
    );
  }

  /**
   * Sets the current user in the signal.
   * Called internally after successful fetch.
   */
  setUser(user: UserDto): void {
    this._currentUser.set(user);
    this.logger.info('User data loaded', { userId: user.id }, 'UserService.setUser');
  }

  /**
   * Clears the current user.
   * Should be called during logout.
   */
  clearUser(): void {
    this._currentUser.set(null);
    this.logger.debug('User data cleared', undefined, 'UserService.clearUser');
  }
}
