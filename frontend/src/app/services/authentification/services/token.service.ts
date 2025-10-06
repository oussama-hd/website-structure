import { Injectable } from '@angular/core';

const REFRESHTOKEN_KEY = 'auth-refreshtoken';
const USER_KEY = 'auth-user';

export interface JwtPayload {
  exp: number; 
  iat?: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})

export class TokenStorageService {
  constructor() { }

  signOut(): void {
    window.localStorage.clear();
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem("accessToken");
    window.localStorage.setItem("accessToken", token);

    const user = this.getUser();
    if (user.id) {
      this.saveUser({ ...user, accessToken: token });
    }
  }

  public getToken(): string | null {
    return window.localStorage.getItem("accessToken");
  }

  public saveRefreshToken(token: string): void {
    window.localStorage.removeItem(REFRESHTOKEN_KEY);
    window.localStorage.setItem(REFRESHTOKEN_KEY, token);
  }

  public getRefreshToken(): string | null {
    return window.localStorage.getItem(REFRESHTOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }


  // getTokenExpirationDate(token: string): Date | null {
  //   try {
  //     const decoded = jwtDecode.default<JwtPayload>(token);
  //     if (!decoded.exp) return null;
  
  //     const expirationDate = new Date(0);
  //     expirationDate.setUTCSeconds(decoded.exp);
  //     return expirationDate;
  //   } catch (e) {
  //     return null;
  //   }
  // }

isTokenExpired(token: string) {
  // const expirationDate = this.getTokenExpirationDate(token);
  // if (!expirationDate) return true;

  // return expirationDate.getTime() < Date.now();
}

getRemainingTime(token: string) {
  // const expirationDate = this.getTokenExpirationDate(token);
  // if (!expirationDate) return 0;
  // return expirationDate.getTime() - Date.now(); 
}
}


