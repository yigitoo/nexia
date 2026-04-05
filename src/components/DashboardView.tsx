"use client";

import { useEffect, useState, useCallback } from "react";
import { StockChart } from "./StockChart";
import { IndicatorPanel } from "./IndicatorPanel";
import { RiskPanel } from "./RiskPanel";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Activity,
  Clock,
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { api } from "@/lib/api";
import type { StockData, IndicatorData, RiskData } from "@/lib/api";

const WATCHLIST_SYMBOLS = [
  "THYAO.IS", "GARAN.IS", "AKBNK.IS", "EREGL.IS", "BIMAS.IS", "ASELS.IS",
];

const MARKET_TICKER = [
  { name: "BIST 100", value: "9,842", change: "+1.24" },
  { name: "USD/TRY", value: "38.42", change: "+0.18" },
  { name: "EUR/TRY", value: "41.85", change: "-0.06" },
  { name: "Altın (gr)", value: "3,245", change: "+0.52" },
];

interface WatchlistItem {
  symbol: string;
  data: StockData | null;
  loading: boolean;
}

export function DashboardView() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(
    WATCHLIST_SYMBOLS.map((s) => ({ symbol: s, data: null, loading: true }))
  );
  const [selectedSymbol, setSelectedSymbol] = useState("THYAO.IS");
  const [indicators, setIndicators] = useState<IndicatorData | null>(null);
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    api.health().then(() => setApiOnline(true)).catch(() => setApiOnline(false));
  }, []);

  const loadWatchlist = useCallback(() => {
    WATCHLIST_SYMBOLS.forEach((symbol, i) => {
      api.getStock(symbol)
        .then((data) => setWatchlist((p) => p.map((item, j) => j === i ? { ...item, data, loading: false } : item)))
        .catch(() => setWatchlist((p) => p.map((item, j) => j === i ? { ...item, loading: false } : item)));
    });
    setLastUpdate(new Date());
  }, []);

  useEffect(() => { loadWatchlist(); }, [loadWatchlist]);

  const selectStock = useCallback(async (symbol: string) => {
    setSelectedSymbol(symbol);
    setLoadingDetail(true);
    try {
      const [ind, risk] = await Promise.allSettled([api.getIndicators(symbol), api.getRisk(symbol)]);
      setIndicators(ind.status === "fulfilled" ? ind.value : null);
      setRiskData(risk.status === "fulfilled" ? risk.value : null);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      const sym = searchQuery.toUpperCase().includes(".IS") ? searchQuery.toUpperCase() : `${searchQuery.toUpperCase()}.IS`;
      selectStock(sym);
      setSearchQuery("");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/40">
        <div className="flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold">Dashboard</h1>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {lastUpdate.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Hisse ara (ör: THYAO)..."
                className="pl-8 h-8 w-44 text-[13px] bg-muted/30 border-border/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
            <button onClick={loadWatchlist} className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted/50 text-muted-foreground transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <div className={`w-1.5 h-1.5 rounded-full ${apiOnline ? "bg-emerald-500" : apiOnline === false ? "bg-red-500" : "bg-yellow-500"}`} />
          </div>
        </div>

        {/* Market ticker */}
        <div className="flex items-center gap-6 h-8 px-6 border-t border-border/30 bg-muted/20 text-[11px]">
          {MARKET_TICKER.map((m) => (
            <span key={m.name} className="flex items-center gap-1.5 text-muted-foreground">
              <span>{m.name}</span>
              <span className="font-mono text-foreground">{m.value}</span>
              <span className={`font-mono ${m.change.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>{m.change}%</span>
            </span>
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Chart + Watchlist */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5">
          <StockChart symbol={selectedSymbol} />

          {/* Watchlist */}
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border/40 bg-muted/20">
              <p className="text-[12px] font-medium text-muted-foreground">Watchlist</p>
            </div>
            <div className="divide-y divide-border/30">
              {watchlist.map((item) => {
                const active = selectedSymbol === item.symbol;
                const pct = item.data?.change_percent ?? 0;
                const positive = pct >= 0;
                return (
                  <button
                    key={item.symbol}
                    onClick={() => selectStock(item.symbol)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${active ? "bg-emerald-500/5" : "hover:bg-muted/30"}`}
                  >
                    {item.loading ? (
                      <div className="w-full h-5 rounded bg-muted/40 animate-pulse" />
                    ) : (
                      <>
                        <div className="min-w-0">
                          <p className={`font-mono text-[13px] font-medium ${active ? "text-emerald-400" : ""}`}>
                            {item.symbol.replace(".IS", "")}
                          </p>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <span className="font-mono text-[13px]">{item.data?.price?.toFixed(2) ?? "—"}</span>
                          {item.data && (
                            <span className={`font-mono text-[11px] flex items-center gap-0.5 min-w-[52px] justify-end ${positive ? "text-emerald-400" : "text-red-400"}`}>
                              {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {positive ? "+" : ""}{pct.toFixed(2)}%
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detail panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <IndicatorPanel data={indicators} loading={loadingDetail} />
          <RiskPanel data={riskData} loading={loadingDetail} />
        </div>

        {/* API warning */}
        {apiOnline === false && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-amber-500/20 bg-amber-500/5 text-[13px]">
            <Activity className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-muted-foreground">
              Backend bağlantısı yok.{" "}
              <code className="text-[12px] bg-muted/50 px-1.5 py-0.5 rounded font-mono">
                cd financelib && uvicorn financelib.api.server:app --reload
              </code>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
