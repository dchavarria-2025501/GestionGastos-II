import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Uso en rutas: canActivate: [roleGuard('admin')]
export function roleGuard(rolRequerido: 'admin' | 'user'): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
    }

    if (!auth.hasRole(rolRequerido)) {
      router.navigate(['/dashboard']);
      return false;
    }

    return true;
  };
}
