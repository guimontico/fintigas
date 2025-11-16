import type { StockSymbol } from './stock-symbol.model';

/**
 * Normalized ticker model for wallet storage
 * Converts Alpha Vantage format to clean property names
 */
export interface SavedTicker {
  symbol: string;
  name: string;
  type: string;
  region: string;
  marketOpen: string;
  marketClose: string;
  timezone: string;
  currency: string;
  savedAt: string; // ISO timestamp
  notes?: string;
}

/**
 * Convert Alpha Vantage StockSymbol to SavedTicker
 */
export function toSavedTicker(stockSymbol: StockSymbol, notes?: string): SavedTicker {
  return {
    symbol: stockSymbol['1. symbol'],
    name: stockSymbol['2. name'],
    type: stockSymbol['3. type'],
    region: stockSymbol['4. region'],
    marketOpen: stockSymbol['5. marketopen'],
    marketClose: stockSymbol['6. marketclose'],
    timezone: stockSymbol['7. timezone'],
    currency: stockSymbol['8. currency'],
    savedAt: new Date().toISOString(),
    notes,
  };
}

/**
 * Convert SavedTicker back to StockSymbol format if needed
 */
export function toStockSymbol(savedTicker: SavedTicker): StockSymbol {
  return {
    '1. symbol': savedTicker.symbol,
    '2. name': savedTicker.name,
    '3. type': savedTicker.type,
    '4. region': savedTicker.region,
    '5. marketopen': savedTicker.marketOpen,
    '6. marketclose': savedTicker.marketClose,
    '7. timezone': savedTicker.timezone,
    '8. currency': savedTicker.currency,
    '9. matchscore': '1.0000',
  };
}
