import { Injectable, inject ,signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignupData, SigninData, AuthResponse } from '../interfaces/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _httpClient = inject(HttpClient);
  private baseUrl = 'https://ecommerce.routemisr.com/api/v1/auth';


  private readonly _router = inject(Router);

  // Track authentication status reactively using Signals
  isLoggedIn = signal<boolean>(this.hasToken());

  private hasToken(): boolean {
    return !!localStorage.getItem('userToken');
  }

  // Call this method after a successful API login
  saveToken(token: string): void {
    localStorage.setItem('userToken', token);
    this.isLoggedIn.set(true);
  }

  logout(): void {
    localStorage.removeItem('userToken');
    this.isLoggedIn.set(false);
    this._router.navigate(['/login']);
  }

  register(data: SignupData): Observable<AuthResponse> {
    return this._httpClient.post<AuthResponse>(`${this.baseUrl}/signup`, data);
  }

  login(data: SigninData): Observable<AuthResponse> {
    return this._httpClient.post<AuthResponse>(`${this.baseUrl}/signin`, data);
  }
}
