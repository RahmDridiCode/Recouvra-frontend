import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './guards/auth.guard';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent),
        canActivate: [roleGuard('admin')]
      },
      {
        path: 'clients',
        loadComponent: () => import('./pages/clients/clients.component').then(m => m.ClientsComponent)
      },
      {
        path: 'invoices',
        loadComponent: () => import('./pages/invoices/invoices.component').then(m => m.InvoicesComponent)
      },
      {
        path: 'payments',
        loadComponent: () => import('./pages/payments/payments.component').then(m => m.PaymentsComponent)
      },
      {
        path: 'recovery-actions',
        loadComponent: () => import('./pages/recovery-actions/recovery-actions.component').then(m => m.RecoveryActionsComponent)
      },
      {
        path: 'statistics',
        loadComponent: () => import('./pages/statistics/statistics.component').then(m => m.StatisticsComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
