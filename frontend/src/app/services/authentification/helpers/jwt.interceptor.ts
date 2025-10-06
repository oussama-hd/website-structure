import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem("accessToken");

    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned);
    }
    
    return next.handle(req);
  }
}


// import { HttpInterceptorFn } from '@angular/common/http';
// import { ACCESS_TOKEN } from '../../../core/helpers/utils/app.constans';

// export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
//   const token = localStorage.getItem(ACCESS_TOKEN);

//   if (token) {
//     const cloned = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     return next(cloned);
//   }
//   return next(req);
// };


// *************************************************************************************************
// *************************************************************************************************

// import { inject } from '@angular/core';
// import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
// import { BehaviorSubject, Observable, throwError } from 'rxjs';
// import { catchError, filter, switchMap, take } from 'rxjs/operators';
// import { ACCESS_TOKEN } from '../../../core/helpers/utils/app.constans';
// import { TokenStorageService } from '../services/token.service';
// import { AuthenticationService } from '../services/authentication.service';
// import { Encryption } from '../utils/Encryption';


// let isRefreshing = false;
// const refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

// export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
//   const tokenService = inject(TokenStorageService);
//   const authService = inject(AuthenticationService);

//   const token = localStorage.getItem(ACCESS_TOKEN);
//   let authReq = req;

//   if (token != null) {
//     authReq = addTokenHeader(req, token);
//   }

//   return next(authReq).pipe(
//     catchError(error => {
//       if (error instanceof HttpErrorResponse && !authReq.url.includes('login') && error.status === 401) {
//         return handle401Error(authReq, next, tokenService, authService);
//       }

//       return throwError(() => error);
//     })
//   );
// };


// function handle401Error(
//   request: HttpRequest<any>,
//   next: HttpHandlerFn,
//   tokenService: TokenStorageService,
//   authService: AuthenticationService
// ): Observable<HttpEvent<any>> {
//   if (!isRefreshing) {
//     isRefreshing = true;
//     refreshTokenSubject.next(null);
//     const accessToken = localStorage.getItem(ACCESS_TOKEN);
//     const currentUser = authService.currentUser();
//     // const refreshToken = tokenService.getRefreshToken();
//     const requestBody = {
//       userId: Encryption.encryptText(currentUser.usrId),
//       accessToken: Encryption.encryptText(accessToken)
//     };

//     if (accessToken) {
//       return authService._refreshToken(requestBody).pipe(
//         switchMap((token: any) => {
//           isRefreshing = false;
//           tokenService.saveToken(token.accessToken);
//           refreshTokenSubject.next(token.accessToken);
//           return next(addTokenHeader(request, token.accessToken));
//         }),
//         catchError(err => {
//           isRefreshing = false;
//           tokenService.signOut();
//           return throwError(() => err);
//         })
//       );
//     }
//   }

//   return refreshTokenSubject.pipe(
//     filter(token => token !== null),
//     take(1),
//     switchMap(token => next(addTokenHeader(request, token)))
//   );
// }

// function addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
//   return request.clone({
//     headers: request.headers.set(ACCESS_TOKEN, token)
//   });
// }


// ------**********************************---------------------**********************************---------------
// import { Injectable } from '@angular/core';
// import {
//   HttpEvent,
//   HttpHandler,
//   HttpInterceptor,
//   HttpRequest
// } from '@angular/common/http';
// import { Observable, BehaviorSubject, throwError } from 'rxjs';
// import { catchError, filter, switchMap, take } from 'rxjs/operators';

// import { TokenStorageService } from '../services/token.service';
// import { AuthenticationService } from '../services/authentication.service';
// import { Encryption } from '../utils/Encryption';
// import { jwtDecode } from 'jwt-decode';

// const TOKEN_HEADER_KEY = 'Authorization';
// const REFRESH_THRESHOLD_MS = 60 * 1000; 

// export function decodeJwt(token: string): any {
//   try {
//     return jwtDecode(token);
//   } catch (e) {
//     return null;
//   }
// }


// @Injectable()
// export class JwtInterceptor implements HttpInterceptor {
//   private isRefreshing = false;
//   private refreshTokenSubject = new BehaviorSubject<string | null>(null);

//   constructor(
//     private tokenService: TokenStorageService,
//     private authService: AuthenticationService
//   ) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const accessToken = this.tokenService.getToken();

//     if (!accessToken) {
//       console.log("**************************************** 11111")
//       return next.handle(req);
//     }

//     const remainingTime = this.getRemainingTime(accessToken);
//     console.log("**************************************** 22222")

//     if (remainingTime < REFRESH_THRESHOLD_MS) {
//       console.log("**************************************** 333333")

//       return this.tryRefreshToken().pipe(
//         switchMap((newToken) => {
//           const authReq = this.addTokenHeader(req, newToken);
//           return next.handle(authReq);
//         }),
//         catchError(() => {
//           return next.handle(req);
//         })
//       );
//     }

//     const authReq = this.addTokenHeader(req, accessToken);
//     return next.handle(authReq);
//   }

//   private tryRefreshToken(): Observable<string> {
//     if (this.isRefreshing) {
//       return this.refreshTokenSubject.pipe(
//         filter(token => token !== null),
//         take(1)
//       );
//     }

//     this.isRefreshing = true;
//     this.refreshTokenSubject.next(null);

//     const accessToken = this.tokenService.getToken();
//     const refreshToken = this.tokenService.getRefreshToken();
//     const currentUser = this.authService.currentUser();

//     if (!refreshToken || !currentUser) {
//       this.isRefreshing = false;
//       return throwError(() => new Error('Missing refresh token or user'));
//     }

//     const requestBody = {
//       userId: Encryption.encryptText(currentUser.usrId),
//       refreshToken: Encryption.encryptText(refreshToken)
//     };

//     return this.authService._refreshToken(requestBody).pipe(
//       switchMap((res: any) => {
//         const newToken = res.accessToken;
//         const newRefreshToken = res.refreshToken;

//         this.tokenService.saveToken(newToken);
//         this.tokenService.saveRefreshToken(newRefreshToken);

//         this.isRefreshing = false;
//         this.refreshTokenSubject.next(newToken);
//         return this.refreshTokenSubject.pipe(take(1));
//       }),
//       catchError(err => {
//         this.isRefreshing = false;
//         this.tokenService.signOut();
//         return throwError(err);
//       })
//     );
//   }

//   private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
//     return request.clone({
//       headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token)
//     });
//   }

//   private getRemainingTime(token: string): number {
//     const decoded = decodeJwt(token);
//     if (!decoded?.exp) return 0;
//     const exp = decoded.exp * 1000; // en ms
//     return exp - Date.now();
//   }
// }



// *************************************************************************************************
// *************************************************************************************************

// import { Injectable } from '@angular/core';
// import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
// import { Observable } from 'rxjs';

// import { AuthenticationService } from '../services/authentication.service';
// import { Encryption } from '../utils/Encryption';

// @Injectable()
// export class JwtInterceptor implements HttpInterceptor {
//   constructor(private authenticationService: AuthenticationService) {}

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const currentToken = this.authenticationService.getCurrentToken;
//     const timestamp = new Date().getTime();
//     const customHeaderValue = `API-CIAR-BLINK/*D/F/DG-**AAAA#${timestamp*1000}`;

//     let headersConfig: any = {
//       'X-API-KEY': Encryption.encryptText(customHeaderValue)
//     };

//     if (currentToken && currentToken.accessToken) {
//       headersConfig['Authorization'] = `Bearer ${currentToken.accessToken}`;
//     }

//     request = request.clone({
//       setHeaders: headersConfig
//     });

//     return next.handle(request);
//   }
// }

