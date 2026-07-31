import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Categories } from './components/categories/categories';
import { Brands} from './components/brands/brands';
import { Products } from './components/products/products';
import { Navbar } from './components/navbar/navbar';
import { SignupComponent } from './components/signup/signup';
import { SigninComponent } from './components/signin/signin';

export const routes: Routes = [
  {path : 'home',component:Home ,title:'Home'},
  { path: 'categories', component: Categories, title: 'Categories' },
  { path: 'brands', component: Brands, title: 'Brands' },
  { path: 'products', component: Products, title: 'Products' },
  { path :'navbar',component:Navbar,title :'Navbar'},
  { path: 'signup', component: SignupComponent, title: 'Sign Up' },
  { path: 'signin', component: SigninComponent, title: 'Sign In' },

];
