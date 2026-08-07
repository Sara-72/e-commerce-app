import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EcommerceService } from '../../core/services/ecommerce';
import { Product, Category } from '../../core/interfaces/product';
import { register } from 'swiper/element/bundle';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private _ecommerceService = inject(EcommerceService);

  productsList: Product[] = [];
  categoriesList: Category[] = [];

  // Track loading state explicitly
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
      },
      error: (err) => {
        console.error('Products Error on refresh:', err);
        this.isLoadingProducts = false;
        this.hasError = true;
      }
    });
  }
}
