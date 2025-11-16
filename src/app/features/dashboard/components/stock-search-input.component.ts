import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, output } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

export interface SearchInput {
  query: string;
}

@Component({
  selector: "app-stock-search-input",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mb-4">
      <input
        type="text"
        [formControl]="searchControl"
        placeholder="Search stocks (e.g., AAPL, Google, MSFT)"
        class="w-full px-4 py-3 border border-gray-200 rounded transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockSearchInputComponent {
  searchControl = new FormControl("");
  searchInput = output<SearchInput>();

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        if (query?.trim()) {
          this.searchInput.emit({ query: query.trim() });
        }
      });
  }
}
