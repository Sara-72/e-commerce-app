import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EcommerceService } from '../../core/services/ecommerce';
import { Category } from '../../core/interfaces/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslatePipe } from '@ngx-translate/core'; // <-- Import TranslatePipe

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule ,TranslatePipe],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories  {
 private _ecommerceService = inject(EcommerceService);

  categories$: Observable<Category[]> = this._ecommerceService.getCategories().pipe(
    map(res => res.data)
  );
}
