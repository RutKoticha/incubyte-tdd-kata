import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastService } from '../../../shared/services/toast.service';

/**
 * Component handling the user login page.
 * Uses Material 3 design and Catppuccin Mocha aesthetics.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="m3-auth-container">
      <div class="m3-auth-card">
        <header class="m3-auth-header">
          <div class="m3-logo-badge">BMW</div>
          <h1>Sign in</h1>
          <p>to access Car Dealership Inventory</p>
        </header>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="m3-auth-form" novalidate>
          <div class="m3-field-container">
            <input 
              type="email" 
              id="email" 
              formControlName="email" 
              placeholder=" " 
              [class.m3-invalid]="isFieldInvalid('email')"
            />
            <label for="email">Email</label>
            @if (isFieldInvalid('email')) {
              <span class="m3-error-text" id="email-error">
                @if (loginForm.get('email')?.errors?.['required']) {
                  Email is required
                } @else if (loginForm.get('email')?.errors?.['email']) {
                  Please enter a valid email address
                }
              </span>
            }
          </div>

          <div class="m3-field-container">
            <input 
              type="password" 
              id="password" 
              formControlName="password" 
              placeholder=" " 
              [class.m3-invalid]="isFieldInvalid('password')"
            />
            <label for="password">Password</label>
            @if (isFieldInvalid('password')) {
              <span class="m3-error-text" id="password-error">
                Password is required
              </span>
            }
          </div>

          <button 
            type="submit" 
            class="m3-btn m3-btn-primary" 
            [disabled]="isLoading"
          >
            @if (isLoading) {
              Signing in...
            } @else {
              Sign in
            }
          </button>
        </form>

        <footer class="m3-auth-footer">
          <p>Don't have an account? <a routerLink="/register">Create an account</a></p>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .m3-auth-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background-color: var(--m3-background);
      padding: 16px;
    }

    .m3-auth-card {
      width: 100%;
      max-width: 400px;
      background-color: var(--m3-surface-container);
      border-radius: 28px;
      padding: 40px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
    }

    .m3-auth-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .m3-logo-badge {
      display: inline-block;
      background-color: var(--m3-primary);
      color: var(--m3-on-primary);
      padding: 4px 12px;
      border-radius: 100px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1.5px;
      margin-bottom: 16px;
    }

    .m3-auth-header h1 {
      font-size: 32px;
      font-weight: 500;
      color: var(--m3-on-background);
      margin-bottom: 8px;
    }

    .m3-auth-header p {
      color: var(--ctp-subtext1);
      font-size: 14px;
    }

    .m3-auth-form {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    /* 
     * Choice justification:
     * We use a pure CSS floating label technique using :placeholder-shown combined with placeholder=" "
     * to avoid adding manual event listener code or Angular-side component state, keeping the form field 
     * lightweight and rendering-efficient.
     */
    .m3-field-container {
      position: relative;
      margin-bottom: 24px;
      width: 100%;
    }

    .m3-field-container input {
      width: 100%;
      height: 56px;
      background: transparent;
      border: 1px solid var(--m3-outline);
      border-radius: 12px;
      padding: 16px;
      color: var(--m3-on-background);
      font-size: 16px;
      outline: none;
      transition: border-color 0.2s ease, border-width 0.1s ease;
    }

    .m3-field-container label {
      position: absolute;
      left: 16px;
      top: 16px;
      color: var(--ctp-subtext0);
      font-size: 16px;
      pointer-events: none;
      transition: transform 0.2s ease, font-size 0.2s ease, color 0.2s ease, background-color 0.2s ease;
      padding: 0 4px;
    }

    .m3-field-container input:focus ~ label,
    .m3-field-container input:not(:placeholder-shown) ~ label {
      transform: translateY(-26px) scale(0.85);
      background-color: var(--m3-surface-container);
      color: var(--m3-primary);
    }

    .m3-field-container input:focus {
      border-color: var(--m3-primary);
      border-width: 2px;
    }

    .m3-field-container input.m3-invalid {
      border-color: var(--m3-error);
    }

    .m3-field-container input.m3-invalid ~ label {
      color: var(--m3-error);
    }

    .m3-error-text {
      font-size: 12px;
      color: var(--m3-error);
      margin-top: 4px;
      display: block;
      padding-left: 16px;
    }

    .m3-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 56px;
      border: none;
      border-radius: 100px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.1s ease;
      width: 100%;
    }

    .m3-btn-primary {
      background-color: var(--m3-primary);
      color: var(--m3-on-primary);
    }

    .m3-btn-primary:hover {
      background-color: var(--ctp-pink);
    }

    .m3-btn-primary:active {
      transform: scale(0.98);
    }

    .m3-btn-primary:disabled {
      background-color: var(--ctp-surface2);
      color: var(--ctp-subtext0);
      cursor: not-allowed;
    }

    .m3-auth-footer {
      text-align: center;
      margin-top: 24px;
      font-size: 14px;
      color: var(--ctp-subtext1);
    }

    .m3-auth-footer a {
      color: var(--m3-primary);
      text-decoration: none;
      font-weight: 500;
    }

    .m3-auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  /** Angular Router. */
  private readonly router = inject(Router);
  /** Angular Form Builder. */
  private readonly fb = inject(FormBuilder);
  /** Authentication Service. */
  private readonly authService = inject(AuthService);
  /** Global Toast Notification Service. */
  private readonly toast = inject(ToastService);

  /** Indicates if a request is in progress. */
  isLoading = false;

  /** Reactive login form instance. */
  readonly loginForm: FormGroup = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  /**
   * Helper to check if a specific form field is invalid.
   * @param field Name of the form control.
   */
  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  /**
   * Form submission handler. Validates inputs and logs in.
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.toast.success('Logged in successfully');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.error(err.error?.message || 'Invalid email or password');
      }
    });
  }
}
