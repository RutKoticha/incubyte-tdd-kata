import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { delay, of, throwError } from 'rxjs';

/**
 * Interface representing user account format in the mock database.
 */
interface MockUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
}

/**
 * Functional HTTP Interceptor that mocks the backend endpoints for authentication.
 * Uses localStorage to persist database state in the browser.
 */
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  /*
   * Choice justification:
   * To ensure backend-less execution during development/testing, we intercept all calls 
   * starting with '/api/auth/'. If it doesn't match, we forward it to the next handler.
   */
  if (!req.url.startsWith('/api/auth/')) {
    return next(req);
  }

  // Ensure mock users exist in localStorage (Browser environment only)
  let users: MockUser[] = [];
  const isBrowser = typeof window !== 'undefined';
  if (isBrowser) {
    const storedUsers = localStorage.getItem('mock_users');
    if (storedUsers) {
      try {
        users = JSON.parse(storedUsers);
      } catch {
        users = [];
      }
    }

    /*
     * Choice justification:
     * Pre-populate database with default admin/user records to facilitate immediate testing.
     */
    if (users.length === 0) {
      users = [
        {
          id: '1',
          name: 'Default Admin',
          email: 'admin@apex.com',
          password: 'Password123',
          role: 'admin'
        },
        {
          id: '2',
          name: 'Default User',
          email: 'user@apex.com',
          password: 'Password123',
          role: 'user'
        }
      ];
      localStorage.setItem('mock_users', JSON.stringify(users));
    }
  }

  const { method, url } = req;
  const body = req.body as any;

  // Handle POST /api/auth/register
  if (method === 'POST' && url.endsWith('/register')) {
    const existing = users.find(u => u.email === body.email);
    if (existing) {
      return throwError(() => new HttpErrorResponse({
        status: 400,
        error: { message: 'Email is already registered' },
        url: req.url
      })).pipe(delay(500));
    }

    const newUser: MockUser = {
      id: Math.random().toString(36).substring(2, 9),
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role || 'user'
    };

    users.push(newUser);
    if (isBrowser) {
      localStorage.setItem('mock_users', JSON.stringify(users));
    }

    // Return the created user profile (excluding the password for security)
    const responseUser: MockUser = { ...newUser };
    delete responseUser.password;

    return of(new HttpResponse({
      status: 201,
      body: responseUser
    })).pipe(delay(500));
  }

  // Handle POST /api/auth/login
  if (method === 'POST' && url.endsWith('/login')) {
    const user = users.find(u => u.email === body.email && u.password === body.password);
    if (!user) {
      return throwError(() => new HttpErrorResponse({
        status: 401,
        error: { message: 'Invalid email or password' },
        url: req.url
      })).pipe(delay(500));
    }

    const responseUser: MockUser = { ...user };
    delete responseUser.password;

    const token = 'mock-jwt-token-' + Math.random().toString(36).substring(2, 15);

    return of(new HttpResponse({
      status: 200,
      body: { token, user: responseUser }
    })).pipe(delay(500));
  }

  return next(req);
};
