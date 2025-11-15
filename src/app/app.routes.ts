import type { Routes } from '@angular/router';
import { DashboardLayout } from './layouts/dashboard/dashboard.layout';
import { dashboardRoutes } from './features/dashboard/dashboard.routes';

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayout,
    children: dashboardRoutes,
  },
];
