import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

@Component({
  selector: "app-dashboard-layout",
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white shadow-sm mb-6">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center space-x-8">
              <h1 class="text-xl font-bold text-gray-900">Fintigas</h1>
              <div class="flex space-x-4">
                <a 
                  routerLink="/" 
                  routerLinkActive="text-blue-600 border-b-2 border-blue-600"
                  [routerLinkActiveOptions]="{exact: true}"
                  class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Search
                </a>
                <a 
                  routerLink="/wallet" 
                  routerLinkActive="text-blue-600 border-b-2 border-blue-600"
                  class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Wallet
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <router-outlet />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayout {}
