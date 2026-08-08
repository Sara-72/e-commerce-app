import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Category, Brand } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class EcommerceService {
  private _httpClient = inject(HttpClient);
  private baseUrl = 'https://ecommerce.routemisr.com/api/v1';
  // Products API
  getProducts(): Observable<{ data: Product[] }> {
    return this._httpClient.get<{ data: Product[] }>(`${this.baseUrl}/products`);
  }

  // Categories API
  getCategories(): Observable<{ data: Category[] }> {
    return this._httpClient.get<{ data: Category[] }>(`${this.baseUrl}/categories`);
  }

  // Brands API
  getBrands(): Observable<{ data: Brand[] }> {
    return this._httpClient.get<{ data: Brand[] }>(`${this.baseUrl}/brands`);
  }
  
  getSpecificProduct(id: string): Observable<any> {
    return this._httpClient.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
  }
}
