import { ChangeDetectionStrategy, Component } from "@angular/core";
import { StockSearchComponent } from "./components/stock-search.component";

@Component({
  selector: "app-dashboard-page",
  imports: [StockSearchComponent],
  template: `
    <div class="p-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <app-stock-search />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {}
