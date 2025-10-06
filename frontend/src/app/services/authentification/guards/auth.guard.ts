import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Encryption } from '../utils/Encryption';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';


export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  const token = localStorage.getItem("accessToken");
  const remindMe = JSON.parse(localStorage.getItem("Remind-me") || 'false');
  const currentUser = authService.currentUser();

  // Si token présent et valide
  if (authService.isLoggedIn()) {
    return true;
  }

  if (remindMe && token && currentUser && navigator.onLine) {
    const body = {
      userId: Encryption.encryptText(currentUser.usrId),
      accessToken: Encryption.encryptText(token)
    };

    return from(authService._refreshToken(body)).pipe(
      map((res: any) => {
        authService.setSession(res.data.refreshToken);
        return true;
      }),
      catchError(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("Remind");
        router.navigate(['/login'], {
          queryParams: { returnUrl: state.url }
        });
        return of(false);
      })
    );
  }

  // Sinon, rediriger
  localStorage.removeItem("accessToken");
  localStorage.removeItem("Remind");
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};