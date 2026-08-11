import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EcommerceService } from '../../core/services/ecommerce';
import { Product, Category } from '../../core/interfaces/product';
import { register } from 'swiper/element/bundle';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart'; // <-- CartService
import { Wishlist } from '../../core/services/wishlist';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private _ecommerceService = inject(EcommerceService);
  private _cdr = inject(ChangeDetectorRef);
  private _cartService = inject(CartService); // <-- Inject CartService
  private readonly _wishlistService = inject(Wishlist);

  productsList: Product[] = [];
  categoriesList: Category[] = [];

  isLoadingProducts: boolean = true;
  isLoadingCategories: boolean = true;
  hasError: boolean = false;

  bannerImages: string[] = [
    '/assets/1.jpg',
    '/assets/2.jpg',
    '/assets/3.jpg'
  ];

  ngOnInit(): void {
    register();
    this.loadData();
    this.loadWishlistIds();
    this.getWishlist();
  }

  loadData(): void {
    this.isLoadingProducts = true;
    this.isLoadingCategories = true;
    this.hasError = false;

    // Fetch Categories
    this._ecommerceService.getCategories().subscribe({
      next: (res) => {
        this.categoriesList = res.data ?? res;
        this.isLoadingCategories = false;

        // Force Angular to render dynamic swiper slides into the DOM
        this._cdr.detectChanges();

        // Let Swiper initialize safely after DOM update
        setTimeout(() => {
          const catSwiper = document.querySelector('.categories-slider');
          if (catSwiper && (catSwiper as any).initialize) {
            (catSwiper as any).initialize();
          }
        }, 50);
      },
      error: (err) => {
        console.error('Categories Error on refresh:', err);
        this.isLoadingCategories = false;
      }
    });

    // Fetch Products
    this._ecommerceService.getProducts().subscribe({
      next: (res) => {
        this.productsList = res.data ?? res;
        this.isLoadingProducts = false;
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.error('Products Error on refresh:', err);
        this.isLoadingProducts = false;
        this.hasError = true;
      }
    });
  }

 addToCart(productId: string): void {
    if (!productId) return;

    this._cartService.addToCart(productId).subscribe({
      next: (res) => {
        console.log('Cart Response (Home):', res);
        alert(res.message || 'Product added to cart successfully!');
      },
      error: (err) => {
        console.error('Error adding product to cart:', err);
        alert('Failed to add product to cart. Make sure you are logged in.');
      }
    });
  }
 wishlistIds: string[] = [];


 getWishlist(): void {
    this._wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        // The GET request returns full product objects, so we map them to get just the IDs
        if (res?.data) {
          this.wishlistIds = res.data.map((item: any) => item._id);
          this._cdr.detectChanges();
        }
      }
    });
  }


  loadWishlistIds(): void {
    // 2. Use _wishlistService (matching the name above)
    this._wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        this.wishlistIds = res.data.map((item: any) => item._id);
      }
    });
  }

 toggleWishlist(productId: string): void {
    if (!productId) return;

    if (this.wishlistIds.includes(productId)) {
      // Remove from wishlist
      this._wishlistService.removeFromWishlist(productId).subscribe({
        next: (res: any) => {
          // The API returns the exact updated list of IDs in res.data!
          this.wishlistIds = res.data;
          this._cdr.detectChanges(); // Update the UI
        }
      });
    } else {
      // Add to wishlist
      this._wishlistService.addToWishlist(productId).subscribe({
        next: (res: any) => {
          // The API returns the exact updated list of IDs in res.data!
          this.wishlistIds = res.data;
          this._cdr.detectChanges(); // Update the UI
        }
      });
    }
  }
}
