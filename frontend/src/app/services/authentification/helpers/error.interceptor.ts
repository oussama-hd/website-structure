import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Encryption } from '../utils/Encryption';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshAttempted = false;

  constructor(private authService: AuthenticationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem("accessToken");
    const remindMe = JSON.parse(localStorage.getItem("Remin") || 'false');
    const currentUser = this.authService.currentUser();

    if (accessToken ) {
      console.log('[Interceptor] Token expired (local check). Logging out without sending request.');
      // this.clearSession();
      // return throwError(() => new Error('Token expired. Please log in again.'));
    }
    
    return next.handle(req).pipe(

      tap((event) => {
        if (event instanceof HttpResponse) {
          console.log('[Interceptor] Response received from:', req.url, 'Status:', event.status);
        }
      }),
      catchError((err: HttpErrorResponse) => {
        console.log('[Interceptor] Caught error:', err.status, 'URL:', req.url);

        if (!navigator.onLine) {
          return throwError(() => new Error('You are offline. Please check your internet connection.'));
        }

        if (err.status === 403 && accessToken && currentUser && !this.refreshAttempted) {
          this.refreshAttempted = true;
          console.log('[Interceptor] Token expired - attempting refresh');

          const requestBody = {
            userId: Encryption.encryptText(currentUser.usrId),
            accessToken: Encryption.encryptText(accessToken)
          };

          if ((remindMe || navigator.onLine) && !this.isRefreshing) {
            this.isRefreshing = true;

            return this.authService._refreshToken(requestBody).pipe(
              switchMap((data: any) => {
                this.isRefreshing = false;
                this.refreshAttempted = false;

                const newToken = data?.data?.refreshToken;
                if (newToken) {
                  this.authService.setSession(newToken);

                  const clonedRequest = req.clone({
                    setHeaders: {
                      Authorization: `Bearer ${newToken}`
                    }
                  });

                  return next.handle(clonedRequest);
                } else {
                  this.clearSession();
                  return throwError(() => new Error('Token refresh failed: no token returned'));
                }
              }),
              catchError((refreshErr) => {
                this.isRefreshing = false;
                this.refreshAttempted = false;
                this.clearSession();
                console.error('[Interceptor] Refresh token failed:', refreshErr);
                return throwError(() => new Error('Session expired. Please log in again.'));
              })
            );
          } else {
            this.clearSession();
          }
        }

        return throwError(() => err.error?.message || err.statusText);
      })
    );
  }

  private clearSession() {
    console.log('[Interceptor] Clearing session and logging out');
    localStorage.removeItem("accessToken");
    // localStorage.removeItem(REMIND_ME);
    // Optionnel : appel à authService.logout()
    // this.authService.logout();
  }
}
