import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, map, tap } from 'rxjs';
import { AuthResponse, User } from '../../shared/models/user.model';

/**
 * Service to manage user authentication state, token storage, and session lifecycle.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** Angular HTTP client. */
  private readonly http = inject(HttpClient);
  /** Angular platform ID to detect server vs browser runtime. */
  private readonly platformId = inject(PLATFORM_ID);

  /** Active user profile signal. Contains null if unauthenticated. */
  readonly currentUser = signal<User | null>(null);

  /** Checks if the user is currently authenticated. */
  readonly isAuthenticated = signal<boolean>(false);

  /** Checks if the authenticated user has Admin role permissions. */
  readonly isAdmin = signal<boolean>(false);

  /**
   * Initializes the authentication service.
   * Restores user session if token exists.
   */
  constructor() {
    /* 
     * Choice justification:
     * When using SSR (Server-Side Rendering), window and localStorage are not available on the server.
     * We must check whether we are running in the browser environment before attempting to read storage
     * to avoid ReferenceErrors during server build or SSR execution.
     */
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getCookie('auth_token');
      const userJson = localStorage.getItem('auth_user');
      if (token && userJson) {
        try {
          const user: User = JSON.parse(userJson);
          this.currentUser.set(user);
          this.isAuthenticated.set(true);
          this.isAdmin.set(user.role === 'admin');
        } catch {
          this.clearSession();
        }
      }
    }
  }

  /**
   * Registers a new user.
   * @param payload User registration payload containing credentials.
   * @returns Observable of the HTTP registration request.
   */
  register(payload: any): Observable<User> {
    return this.http.post<any>('/api/auth/register', payload).pipe(
      map(res => {
        if (res && res.data) {
          const u = res.data;
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role ? u.role.toLowerCase() : 'user'
          } as User;
        }
        return res;
      })
    );
  }

  /**
   * Authenticates a user and starts a new session.
   * @param credentials User email and password.
   * @returns Observable of the HTTP login request.
   */
  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<any>('/api/auth/login', credentials).pipe(
      map(res => {
        if (res && res.data && res.data.token) {
          const data = res.data;
          return {
            token: data.token,
            user: {
              id: data.userData.id,
              name: data.userData.name,
              email: data.userData.email,
              role: data.userData.role ? data.userData.role.toLowerCase() : 'user'
            }
          } as AuthResponse;
        }
        if (res && res.user) {
          return {
            token: res.token,
            user: {
              ...res.user,
              role: res.user.role ? res.user.role.toLowerCase() : 'user'
            }
          } as AuthResponse;
        }
        return res;
      }),
      tap(res => {
        /*
         * Choice justification:
         * We store the session details locally in the browser to maintain persistent login state across reloads.
         * The state is stored if and only if we are executing on the client side (browser).
         */
        if (isPlatformBrowser(this.platformId)) {
          this.setCookie('auth_token', res.token);
          localStorage.setItem('auth_user', JSON.stringify(res.user));
        }
        this.currentUser.set(res.user);
        this.isAuthenticated.set(true);
        this.isAdmin.set(res.user.role === 'admin');
      })
    );
  }

  /**
   * Terminates the current user session and clears credentials.
   */
  logout(): void {
    this.clearSession();
  }

  /**
   * Cleans up local session variables and resets signals.
   */
  private clearSession(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.deleteCookie('auth_token');
      localStorage.removeItem('auth_user');
    }
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.isAdmin.set(false);
  }

  /**
   * Returns the stored token.
   * @returns JWT token string or null.
   */
  getToken(): string | null {
    return this.getCookie('auth_token');
  }

  /**
   * Sets a cookie with a given name, value, and expiration days.
   */
  private setCookie(name: string, value: string, days = 7): void {
    if (isPlatformBrowser(this.platformId)) {
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
    }
  }

  /**
   * Retrieves a cookie value by name.
   */
  private getCookie(name: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      if (match) return match[2];
    }
    return null;
  }

  /**
   * Deletes a cookie by name.
   */
  private deleteCookie(name: string): void {
    if (isPlatformBrowser(this.platformId)) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
    }
  }
}
