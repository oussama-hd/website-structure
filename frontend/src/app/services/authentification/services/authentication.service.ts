import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Token } from '../models/token';
import { FormGroup } from '@angular/forms';
import { Encryption } from '../utils/Encryption';

import { interval, Subscription } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { OTP_ACCESS_TOKEN } from '../../../shared/utils/constans';
export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
};
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private url : string = "";
  public userState = new BehaviorSubject<any | null>(null);

  public newProfileStreamSubject = new BehaviorSubject<string>('');
  public newProfileStream = this.newProfileStreamSubject.asObservable();

  private user: any = {} as any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {


    // if (isPlatformBrowser(this.platformId)) {
    //   this.currentTokenSubject = new BehaviorSubject<Token>(
    //     JSON.parse(localStorage.getItem('accessToken'))
    //   );
    // } else {
    //   this.currentTokenSubject = new BehaviorSubject<Token>(null);
    // }
  }

  login(credentials: { username: string; password: string }) {
    return this.http.post<any>(`${this.url}/user/sign-in`, credentials);
  }

  public currentToken(): any {
    return localStorage.getItem('accessToken');
  }

  register(formData: FormGroup) {
    let enCryptPassword = Encryption.encryptText(formData.value['password']);
    formData.value['password'] = enCryptPassword;
    formData.value['confirmPassword'] = enCryptPassword;
    return this.http.post<any>(`${this.url}/user/sign-up`, formData.value);
  }

  // updatePassword(formData: FormGroup) {
  //   return this.http.post<any>(`${this.url}/user/change-confirm-password`, formData.value);
  // }

  updatePassword(data: {
    oldPassword: string;
    newPassword: string;
  }): Observable<any> {
    return this.http.post<any>(
      `${this.url}/user/change-confirm-password`,
      data
    );
  }

  setSession(token: string) {
    if (token !== null) {
      localStorage.removeItem('accessToken');
      localStorage.setItem('accessToken', token);
    }
  }

  _refreshToken(requestBody: any) {
    return this.http.post<any>(`${this.url}/user/refresh-token`, requestBody);
  }

  authenticated(): boolean {
    return localStorage.getItem('accessToken') != null;
  }

  public isLoggedIn() {
    return null
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  saveOtpToken(token: string) {
    if (token !== null) {
      localStorage.removeItem(OTP_ACCESS_TOKEN);
      localStorage.setItem(OTP_ACCESS_TOKEN, token);
    }
  }

  // getExpiration() {
  //   const currentTimeMillis = new Date().getMilliseconds();
  //   return new Date(currentTimeMillis + (this.currentUser().exp * 1000));
  // }

  getExpiration() {
    const expiration = this.currentUser()?.exp;
    if (!expiration) return new Date(0);
    return new Date(expiration * 1000);
  }

  public currentUser(): User | null {
    
    return null;
  }



  logout() {
  
  }

  logout2(): void {
   
  }

  // --------------------*******************************************************-----------------------------------
  // ********************-------------------------------------------------------***********************************
  private refreshInProgress = false;
  private tokenMonitorStarted = false;
  private tokenMonitorSubscription?: Subscription;

  getTokenExpiration(token: string): number {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp;
    } catch (e) {
      console.error('Failed to parse token expiration:', e);
      return 0;
    }
  }


  stopTokenMonitor(): void {
    this.tokenMonitorSubscription?.unsubscribe();
    this.tokenMonitorStarted = false;
  }
}
