import { Component, OnInit, OnDestroy, inject, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EcommerceService } from '../../core/services/ecommerce';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart'; // <-- Import CartService

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit, OnDestroy {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _ecommerceService = inject(EcommerceService);
  private readonly _cdr = inject(ChangeDetectorRef);
  private readonly _cartService = inject(CartService); // <-- Inject CartService

  productId: string | null = null;
  productDetails: any = null;
  isLoading: boolean = true;
  hasError: boolean = false;

  private paramSub!: Subscription;
  private productSub!: Subscription;

  ngOnInit(): void {
    this.paramSub = this._activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.productId = params.get('id');
        if (this.productId) {
          this.getProductDetails(this.productId);
        } else {
          this.isLoading = false;
          this.hasError = true;
        }
      }
    });
  }

  getProductDetails(id: string): void {
    this.isLoading = true;
    this.hasError = false;
    this.productDetails = null;

    if (this.productSub) {
      this.productSub.unsubscribe();
    }

    this.productSub = this._ecommerceService.getSpecificProduct(id).subscribe({
      next: (res: any) => {
        this.productDetails = res?.data ? res.data : res;
        this.isLoading = false;

        // Force Angular change detection to render <swiper-container> into the DOM first
        this._cdr.detectChanges();

        // Let Swiper initialize cleanly after DOM update
        setTimeout(() => {
          const swiperEl = document.querySelector('swiper-container');
          if (swiperEl && (swiperEl as any).initialize) {
            (swiperEl as any).initialize();
          }
        }, 50);
      },
      error: (err: any) => {
        console.error('Error fetching product details:', err);
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }


  addToCart(productId: string): void {
    if (!productId) return;

    this._cartService.addToCart(productId).subscribe({
      next: (res) => {
        console.log('Cart Response (Product Details):', res);
        alert(res.message || 'Product added to cart successfully!');
      },
      error: (err) => {
        console.error('Error adding product to cart:', err);
        alert('Failed to add product to cart. Make sure you are logged in.');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.paramSub) this.paramSub.unsubscribe();
    if (this.productSub) this.productSub.unsubscribe();
  }
}
