import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Categories } from './components/categories/categories';
import { Brands} from './components/brands/brands';
import { Products } from './components/products/products';
import { Navbar } from './components/navbar/navbar';
import { SignupComponent } from './components/signup/signup';
import { SigninComponent } from './components/signin/signin';
import { ProductDetails } from './components/product-details/product-details';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path : 'home',component:Home ,title:'Home'},
  { path: 'categories', component: Categories, title: 'Categories' },
  { path: 'brands', component: Brands, title: 'Brands' },
  { path: 'products', component: Products, title: 'Products' },
  { path :'navbar',component:Navbar,title :'Navbar'},
  { path: 'signup', component: SignupComponent, title: 'Sign Up' },
  { path: 'signin', component: SigninComponent, title: 'Sign In' },
  { path: 'productdetails/:id', component: ProductDetails },// Dynamic parameter

  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart').then(m => m.Cart),
    title: 'Cart'
  },
  {
    path: 'address/:id',
    loadComponent: () => import('./pages/address/address').then(m => m.AddressComponent),
    title: 'Shipping Address'
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./pages/wishlist/wishlist').then(m => m.WishlistComponent),
    title: 'Wishlist'
  },
  { path: '**', redirectTo: 'home' }


];
