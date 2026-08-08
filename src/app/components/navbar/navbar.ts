import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  private readonly _cartService = inject(CartService);

  countNumber: number = 0;

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
  }
}
