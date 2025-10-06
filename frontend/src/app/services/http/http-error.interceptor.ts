import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AuthenticationService} from '../authentification/services/authentication.service';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      // If a request fails retry up to 2 times
      // retry(2),
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          // Local thrown error
          console.error(`HttpClient threw an Error Event: ${error}`);
        } else {
          // Error returned by the backend
          // Provide a proper error handling for known errors
          switch (error.status) {
            // 400 Bad Request
            case 400:
              console.error('Bad Request');
              break;
            // 401 Unauthorized
            case 401:
              console.error('Unauthorized');
              if (this.authenticationService.getCurrentToken) {
                this.authenticationService.logout();
                this.router.navigateByUrl('/');
                window.location.reload();
              }
              break;
            // 403 Forbidden
            case 403:
              console.error('Forbidden');
              break;
            default:
              console.error(`BackEnd threw an Error: ${error.status} ${error.statusText}`);
              break;
          }
        }
        // rethrowing the error to be handeled by the subscriber or the error handler
        return throwError(error);
      }),
    );
  }
}
