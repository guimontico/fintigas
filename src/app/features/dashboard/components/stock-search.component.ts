import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import type { SearchInput } from "../../../models";
import { StockSearchStore } from "../../../store/stock-search.store";
import { StockSearchInputComponent } from "./stock-search-input.component";

@Component({
  selector: "app-stock-search",
  standalone: true,
  imports: [CommonModule, StockSearchInputComponent],
  template: `
    <div class="p-8 bg-white rounded shadow">
      <h2 class="text-2xl font-semibold mb-6 text-gray-900">Stock Symbol Search</h2>
      
      <app-stock-search-input (searchInput)="onSearch($event)" />

      @if (store.isLoading()) {
        <div class="py-8 text-center text-gray-500">
          <p>Searching...</p>
        </div>
      } @else if (store.error()) {
        <div class="p-4 bg-red-100 text-red-900 rounded border border-red-300 flex justify-between items-center">
          <p>{{ store.error() }}</p>
          <button 
            (click)="store.clearError()" 
            class="ml-4 px-3 py-1 bg-red-900 text-white rounded hover:bg-red-800"
          >
            Dismiss
          </button>
        </div>
      } @else if (store.results().length > 0) {
        <div class="mt-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-900">
            Search Results ({{ store.resultsCount() }})
          </h3>
          <ul class="space-y-3">
            @for (stock of store.results(); track stock['1. symbol']) {
              <li class="p-4 border border-gray-200 rounded bg-gray-50 cursor-pointer transition-all hover:bg-gray-100 hover:border-blue-500 hover:shadow-md">
                <div class="font-semibold text-gray-900 text-lg mb-1">{{ stock['1. symbol'] }}</div>
                <div class="text-gray-700 text-sm mb-2">{{ stock['2. name'] }}</div>
                <div class="flex gap-4 text-sm text-gray-600">
                  <span>{{ stock['3. type'] }}</span>
                  <span>{{ stock['4. region'] }}</span>
                </div>
              </li>
            }
          </ul>
        </div>
      } @else if (store.lastQuery()) {
        <div class="py-8 text-center text-gray-500">
          <p>No results found</p>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockSearchComponent {
  store = inject(StockSearchStore);

  onSearch(input: SearchInput): void {
    if (!input.query.trim()) {
      this.store.clearResults();
      return;
    }
    this.store.search(input.query);
  }
}
