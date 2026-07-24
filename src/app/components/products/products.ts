import { Component ,inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EcommerceService } from '../../core/services/ecommerce';
import { Product } from '../../core/interfaces/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})

export class Products  {
 private _ecommerceService = inject(EcommerceService);

  products$: Observable<Product[]> = this._ecommerceService.getProducts().pipe(
    map(res => res.data)
  );
}
