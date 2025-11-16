import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import type { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import type { SymbolSearchResponse } from "../models";

@Injectable({
  providedIn: "root",
})
export class StockSearchService {
  private readonly http = inject(HttpClient);
  private readonly apiKey = environment.apiKey;
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly demoMode = environment.demoMode;
  private readonly demoParams = environment.demoParams;

  searchSymbols(keywords: string): Observable<SymbolSearchResponse> {
    const params = this.buildParams("SYMBOL_SEARCH", {
      function: "SYMBOL_SEARCH",
      keywords,
      apikey: this.apiKey,
    });

    return this.http.get<SymbolSearchResponse>(this.apiBaseUrl, { params });
  }

  /**
   * Builds API parameters with demo overrides if in demo mode
   * @param endpoint - The API function name (e.g., "SYMBOL_SEARCH", "NEWS_SENTIMENT")
   * @param params - The original parameters to send
   * @returns Modified parameters with demo overrides applied if demoMode is enabled
   */
  private buildParams(
    endpoint: string,
    params: Record<string, string>
  ): Record<string, string> {
    if (!this.demoMode) {
      return params;
    }

    const demoOverrides =
      this.demoParams[endpoint as keyof typeof this.demoParams];
    if (demoOverrides) {
      return { ...params, ...demoOverrides };
    }

    return params;
  }
}
