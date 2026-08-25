import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SessionService } from '../services/session.service';

const CODIGOS_TOKEN_INVALIDO = ['TOKEN_EXPIRED', 'TOKEN_INVALID', 'TOKEN_MISSING'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const session = inject(SessionService);
  const token = auth.getToken();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const codigo = error.error?.code;
      const esSesionInvalida = error.status === 401 && CODIGOS_TOKEN_INVALIDO.includes(codigo);

      if (esSesionInvalida && auth.isLoggedIn()) {
        auth.limpiarPorExpiracion();
        session.expirarPorToken();
      }

      return throwError(() => error);
    })
  );
};
