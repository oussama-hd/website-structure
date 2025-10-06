import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { APP_CONFIG, AppConfig } from '../../config';
import { ACCESS_TOKEN, OTP_ACCESS_TOKEN } from '../../../shared/utils/constans';

@Injectable({
  providedIn: 'root',
})
@Injectable({ providedIn: 'root' })
export class OtpService {
  private url: string;
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) config: AppConfig
  ) {
    this.url = config.apiEndpoint;
  }


  checkOtp(formData: FormGroup) {
    const headers = new HttpHeaders({Authorization: 'Bearer ' +  this.currentOtpToken()})
    return this.http.post<any>(`${this.url}/user/check-otp`,
      formData.value, {headers});
  }
  
  resendOtp() {
    const headers = new HttpHeaders({Authorization: 'Bearer ' + this.currentOtpToken()})
    return this.http.post<any>(`${this.url}/user/resend-otp`,
      null, {headers});
  }

  public currentToken(): any {
    return localStorage.getItem(ACCESS_TOKEN);
  }
  
  public currentOtpToken(): any {
    return localStorage.getItem(OTP_ACCESS_TOKEN);
  }

}
