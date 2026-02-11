import { Routes } from '@angular/router';
import { Register } from './components/aouth/register/register'; // וודאי שהנתיב נכון
import { GiftList } from './components/gift-list/gift-list'; // adjust path as needed
import { Login } from './components/aouth/login/login';
import { Donors } from './components/donors/donors';
import { AdminNavbar } from './components/admin-navbar/admin-navbar';
import { BasketComp } from './components/basket-comp/basket-comp';
import { PurchasersComp } from './components/purchasers-comp/purchasers-comp';

export const routes: Routes = [
  { path: 'register', component: Register, pathMatch: 'full' },
  { path: '', component: GiftList , pathMatch: 'full' },
  { path: 'login', component: Login, pathMatch: 'full' },
  { path: 'gifts', component: GiftList, pathMatch: 'full' },
  { path: 'donors', component: Donors, pathMatch: 'full' },
  { path: 'app-admin-navbar', component: AdminNavbar, pathMatch: 'full' },
  { path: 'cart', component: BasketComp, pathMatch: 'full' },
  { path: 'purchaser', component: PurchasersComp, pathMatch: 'full' },
    { path: 'register', component: Register, pathMatch: 'full' },

];