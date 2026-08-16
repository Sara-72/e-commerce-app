import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EcommerceService } from '../../core/services/ecommerce';
import { Product } from '../../core/interfaces/product';
import { CartService } from '../../core/services/cart'; // <-- Import CartService
import { Wishlist } from '../../core/services/wishlist'; // <-- Import WishlistService
import { TranslatePipe } from '@ngx-translate/core'; // <-- Import TranslatePipe
import { SearchPipe } from '../../core/pipes/search-pipe'; // <-- Import SearchPipe


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule,FormsModule, RouterLink, SearchPipe ,TranslatePipe],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  private readonly _ecommerceService = inject(EcommerceService);
  private readonly _cartService = inject(CartService); // <-- Inject CartService
  private readonly _cdr = inject(ChangeDetectorRef);
  private readonly _wishlistService = inject(Wishlist); // <-- Inject WishlistService

  productsList: Product[] = [];
  isLoading: boolean = true;
  hasError: boolean = false;
  wishlistIds: string[] = []; // <-- Holds favorite product IDs
   text: string = ''; // <-- Holds the user's search input text

  ngOnInit(): void {
    this.getProducts();
    this.getWishlist();
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

  getWishlist(): void {
    this._wishlistService.getLoggedUserWishlist().subscribe({
      next: (res: any) => {
        if (res?.data) {
          this.wishlistIds = res.data.map((item: any) => item._id);
          this._cdr.detectChanges();
        }
      },
      error: (err: any) => console.error('Error getting wishlist:', err)
    });
  }

  toggleWishlist(productId: string): void {
    if (!productId) return;

    if (this.wishlistIds.includes(productId)) {
      this._wishlistService.removeFromWishlist(productId).subscribe({
        next: (res: any) => {
          this.wishlistIds = res.data; // Sync directly with backend array
          this._cdr.detectChanges();
        },
        error: (err) => console.error('Error removing from wishlist:', err)
      });
    } else {
      this._wishlistService.addToWishlist(productId).subscribe({
        next: (res: any) => {
          this.wishlistIds = res.data; // Sync directly with backend array
          this._cdr.detectChanges();
        },
        error: (err) => console.error('Error adding to wishlist:', err)
      });
    }
  }
}
