import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EcommerceService } from '../../core/services/ecommerce';
import { Product } from '../../core/interfaces/product';
import { CartService } from '../../core/services/cart'; // <-- Import CartService

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  private readonly _ecommerceService = inject(EcommerceService);
  private readonly _cartService = inject(CartService); // <-- Inject CartService
  private readonly _cdr = inject(ChangeDetectorRef);

  productsList: Product[] = [];
  isLoading: boolean = true;
  hasError: boolean = false;

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.isLoading = true;
    this.hasError = false;

    this._ecommerceService.getProducts().subscribe({
      next: (res: any) => {
        console.log('Products API Response:', res);
        this.productsList = res?.data ? res.data : res;
        this.isLoading = false;

        // Force Angular to update DOM instantly and dismiss spinner cleanly
        this._cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error fetching products:', err);
        this.isLoading = false;
        this.hasError = true;
        this._cdr.detectChanges();
      }
    });
  }

 addToCart(productId: string): void {
    if (!productId) return;

    this._cartService.addToCart(productId).subscribe({
      next: (res) => {
        console.log('Cart Response:', res);
        // Success response from API (e.g., res.message: "Product added successfully to your cart")
        alert(res.message || 'Product added to cart successfully!');
      },
      error: (err) => {
        console.error('Error adding product to cart:', err);
        alert('Failed to add product to cart. Please check if you are logged in.');
      }
    });
  }
}
