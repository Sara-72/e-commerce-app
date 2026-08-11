import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Orders{
  private readonly _httpClient = inject(HttpClient);

  // Base URLs for FreshCart API
  private readonly cashUrl = 'https://ecommerce.routemisr.com/api/v1/orders';
  private readonly checkoutSessionUrl = 'https://ecommerce.routemisr.com/api/v1/orders/checkout-session';

  // Online Payment (Card) - Returns a session URL to redirect the user
  checkOutSession(cartId: string, shippingAddress: object): Observable<any> {
    const returnUrl = window.location.origin; // e.g. http://localhost:4200
    return this._httpClient.post(
      `${this.checkoutSessionUrl}/${cartId}?url=${returnUrl}`,
      { shippingAddress }
    );
  }

  // Cash on Delivery Payment
  createCashOrder(cartId: string, shippingAddress: object): Observable<any> {
    return this._httpClient.post(
      `${this.cashUrl}/${cartId}`,
      { shippingAddress }
    );
  }
}
