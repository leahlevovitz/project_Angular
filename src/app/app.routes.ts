import { Routes } from '@angular/router';
import { Register } from './components/aouth/register/register'; // וודאי שהנתיב נכון
import { GiftList } from './components/gift-list/gift-list'; // adjust path as needed
import { Login } from './components/aouth/login/login';
import { Donors } from './components/donors/donors';

export const routes: Routes = [
  { path: 'register', component: Register , pathMatch: 'full' },
  // { path: '/', component: GiftList , pathMatch: 'full' },
   { path: 'login', component: Login , pathMatch: 'full' },
   { path: 'gifts', component: GiftList , pathMatch: 'full' },
    { path: 'donors', component: Donors , pathMatch: 'full' },
   { path: 'admin-panel', component: GiftList , pathMatch: 'full' },





//   { path: 'gifts', redirectTo: 'register', pathMatch: 'full' } // ברירת מחדל
];