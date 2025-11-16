import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import type {
  StockSymbol,
  SymbolSearchResponse,
} from "../../../services/stock-search.service";
import { StockSearchService } from "../../../services/stock-search.service";
import {
  type SearchInput,
  StockSearchInputComponent,
} from "./stock-search-input.component";

@Component({
  selector: "app-stock-search",
  standalone: true,
  imports: [CommonModule, StockSearchInputComponent],
  template: `
    <div class="p-8 bg-white rounded shadow">
      <h2 class="text-2xl font-semibold mb-6 text-gray-900">Stock Symbol Search</h2>
      
      <app-stock-search-input (searchInput)="onSearch($event)" />

      @if (isLoading()) {
        <div class="py-8 text-center text-gray-500">
          <p>Searching...</p>
        </div>
      } @else if (error()) {
        <div class="p-4 bg-red-100 text-red-900 rounded border border-red-300">
          <p>Error: {{ error() }}</p>
        </div>
      } @else if (results().length > 0) {
        <div class="mt-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Search Results</h3>
          <ul class="space-y-3">
            @for (stock of results(); track stock['1. symbol']) {
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
      } @else if (searched()) {
        <div class="py-8 text-center text-gray-500">
          <p>No results found</p>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockSearchComponent {
  private service = inject(StockSearchService);
  results = signal<StockSymbol[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  searched = signal(false);

  onSearch(input: SearchInput): void {
    if (!input.query) return;

    this.isLoading.set(true);
    this.error.set(null);
    this.searched.set(true);

    this.service.searchSymbols(input.query).subscribe({
      next: (response: SymbolSearchResponse) => {
        this.results.set(response.bestMatches || []);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        this.error.set("Failed to fetch stocks. Please try again.");
        this.isLoading.set(false);
        console.error("Stock search error:", err);
      },
    });
  }
}
