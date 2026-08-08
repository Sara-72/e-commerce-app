import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  private readonly _cartService = inject(CartService);
  private readonly _cdr = inject(ChangeDetectorRef);

  cartDetails: any = null;
  isLoading: boolean = true;
  hasError: boolean = false;

  ngOnInit(): void {
    this.getCart();
  }

  getCart(): void {
    this.isLoading = true;
    this.hasError = false;

    this._cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartDetails = res.data;
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching cart:', err);
        this.isLoading = false;
        this.hasError = true;
        this._cdr.detectChanges();
      }
    });
  }

  removeItem(productId: string): void {
    if (!productId) return;

    this._cartService.removeCartItem(productId).subscribe({
      next: (res) => {
        this.cartDetails = res.data;
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error removing item from cart:', err);
      }
    });
  }

  updateCount(productId: string, count: number): void {
    if (count <= 0) {
      this.removeItem(productId);
      return;
    }

    this._cartService.updateProductCount(productId, count).subscribe({
      next: (res) => {
        this.cartDetails = res.data;
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error updating product count:', err);
      }
    });
  }

  clearCart(): void {
    this._cartService.clearCart().subscribe({
      next: (res) => {
        if (res.message === 'success') {
          this.cartDetails = null;
          this._cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error clearing cart:', err);
      }
    });
  }
}
