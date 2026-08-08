import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly _httpClient = inject(HttpClient);
  private readonly baseUrl: string = 'https://ecommerce.routemisr.com/api/v1/cart';

  // Reactive state for cart items count
  cartNumber: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  // Add Product To Cart
  addToCart(productId: string): Observable<any> {
    return this._httpClient.post(this.baseUrl, { productId }).pipe(
      tap((res: any) => {
        if (res?.numOfCartItems !== undefined) {
          this.cartNumber.next(res.numOfCartItems);
        }
      })
    );
  }

  // Get Current Cart Details (Populates initial badge count)
  getLoggedUserCart(): Observable<any> {
    return this._httpClient.get(this.baseUrl).pipe(
      tap((res: any) => {
        if (res?.numOfCartItems !== undefined) {
          this.cartNumber.next(res.numOfCartItems);
        }
      })
    );
  }

  // Remove Item From Cart
  removeCartItem(productId: string): Observable<any> {
    return this._httpClient.delete(`${this.baseUrl}/${productId}`).pipe(
      tap((res: any) => {
        if (res?.numOfCartItems !== undefined) {
          this.cartNumber.next(res.numOfCartItems);
        }
      })
    );
  }

  // Update Product Count
  updateProductCount(productId: string, count: number): Observable<any> {
    return this._httpClient.put(`${this.baseUrl}/${productId}`, { count }).pipe(
      tap((res: any) => {
        if (res?.numOfCartItems !== undefined) {
          this.cartNumber.next(res.numOfCartItems);
        }
      })
    );
  }

  // Clear Entire Cart
  clearCart(): Observable<any> {
    return this._httpClient.delete(this.baseUrl).pipe(
      tap(() => {
        this.cartNumber.next(0);
      })
    );
  }
}
