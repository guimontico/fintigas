import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import type { Observable } from "rxjs";

export interface StockSymbol {
  "1. symbol": string;
  "2. name": string;
  "3. type": string;
  "4. region": string;
  "5. marketopen": string;
  "6. marketclose": string;
  "7. timezone": string;
  "8. currency": string;
  "9. matchscore": string;
}

export interface SymbolSearchResponse {
  bestMatches: StockSymbol[];
}

@Injectable({
  providedIn: "root",
})
export class StockSearchService {
  private readonly http = inject(HttpClient);
  private readonly apiKey = "demo"; // Replace with your API key
  private readonly apiBaseUrl = "https://www.alphavantage.co/query";

  searchSymbols(keywords: string): Observable<SymbolSearchResponse> {
    const params = {
      function: "SYMBOL_SEARCH",
      keywords,
      apikey: this.apiKey,
    };

    return this.http.get<SymbolSearchResponse>(this.apiBaseUrl, { params });
  }
}
