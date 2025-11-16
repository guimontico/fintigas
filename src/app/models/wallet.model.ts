import type { SavedTicker } from './saved-ticker.model';

/**
 * Wallet state model
 */
export interface Wallet {
  tickers: SavedTicker[];
  lastUpdated: string; // ISO timestamp
}

/**
 * Create an empty wallet
 */
export function createEmptyWallet(): Wallet {
  return {
    tickers: [],
    lastUpdated: new Date().toISOString(),
  };
}
