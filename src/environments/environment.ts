export const environment = {
  production: false,
  apiBaseUrl: "https://www.alphavantage.co/query",
  apiKey: "demo",
  demoMode: true,
  // Demo overrides: maps endpoint names to their demo parameter overrides
  demoParams: {
    SYMBOL_SEARCH: { keywords: "tencent" },
    NEWS_SENTIMENT: { tickers: "AAPL" },
    // Add more endpoints as needed
  },
};
