import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EcommerceService } from '../../core/services/ecommerce';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, Category } from '../../core/interfaces/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
 private _ecommerceService = inject(EcommerceService);

  productsList: Product[] = [];
  categoriesList: Category[] = [];

  ngOnInit(): void {
    // Categories API
    this._ecommerceService.getCategories().subscribe({
      next: (res) => {
        console.log('Categories data:', res.data); // Verify data array in F12 console
        this.categoriesList = res.data;
      },
      error: (err) => console.error(err)
    });

    // Products API
    this._ecommerceService.getProducts().subscribe({
      next: (res) => {
        console.log('Products data:', res.data); // Verify data array in F12 console
        this.productsList = res.data;
      },
      error: (err) => console.error(err)
    });
  }

  categories$: Observable<Category[]> = this._ecommerceService.getCategories().pipe(
    map(res => res.data)
  );

  products$: Observable<Product[]> = this._ecommerceService.getProducts().pipe(
    map(res => res.data)
  );
}
