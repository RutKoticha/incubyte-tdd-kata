import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { User, AuthResponse } from '../../shared/models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    /* 
     * Choice justification:
     * We use provideHttpClientTesting to easily mock HTTP backend requests,
     * allowing test cases to run hermetically without needing a real server.
     */
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);

    // Clear localStorage and cookies to isolate tests
    localStorage.clear();
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    service = TestBed.inject(AuthService);
    expect(service).toBeTruthy();
  });

  it('should sign up a user via POST request', () => {
    service = TestBed.inject(AuthService);
    const mockUser: User = { id: '123', name: 'John Doe', email: 'john@example.com', role: 'user' };
    const payload = { name: 'John Doe', email: 'john@example.com', password: 'Password123' };

    service.register(payload).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('/api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockUser);
  });

  it('should authenticate a user, set signals, and store credentials on login', () => {
    service = TestBed.inject(AuthService);
    const mockUser: User = { id: '123', name: 'John Doe', email: 'john@example.com', role: 'user' };
    const mockResponse: AuthResponse = { token: 'mock-jwt-token', user: mockUser };
    const credentials = { email: 'john@example.com', password: 'Password123' };

    service.login(credentials).subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(service.currentUser()).toEqual(mockUser);
      expect(service.isAuthenticated()).toBe(true);
      expect(service.isAdmin()).toBe(false);
      expect(document.cookie).toContain('auth_token=mock-jwt-token');
      expect(localStorage.getItem('auth_user')).toContain('John Doe');
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(mockResponse);
  });

  it('should clear signals and storage on logout', () => {
    // Manually set initial session
    document.cookie = 'auth_token=token-123; path=/; SameSite=Lax';
    localStorage.setItem('auth_user', JSON.stringify({ id: '1', name: 'Admin', email: 'admin@apex.com', role: 'admin' }));
    
    /* 
     * Choice justification:
     * We must inject the AuthService *after* populating local storage.
     * This forces the singleton's construction to occur under the context of an already active session,
     * verifying that it restores authentication state on launch.
     */
    service = TestBed.inject(AuthService);

    expect(service.isAuthenticated()).toBe(true);
    expect(service.isAdmin()).toBe(true);

    service.logout();

    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.isAdmin()).toBe(false);
    expect(document.cookie).not.toContain('auth_token=token-123');
  });
});
