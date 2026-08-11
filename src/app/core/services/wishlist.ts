import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Wishlist {
  private readonly _httpClient = inject(HttpClient);
  private readonly baseUrl: string = 'https://ecommerce.routemisr.com/api/v1/wishlist';


  wishlistNumber: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  // Get user wishlist
 getLoggedUserWishlist(): Observable<any> {
  return this._httpClient.get(this.baseUrl).pipe(
    tap((res: any) => {
      if (res?.data) {
        this.wishlistNumber.next(res.data.length);
      }
    })
  );
}

  // Add product to wishlist
  addToWishlist(productId: string): Observable<any> {
    return this._httpClient.post(this.baseUrl, { productId });
  }

  // Remove product from wishlist
  removeFromWishlist(productId: string): Observable<any> {
    return this._httpClient.delete(`${this.baseUrl}/${productId}`);
  }
}
