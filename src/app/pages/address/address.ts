import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Orders } from '../../core/services/orders';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address.html',
  styleUrl: './address.css'
})
export class AddressComponent implements OnInit {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _ordersService = inject(Orders);
  private readonly _router = inject(Router);

  cartId: string = '';
  isLoading: boolean = false;

  addressForm: FormGroup = new FormGroup({
    details: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^01[0125][0-9]{8}$/) // Egyptian phone pattern
    ]),
    city: new FormControl(null, [Validators.required])
  });

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.cartId = params.get('id') || '';
      }
    });
  }

  handleOnlinePayment(): void {
    if (this.addressForm.invalid || !this.cartId) {
      this.addressForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this._ordersService.checkOutSession(this.cartId, this.addressForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status === 'success' && res.session?.url) {
          // Redirect user to Stripe/PayMob gateway page
          window.location.href = res.session.url;
        }
      },
      error: (err) => {
        console.error('Checkout error:', err);
        this.isLoading = false;
      }
    });
  }

  handleCashPayment(): void {
    if (this.addressForm.invalid || !this.cartId) {
      this.addressForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this._ordersService.createCashOrder(this.cartId, this.addressForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        alert('Order placed successfully with Cash on Delivery!');
        this._router.navigate(['/allorders']);
      },
      error: (err) => {
        console.error('Cash Order error:', err);
        this.isLoading = false;
      }
    });
  }
}
