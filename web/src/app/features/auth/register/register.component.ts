import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastService } from '../../../shared/services/toast.service';

/**
 * Custom validator to verify if password and confirmPassword values match.
 * @param control The FormGroup containing the password fields.
 */
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    /* 
     * Choice justification:
     * Returning the error on the parent group level allows easy access to form-wide state.
     * We set the error on the confirmPassword control directly as well, so it automatically triggers
     * visual invalid states in the DOM without requiring complex template logic.
     */
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }
  return null;
}

/**
 * Component handling user registration.
 * Implements Catppuccin Mocha aesthetics and Material 3 layouts.
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="m3-auth-container">
      <div class="m3-auth-card">
        <header class="m3-auth-header">
          <div class="m3-logo-badge">BMW</div>
          <h1>Create account</h1>
          <p>Get started with BMW</p>
        </header>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="m3-auth-form" novalidate>
          <div class="m3-field-container">
            <input 
              type="text" 
              id="name" 
              formControlName="name" 
              placeholder=" " 
              [class.m3-invalid]="isFieldInvalid('name')"
            />
            <label for="name">Full Name</label>
            @if (isFieldInvalid('name')) {
              <span class="m3-error-text" id="name-error">
                Name must be at least 3 characters long
              </span>
            }
          </div>

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
                @if (registerForm.get('email')?.errors?.['required']) {
                  Email is required
                } @else if (registerForm.get('email')?.errors?.['email']) {
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
                @if (registerForm.get('password')?.errors?.['required']) {
                  Password is required
                } @else if (registerForm.get('password')?.errors?.['minlength']) {
                  Password must be at least 8 characters
                } @else if (registerForm.get('password')?.errors?.['pattern']) {
                  Must contain at least 1 uppercase, 1 lowercase letter, 1 number, and 1 special character
                }
              </span>
            }
          </div>

          <div class="m3-field-container">
            <input 
              type="password" 
              id="confirmPassword" 
              formControlName="confirmPassword" 
              placeholder=" " 
              [class.m3-invalid]="isFieldInvalid('confirmPassword') || registerForm.errors?.['passwordMismatch'] && registerForm.get('confirmPassword')?.touched"
            />
            <label for="confirmPassword">Confirm Password</label>
            @if (registerForm.get('confirmPassword')?.touched && (registerForm.get('confirmPassword')?.errors?.['required'] || registerForm.errors?.['passwordMismatch'])) {
              <span class="m3-error-text" id="confirmPassword-error">
                @if (registerForm.get('confirmPassword')?.errors?.['required']) {
                  Please confirm your password
                } @else if (registerForm.errors?.['passwordMismatch']) {
                  Passwords do not match
                }
              </span>
            }
          </div>

          <button 
            type="submit" 
            class="m3-btn m3-btn-primary" 
            [disabled]="isLoading"
          >
            @if (isLoading) {
              Registering...
            } @else {
              Register
            }
          </button>
        </form>

        <footer class="m3-auth-footer">
          <p>Already have an account? <a routerLink="/login">Sign in instead</a></p>
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
     * to avoid adding manual event listener code or Angular-side state, keeping the form field 
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
export class RegisterComponent {
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

  /** Reactive registration form. */
  readonly registerForm: FormGroup = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required, 
      Validators.minLength(8), 
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    ]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: [passwordMatchValidator]
  });

  /**
   * Helper to check if a specific form field is invalid.
   * @param field Name of the form control.
   */
  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  /**
   * Form submission handler. Validates inputs and signs up.
   */
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { name, email, password, confirmPassword } = this.registerForm.value;
    
    /* 
     * Choice justification:
     * By default, we register new users with the standard 'user' role.
     * Administrative users must be promoted via backend database modifications.
     * We pass confirmPassword to satisfy backend validation constraint.
     */
    this.authService.register({ name, email, password, confirmPassword }).subscribe({
      next: () => {
        this.isLoading = false;
        this.toast.success('Registration successful! Please sign in.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.error(err.error?.message || 'Email is already registered');
      }
    });
  }
}
