import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

/**
 * Dashboard homepage for viewing and interacting with the vehicle inventory.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="m3-dashboard-shell">
      <nav class="m3-navbar">
        <span class="m3-nav-brand">BMW</span>
        <div class="m3-nav-actions">
          <span class="m3-user-badge">{{ authService.currentUser()?.name }} ({{ authService.currentUser()?.role }})</span>
          <button (click)="logout()" class="m3-btn-small">Logout</button>
        </div>
      </nav>
      <main class="m3-dashboard-content">
        <h1>Dashboard</h1>
        <p>Welcome to the Car Dealership Inventory System dashboard. More features coming soon!</p>
      </main>
    </div>
  `,
  styles: [`
    .m3-dashboard-shell {
      min-height: 100vh;
      background-color: var(--m3-background);
      color: var(--m3-on-background);
    }
    .m3-navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px;
      padding: 0 24px;
      background-color: var(--m3-surface);
      border-bottom: 1px solid var(--m3-outline-variant);
    }
    .m3-nav-brand {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 1px;
      color: var(--m3-primary);
    }
    .m3-nav-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .m3-user-badge {
      font-size: 14px;
      color: var(--ctp-subtext1);
    }
    .m3-btn-small {
      background-color: var(--ctp-surface2);
      color: var(--ctp-text);
      border: none;
      padding: 6px 16px;
      border-radius: 100px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: background-color 0.2s ease;
    }
    .m3-btn-small:hover {
      background-color: var(--ctp-overlay0);
    }
    .m3-dashboard-content {
      padding: 40px 24px;
    }
    .m3-dashboard-content h1 {
      font-size: 32px;
      font-weight: 500;
      margin-bottom: 16px;
    }
    .m3-dashboard-content p {
      color: var(--ctp-subtext1);
    }
  `]
})
export class DashboardComponent {
  /** Authentication Service. */
  readonly authService = inject(AuthService);
  /** Angular Router. */
  private readonly router = inject(Router);

  /**
   * Logs out the current user session and redirects to the login screen.
   */
  logout(): void {
    /* 
     * Choice justification:
     * When logging out, we clear the session through the AuthService first, 
     * then navigate back to the login path to prevent route access.
     */
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
