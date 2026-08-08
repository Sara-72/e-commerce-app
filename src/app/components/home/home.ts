import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EcommerceService } from '../../core/services/ecommerce';
import { Product, Category } from '../../core/interfaces/product';
import { register } from 'swiper/element/bundle';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart'; // <-- Import CartService

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
}
