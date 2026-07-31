import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignupData, SigninData, AuthResponse } from '../interfaces/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _httpClient = inject(HttpClient);
  private baseUrl = 'https://ecommerce.routemisr.com/api/v1/auth';

  register(data: SignupData): Observable<AuthResponse> {
    return this._httpClient.post<AuthResponse>(`${this.baseUrl}/signup`, data);
  }

  login(data: SigninData): Observable<AuthResponse> {
    return this._httpClient.post<AuthResponse>(`${this.baseUrl}/signin`, data);
  }
}
