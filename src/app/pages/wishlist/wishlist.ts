import { Component, OnInit, inject,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Wishlist } from '../../core/services/wishlist';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css'
})
export class WishlistComponent implements OnInit {
  private readonly _wishlistService = inject(Wishlist);
  private readonly _cartService = inject(CartService);
  private readonly _cdr = inject(ChangeDetectorRef); // <-- Inject ChangeDetectorRef

  wishlistDetails: any[] = []; // <-- Initialize as empty array
  isLoading: boolean = true;
  hasError: boolean = false;

  ngOnInit(): void {
    this.getWishlist();
  }

getWishlist(): void {
    this.isLoading = true;
    this.hasError = false;

    this._wishlistService.getLoggedUserWishlist().subscribe({
      next: (res: any) => {
        this.wishlistDetails = res?.data ?? [];
        this.isLoading = false;
        this._cdr.detectChanges(); // <-- Force Angular to update template view
      },
      error: (err: any) => {
        console.error('Wishlist load error:', err);
        this.isLoading = false;
        this.hasError = true;
        this._cdr.detectChanges(); // <-- Force update on error
      }
    });
  }


  removeItem(productId: string): void {
    this._wishlistService.removeFromWishlist(productId).subscribe({
      next: (res) => {
        // Filter out the deleted product locally to update the UI immediately
        this.wishlistDetails = this.wishlistDetails.filter(item => item._id !== productId);
      },
      error: (err) => {
        console.error('Error removing item from wishlist:', err);
      }
    });
  }

  addToCart(productId: string): void {
    this._cartService.addToCart(productId).subscribe({
      next: (res) => {
        alert('Product added to cart successfully!');
        // Optionally remove from wishlist after adding to cart
        this.removeItem(productId);
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
      }
    });
  }
}
