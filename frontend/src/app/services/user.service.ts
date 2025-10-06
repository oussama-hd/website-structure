import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })

  export class UserService {
    private apiUrl = 'http://localhost:5000/users'; 
  
    constructor(private http: HttpClient) {}

    addUser(userData: any): Observable<any> {
      return this.http.post(this.apiUrl, userData);
    }
  }
  