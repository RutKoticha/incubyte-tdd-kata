import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Functional guard that prevents unauthenticated access to protected routes.
 * Redirects the user to the login screen if they are not logged in.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  /*
   * Choice justification:
   * Class-based guards are deprecated in modern Angular.
   * We use a functional guard with the inject API which keeps the routing configuration cleaner
   * and simplifies dependency injection without needing boilerplates.
   */
  return router.createUrlTree(['/login']);
};
