"use client";

import type { IndicatorData } from "@/lib/api";

interface IndicatorPanelProps {
  data: IndicatorData | null;
  loading?: boolean;
}

function rsiSignal(v: number) {
  if (v > 70) return { label: "Aşırı Alım", color: "text-red-400" };
  if (v < 30) return { label: "Aşırı Satım", color: "text-emerald-400" };
  return { label: "Nötr", color: "text-muted-foreground" };
}

export function IndicatorPanel({ data, loading }: IndicatorPanelProps) {
  if (loading) {
    return (
      <div className="rounded-lg border border-border/50 p-4">
        <p className="text-[12px] font-medium text-muted-foreground mb-3">Teknik İndikatörler</p>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-6 bg-muted/30 rounded animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const rsi = rsiSignal(data.rsi);
  const rows = [
    { name: "RSI (14)", value: data.rsi.toFixed(1), signal: rsi.label, color: rsi.color },
    { name: "MACD", value: data.macd.toFixed(4), signal: data.macd > data.macd_signal ? "Yükseliş" : "Düşüş", color: data.macd > data.macd_signal ? "text-emerald-400" : "text-red-400" },
    { name: "SMA 20", value: data.sma_20.toFixed(2), signal: data.price > data.sma_20 ? "Üstünde" : "Altında", color: data.price > data.sma_20 ? "text-emerald-400" : "text-red-400" },
    { name: "SMA 50", value: data.sma_50.toFixed(2), signal: data.price > data.sma_50 ? "Üstünde" : "Altında", color: data.price > data.sma_50 ? "text-emerald-400" : "text-red-400" },
    { name: "EMA 20", value: data.ema_20.toFixed(2), signal: data.price > data.ema_20 ? "Üstünde" : "Altında", color: data.price > data.ema_20 ? "text-emerald-400" : "text-red-400" },
    { name: "Bollinger", value: `${data.bb_lower.toFixed(0)}-${data.bb_upper.toFixed(0)}`, signal: data.price > data.bb_upper ? "Ust Band" : data.price < data.bb_lower ? "Alt Band" : "Bant İçi", color: "text-muted-foreground" },
    { name: "ATR", value: data.atr.toFixed(4), signal: "", color: "" },
  ];

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border/30 bg-muted/10 flex items-center justify-between">
        <p className="text-[12px] font-medium text-muted-foreground">Teknik İndikatörler</p>
        <span className="text-[11px] font-mono text-muted-foreground">{data.symbol.replace(".IS", "")}</span>
      </div>
      <div className="divide-y divide-border/20">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center justify-between px-4 py-2 text-[13px]">
            <span className="text-muted-foreground">{r.name}</span>
            <div className="flex items-center gap-3">
              <span className="font-mono">{r.value}</span>
              {r.signal && <span className={`text-[11px] font-medium ${r.color}`}>{r.signal}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
