import type { StockSymbol } from "./stock-symbol.model";

export interface SymbolSearchResponse {
  bestMatches: StockSymbol[];
}
