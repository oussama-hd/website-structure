import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private apiUrl = 'http://localhost:5000/users';

  constructor(private http: HttpClient) {}

  addUser(userData: any, files: { diplomas?: File[], certificates?: File[] } = {}): Observable<any> {
    const formData = new FormData();

    for (const key in userData) {
      if (userData[key] !== undefined && userData[key] !== null) {
        formData.append(key, userData[key]);
      }
    }

    if (files.diplomas && files.diplomas.length > 0) {
      files.diplomas.forEach(file => {
        formData.append('AUS_DIPLOMAS', file);
      });
    }

    if (files.certificates && files.certificates.length > 0) {
      files.certificates.forEach(file => {
        formData.append('AUS_CERTIFICATES', file);
      });
    }

    return this.http.post(this.apiUrl, formData);
  }
}
