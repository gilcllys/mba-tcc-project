import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./page/intro/intro.component').then(m => m.IntroComponent) },
  { path: 'client', loadComponent: () => import('./page/client/client.component').then(m => m.ClientComponent) },
  { path: 'food', loadComponent: () => import('./page/food/food.component').then(m => m.FoodComponent) },
  { path: 'order', loadComponent: () => import('./page/order/order.component').then(m => m.OrderComponent) },
];
