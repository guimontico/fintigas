import type { Routes } from "@angular/router";
import { dashboardRoutes } from "./features/dashboard/dashboard.routes";
import { DashboardLayout } from "./layouts/dashboard/dashboard.layout";

export const routes: Routes = [
  {
    path: "",
    component: DashboardLayout,
    children: [
      ...dashboardRoutes,
      {
        path: "wallet",
        loadChildren: () => import("./features/wallet/wallet.routes").then(m => m.WALLET_ROUTES),
      },
    ],
  },
];
