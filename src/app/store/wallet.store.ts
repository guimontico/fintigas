import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import type { SavedTicker, StockSymbol } from '../models';
import { toSavedTicker } from '../models';
import { WalletStorageService } from '../services/wallet-storage.service';

/**
 * Wallet state
 */
type WalletState = {
  tickers: SavedTicker[];
  lastUpdated: string;
};

/**
 * Initial state - load from localStorage
 */
const initialState: WalletState = {
  tickers: [],
  lastUpdated: new Date().toISOString(),
};

/**
 * Wallet store for managing saved stock tickers
 * Uses NgRx Signals for reactive state management
 */
export const WalletStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ tickers }) => ({
    /**
     * Total number of saved tickers
     */
    tickersCount: computed(() => tickers().length),

    /**
     * Check if wallet is empty
     */
    isEmpty: computed(() => tickers().length === 0),

    /**
     * Get unique symbols in wallet
     */
    symbols: computed(() => tickers().map((t) => t.symbol)),
  })),
  withMethods((store, storageService = inject(WalletStorageService)) => ({
    /**
     * Load wallet from localStorage
     */
    loadFromStorage(): void {
      const wallet = storageService.load();
      patchState(store, {
        tickers: wallet.tickers,
        lastUpdated: wallet.lastUpdated,
      });
    },

    /**
     * Check if a ticker is already saved
     */
    isSaved(symbol: string): boolean {
      return store.symbols().includes(symbol);
    },

    /**
     * Add a ticker to the wallet
     */
    addTicker(stockSymbol: StockSymbol, notes?: string): boolean {
      const symbol = stockSymbol['1. symbol'];

      // Prevent duplicates
      if (store.symbols().includes(symbol)) {
        console.warn(`Ticker ${symbol} is already saved`);
        return false;
      }

      const savedTicker = toSavedTicker(stockSymbol, notes);
      const newTickers = [...store.tickers(), savedTicker];
      const lastUpdated = new Date().toISOString();

      // Save to localStorage
      const success = storageService.save({
        tickers: newTickers,
        lastUpdated,
      });

      if (success) {
        patchState(store, {
          tickers: newTickers,
          lastUpdated,
        });
      }

      return success;
    },

    /**
     * Remove a ticker from the wallet by symbol
     */
    removeTicker(symbol: string): boolean {
      const newTickers = store.tickers().filter((t) => t.symbol !== symbol);
      const lastUpdated = new Date().toISOString();

      // Save to localStorage
      const success = storageService.save({
        tickers: newTickers,
        lastUpdated,
      });

      if (success) {
        patchState(store, {
          tickers: newTickers,
          lastUpdated,
        });
      }

      return success;
    },

    /**
     * Update notes for a saved ticker
     */
    updateNotes(symbol: string, notes: string): boolean {
      const newTickers = store.tickers().map((t) =>
        t.symbol === symbol ? { ...t, notes } : t
      );
      const lastUpdated = new Date().toISOString();

      // Save to localStorage
      const success = storageService.save({
        tickers: newTickers,
        lastUpdated,
      });

      if (success) {
        patchState(store, {
          tickers: newTickers,
          lastUpdated,
        });
      }

      return success;
    },

    /**
     * Clear all tickers from wallet
     */
    clearWallet(): boolean {
      const success = storageService.clear();

      if (success) {
        patchState(store, {
          tickers: [],
          lastUpdated: new Date().toISOString(),
        });
      }

      return success;
    },

    /**
     * Export wallet as JSON
     */
    exportWallet(): string | null {
      return storageService.export();
    },

    /**
     * Import wallet from JSON
     */
    importWallet(jsonData: string): boolean {
      const success = storageService.import(jsonData);

      if (success) {
        // Reload from storage after import
        const wallet = storageService.load();
        patchState(store, {
          tickers: wallet.tickers,
          lastUpdated: wallet.lastUpdated,
        });
      }

      return success;
    },
  }))
);
