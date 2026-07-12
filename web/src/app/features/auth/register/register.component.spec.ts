import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { User } from '../../../shared/models/user.model';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: any;
  let toastServiceSpy: any;
  let router: Router;

  beforeEach(async () => {
    /* 
     * Choice justification:
     * We use mock objects with spy functions for AuthService, ToastService, and Router
     * to avoid triggering actual external operations (like local storage modification, navigation, 
     * or HTTP requests) and to allow precise assertion verification on mock interactions.
     */
    authServiceSpy = {
      register: () => of({} as User)
    };
    
    toastServiceSpy = {
      success: () => {},
      error: () => {}
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create register component', () => {
    expect(component).toBeTruthy();
  });

  it('should validate name length and presence', () => {
    const name = component.registerForm.get('name');
    name?.setValue('');
    expect(name?.valid).toBe(false);

    name?.setValue('a');
    expect(name?.valid).toBe(false);

    name?.setValue('ab');
    expect(name?.valid).toBe(false);

    name?.setValue('John');
    expect(name?.valid).toBe(true);
  });

  it('should validate secure password pattern and min length', () => {
    const password = component.registerForm.get('password');
    password?.setValue('');
    expect(password?.valid).toBe(false);

    // Too short
    password?.setValue('Pass1');
    expect(password?.valid).toBe(false);

    // No uppercase
    password?.setValue('password123!');
    expect(password?.valid).toBe(false);

    // No number
    password?.setValue('Password!');
    expect(password?.valid).toBe(false);

    // No special char
    password?.setValue('Password123');
    expect(password?.valid).toBe(false);

    // Secure password
    password?.setValue('Password123!');
    expect(password?.valid).toBe(true);
  });

  it('should validate password matching', () => {
    component.registerForm.get('password')?.setValue('Password123!');
    component.registerForm.get('confirmPassword')?.setValue('Password456!');
    
    // Explicit trigger of validation
    component.registerForm.updateValueAndValidity();
    
    expect(component.registerForm.errors?.['passwordMismatch']).toBe(true);
    expect(component.registerForm.get('confirmPassword')?.errors?.['passwordMismatch']).toBe(true);

    component.registerForm.get('confirmPassword')?.setValue('Password123!');
    component.registerForm.updateValueAndValidity();
    
    expect(component.registerForm.errors).toBeNull();
  });

  it('should not submit form if form is invalid', () => {
    const registerSpy = vi.spyOn(authServiceSpy, 'register');
    component.onSubmit();
    
    expect(registerSpy).not.toHaveBeenCalled();
  });

  it('should call authService register, toast success, and navigate on successful submission', () => {
    const mockUser: User = { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' };
    vi.spyOn(authServiceSpy, 'register').mockReturnValue(of(mockUser));
    const toastSuccessSpy = vi.spyOn(toastServiceSpy, 'success');
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.registerForm.get('name')?.setValue('John Doe');
    component.registerForm.get('email')?.setValue('john@example.com');
    component.registerForm.get('password')?.setValue('Password123!');
    component.registerForm.get('confirmPassword')?.setValue('Password123!');
    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });
    expect(toastSuccessSpy).toHaveBeenCalledWith('Registration successful! Please sign in.');
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should toast error on register failure', () => {
    const mockError = { error: { message: 'Email is already registered' } };
    vi.spyOn(authServiceSpy, 'register').mockReturnValue(throwError(() => mockError));
    const toastErrorSpy = vi.spyOn(toastServiceSpy, 'error');

    component.registerForm.get('name')?.setValue('John Doe');
    component.registerForm.get('email')?.setValue('john@example.com');
    component.registerForm.get('password')?.setValue('Password123!');
    component.registerForm.get('confirmPassword')?.setValue('Password123!');
    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalled();
    expect(toastErrorSpy).toHaveBeenCalledWith('Email is already registered');
  });
});
