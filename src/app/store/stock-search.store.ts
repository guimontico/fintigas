import { computed, inject } from "@angular/core";
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { debounceTime, distinctUntilChanged, pipe, switchMap, tap } from "rxjs";
import type { StockSymbol, SymbolSearchResponse } from "../models";
import { StockSearchService } from "../services/stock-search.service";

type StockSearchState = {
  results: StockSymbol[];
  isLoading: boolean;
  error: string | null;
  lastQuery: string;
};

const initialState: StockSearchState = {
  results: [],
  isLoading: false,
  error: null,
  lastQuery: "",
};

export const StockSearchStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withComputed(({ results }) => ({
    resultsCount: computed(() => results().length),
  })),
  withMethods((store, service = inject(StockSearchService)) => ({
    // 👇 Reactive method for searching symbols with debouncing
    search: rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((query) =>
          patchState(store, { isLoading: true, lastQuery: query }),
        ),
        switchMap((query) => {
          return service.searchSymbols(query).pipe(
            tap({
              next: (response: SymbolSearchResponse) =>
                patchState(store, {
                  results: response.bestMatches || [],
                  isLoading: false,
                  error: null,
                }),
              error: (err: unknown) => {
                console.error("Stock search error:", err);
                patchState(store, {
                  isLoading: false,
                  error: "Failed to fetch stocks. Please try again.",
                  results: [],
                });
              },
            }),
          );
        }),
      ),
    ),
    // 👇 Method to clear search results
    clearResults(): void {
      patchState(store, {
        results: [],
        error: null,
        lastQuery: "",
      });
    },
    // 👇 Method to clear error
    clearError(): void {
      patchState(store, { error: null });
    },
  })),
);
