import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EcommerceService } from '../../core/services/ecommerce';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Brand } from '../../core/interfaces/product';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brands.html',
  styleUrl: './brands.css'
})
export class Brands  {
  private _ecommerceService = inject(EcommerceService);

  brands$: Observable<Brand[]> = this._ecommerceService.getBrands().pipe(
    map(res => res.data)
  );
}
