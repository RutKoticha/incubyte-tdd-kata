import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { User, AuthResponse } from '../../../shared/models/user.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
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
      login: () => of({} as AuthResponse)
    };
    
    toastServiceSpy = {
      success: () => {},
      error: () => {}
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create login component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize empty form controls', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should validate email format and presence', () => {
    const email = component.loginForm.get('email');
    email?.setValue('');
    expect(email?.valid).toBe(false);
    expect(email?.errors?.['required']).toBe(true);

    email?.setValue('invalid-email');
    expect(email?.valid).toBe(false);
    expect(email?.errors?.['email']).toBe(true);

    email?.setValue('user@apex.com');
    expect(email?.valid).toBe(true);
  });

  it('should validate password presence', () => {
    const password = component.loginForm.get('password');
    password?.setValue('');
    expect(password?.valid).toBe(false);
    expect(password?.errors?.['required']).toBe(true);

    password?.setValue('Password123');
    expect(password?.valid).toBe(true);
  });

  it('should mark all fields as touched if form is submitted invalid', () => {
    const loginSpy = vi.spyOn(authServiceSpy, 'login');
    component.onSubmit();
    
    expect(loginSpy).not.toHaveBeenCalled();
    expect(component.loginForm.get('email')?.touched).toBe(true);
    expect(component.loginForm.get('password')?.touched).toBe(true);
  });

  it('should call authService login, toast success, and navigate on successful submission', () => {
    const mockUser: User = { id: '1', name: 'User', email: 'user@apex.com', role: 'user' };
    const mockResponse: AuthResponse = { token: 'mock-jwt-token', user: mockUser };
    
    vi.spyOn(authServiceSpy, 'login').mockReturnValue(of(mockResponse));
    const toastSuccessSpy = vi.spyOn(toastServiceSpy, 'success');
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.loginForm.get('email')?.setValue('user@apex.com');
    component.loginForm.get('password')?.setValue('Password123');
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      email: 'user@apex.com',
      password: 'Password123'
    });
    expect(toastSuccessSpy).toHaveBeenCalledWith('Logged in successfully');
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should toast error on authentication failure', () => {
    const mockError = { error: { message: 'Invalid credentials' } };
    vi.spyOn(authServiceSpy, 'login').mockReturnValue(throwError(() => mockError));
    const toastErrorSpy = vi.spyOn(toastServiceSpy, 'error');

    component.loginForm.get('email')?.setValue('user@apex.com');
    component.loginForm.get('password')?.setValue('WrongPassword');
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(toastErrorSpy).toHaveBeenCalledWith('Invalid credentials');
  });
});
