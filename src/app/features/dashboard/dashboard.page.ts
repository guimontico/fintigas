import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-dashboard-page",
  imports: [],
  template: `
    <div class="p-8">
      <h1 class="text-4xl font-bold text-gray-900">Dashboard</h1>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {}
