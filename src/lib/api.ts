const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// Stock endpoints
export const api = {
  health: () => fetchAPI<{ status: string; version: string }>("/health"),

  // Stock
  getStock: (symbol: string) =>
    fetchAPI<StockData>(`/api/stock/${symbol}`),
  searchStock: (query: string) =>
    fetchAPI<StockSearchResult[]>(`/api/stock/search/${query}`),
  getIndicators: (symbol: string, period = "3mo") =>
    fetchAPI<IndicatorData>(`/api/stock/${symbol}/indicators?period=${period}`),
  getRisk: (symbol: string, period = "1y") =>
    fetchAPI<RiskData>(`/api/stock/${symbol}/risk?period=${period}`),

  // Options
  priceOption: (params: OptionParams) => {
    const qs = new URLSearchParams(params as unknown as Record<string, string>).toString();
    return fetchAPI<OptionResult>(`/api/options/price?${qs}`);
  },

  // Forex
  getForexRate: (base: string, quote: string) =>
    fetchAPI<{ pair: string; rate: number }>(`/api/forex/${base}/${quote}`),

  // Commodities
  getCommodities: () =>
    fetchAPI<{ commodities: string[] }>("/api/commodities"),
  getCommodityPrice: (name: string) =>
    fetchAPI<{ commodity: string; price: number }>(`/api/commodities/${name}`),

  // Portfolio
  getPortfolio: () => fetchAPI<PortfolioSummary>("/api/portfolio"),
  buyPosition: (symbol: string, amount: number, price: number) =>
    fetchAPI<PortfolioSummary>("/api/portfolio/buy", {
      method: "POST",
      body: JSON.stringify({ symbol, amount, price }),
    }),

  // Fundamental
  getRatios: (symbol: string) =>
    fetchAPI<{ symbol: string; ratios: Record<string, number> }>(
      `/api/fundamental/${symbol}/ratios`
    ),

  // Indicator Series (full time series for charts)
  getIndicatorSeries: (symbol: string, period = "6mo") =>
    fetchAPI<IndicatorSeries>(`/api/stock/${symbol}/indicator-series?period=${period}`),

  // Historical
  getHistorical: (symbol: string, period = "1y") =>
    fetchAPI<{ data: { time: string; open: number; high: number; low: number; close: number; volume: number }[] }>(
      `/api/stock/${symbol}/historical?period=${period}`
    ),

  // Batch
  getBatchStocks: (symbols: string[]) =>
    fetchAPI<{ results: Record<string, StockData> }>("/api/stock/batch", {
      method: "POST",
      body: JSON.stringify({ symbols }),
    }),

  // Compare
  compareStocks: (symbols: string[], period = "1y") =>
    fetchAPI<{ comparison: Record<string, unknown>[] }>("/api/stock/compare", {
      method: "POST",
      body: JSON.stringify({ symbols, period }),
    }),

  // Monte Carlo
  monteCarlo: (symbol: string, simulations = 1000, days = 252) =>
    fetchAPI<MonteCarloResult>("/api/quant/monte-carlo", {
      method: "POST",
      body: JSON.stringify({ symbol, simulations, days }),
    }),

  // GARCH
  garch: (symbol: string) =>
    fetchAPI<GarchResult>("/api/quant/garch", {
      method: "POST",
      body: JSON.stringify({ symbol }),
    }),

  // Portfolio Optimization
  optimizePortfolio: (symbols: string[]) =>
    fetchAPI<PortfolioOptResult>("/api/quant/optimize", {
      method: "POST",
      body: JSON.stringify({ symbols }),
    }),

  // Sentiment
  analyzeSentiment: (texts: string[]) =>
    fetchAPI<{ results: SentimentResult[] }>("/api/sentiment/analyze", {
      method: "POST",
      body: JSON.stringify({ texts }),
    }),

  // Enterprise
  getAuditTrail: (limit = 50) =>
    fetchAPI<AuditEntry[]>(`/api/enterprise/audit?limit=${limit}`),

  // ── MongoDB Data ──
  dbGetCompanies: (sector?: string) =>
    fetchAPI<{ companies: DBCompany[] }>(`/api/db/companies${sector ? `?sector=${sector}` : ""}`),
  dbGetWatchlist: (userId: string) =>
    fetchAPI<{ user_id: string; symbols: string[] }>(`/api/db/watchlist/${userId}`),
  dbUpdateWatchlist: (userId: string, symbols: string[]) =>
    fetchAPI<{ status: string }>(`/api/db/watchlist/${userId}`, {
      method: "POST",
      body: JSON.stringify({ symbols }),
    }),
  dbGetPortfolio: (userId: string) =>
    fetchAPI<{ user_id: string; positions: DBPosition[] }>(`/api/db/portfolio/${userId}`),
  dbAddPosition: (userId: string, symbol: string, quantity: number, entryPrice: number) =>
    fetchAPI<{ status: string }>(`/api/db/portfolio/${userId}`, {
      method: "POST",
      body: JSON.stringify({ symbol, quantity, entry_price: entryPrice }),
    }),
  dbRemovePosition: (userId: string, symbol: string) =>
    fetchAPI<{ status: string }>(`/api/db/portfolio/${userId}/${symbol}`, { method: "DELETE" }),
  dbGetNewsSentiment: (symbol: string) =>
    fetchAPI<{ symbol: string; articles: DBNewsSentiment[] }>(`/api/db/news/${symbol}`),
  dbGetPreferences: (userId: string) =>
    fetchAPI<DBPreferences>(`/api/db/preferences/${userId}`),
  dbUpdatePreferences: (userId: string, prefs: Partial<DBPreferences>) =>
    fetchAPI<{ status: string }>(`/api/db/preferences/${userId}`, {
      method: "POST",
      body: JSON.stringify(prefs),
    }),

  // Sentiment Demo
  getSentimentDemo: (symbol?: string) =>
    fetchAPI<{ results?: unknown[]; symbol?: string; analyses?: unknown[] }>(
      `/api/sentiment/demo${symbol ? `?symbol=${symbol}` : ""}`
    ),
};

export interface MonteCarloResult {
  symbol: string;
  current_price: number;
  simulations: number;
  days: number;
  var_95: number;
  expected_price: number;
  percentiles: Record<string, number>;
  sample_paths: number[][];
}

export interface GarchResult {
  symbol: string;
  model: string;
  current_volatility: number;
  forecast_volatility?: number[];
  forecast_annualized?: number[];
}

export interface PortfolioOptResult {
  symbols: string[];
  equal_weight: { weights: Record<string, number>; expected_return: number; volatility: number; sharpe: number };
  optimized: { weights: Record<string, number>; expected_return: number; volatility: number; sharpe: number };
  correlation: Record<string, Record<string, number>>;
}

export interface SentimentResult {
  text: string;
  sentiment: string;
  confidence: number;
}

export interface IndicatorSeries {
  symbol: string;
  period: string;
  dates: string[];
  close: number[];
  volume: number[];
  rsi: (number | null)[];
  macd: (number | null)[];
  macd_signal: (number | null)[];
  macd_histogram: (number | null)[];
  sma_20: (number | null)[];
  sma_50: (number | null)[];
  ema_20: (number | null)[];
  bb_upper: (number | null)[];
  bb_middle: (number | null)[];
  bb_lower: (number | null)[];
  adx: (number | null)[];
  atr: (number | null)[];
  stoch_k?: (number | null)[];
  stoch_d?: (number | null)[];
  williams_r?: (number | null)[];
  cci?: (number | null)[];
  aroon_up?: (number | null)[];
  aroon_down?: (number | null)[];
}

// Types
export interface StockData {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
  market_cap: number;
  name: string;
  [key: string]: unknown;
}

export interface StockSearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}

export interface IndicatorData {
  symbol: string;
  period: string;
  price: number;
  rsi: number;
  macd: number;
  macd_signal: number;
  sma_20: number;
  sma_50: number;
  ema_20: number;
  bb_upper: number;
  bb_middle: number;
  bb_lower: number;
  atr: number;
}

export interface RiskData {
  symbol: string;
  annualized_return: number;
  annualized_volatility: number;
  sharpe_ratio: number;
  sortino_ratio: number;
  max_drawdown: number;
  var_95: number;
  cvar_95: number;
}

export interface OptionParams {
  S: string;
  K: string;
  T: string;
  r: string;
  sigma: string;
  option_type?: string;
}

export interface OptionResult {
  price: number;
  greeks: Record<string, number>;
}

export interface PortfolioSummary {
  cash: number;
  positions: Record<string, { amount: number; avg_price: number }>;
  total_value: number;
  pnl: number;
}

export interface AuditEntry {
  timestamp: string;
  action: string;
  user_id: string;
  details: Record<string, unknown>;
}

// MongoDB types
export interface DBCompany {
  symbol: string;
  name: string;
  sector: string;
  yahoo: string;
}

export interface DBPosition {
  user_id: string;
  symbol: string;
  quantity: number;
  entry_price: number;
  entry_date: string;
}

export interface DBNewsSentiment {
  symbol: string;
  title: string;
  sentiment: string;
  confidence: number;
  source: string;
}

export interface DBPreferences {
  user_id: string;
  theme: string;
  language: string;
  notifications: boolean;
  daily_report: boolean;
}
