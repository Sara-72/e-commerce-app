import { Component, OnInit, inject ,ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart';
import { Wishlist} from '../../core/services/wishlist'; // <-- Import WishlistService

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  private readonly _cartService = inject(CartService);
  private readonly _wishlistService = inject(Wishlist); // <-- Inject WishlistService
  private readonly _cdr = inject(ChangeDetectorRef);

  countNumber: number = 0;
  wishlistCountNumber: number = 0; // <-- Wishlist count property

  ngOnInit(): void {
    // Initialize cart count on app load
    this._cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this._cartService.cartNumber.next(res.numOfCartItems);
      },
      error: (err) => console.error('Error getting initial cart count:', err)
    });

    // Subscribe to real-time updates
    this._cartService.cartNumber.subscribe({
      next: (data) => {
        this.countNumber = data;
      }
    });

// Wishlist Count Subscription
    this._wishlistService.getLoggedUserWishlist().subscribe();
    this._wishlistService.wishlistNumber.subscribe({
      next: (count) => {
        this.wishlistCountNumber = count;
        this._cdr.detectChanges();
      }
    });
  }
}
