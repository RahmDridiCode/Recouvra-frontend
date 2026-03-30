import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Read token directly from localStorage to avoid circular dependency
  const token = localStorage.getItem('recouvra_token');

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(authReq).pipe(
    catchError(err => {
      // Only auto-redirect on 401 if it's NOT the login request itself
      if (err.status === 401 && !req.url.includes('/auth/login')) {
        localStorage.removeItem('recouvra_token');
        localStorage.removeItem('recouvra_user');
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};

