"use client";

import type { RiskData } from "@/lib/api";

interface RiskPanelProps {
  data: RiskData | null;
  loading?: boolean;
}

export function RiskPanel({ data, loading }: RiskPanelProps) {
  if (loading) {
    return (
      <div className="rounded-lg border border-border/50 p-4">
        <p className="text-[12px] font-medium text-muted-foreground mb-3">Risk Metrikleri</p>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-6 bg-muted/30 rounded animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const rows = [
    { name: "Yıllık Getiri", value: `${(data.annualized_return * 100).toFixed(2)}%`, color: data.annualized_return >= 0 ? "text-emerald-400" : "text-red-400" },
    { name: "Volatilite", value: `${(data.annualized_volatility * 100).toFixed(2)}%`, color: "" },
    { name: "Sharpe", value: data.sharpe_ratio.toFixed(2), color: data.sharpe_ratio > 1 ? "text-emerald-400" : data.sharpe_ratio > 0 ? "text-yellow-400" : "text-red-400" },
    { name: "Sortino", value: data.sortino_ratio.toFixed(2), color: data.sortino_ratio > 1 ? "text-emerald-400" : data.sortino_ratio > 0 ? "text-yellow-400" : "text-red-400" },
    { name: "Max DD", value: `${(data.max_drawdown * 100).toFixed(2)}%`, color: "text-red-400" },
    { name: "VaR 95%", value: `${(data.var_95 * 100).toFixed(2)}%`, color: "text-orange-400" },
    { name: "CVaR 95%", value: `${(data.cvar_95 * 100).toFixed(2)}%`, color: "text-orange-400" },
  ];

  const level = Math.abs(data.max_drawdown) > 0.3 ? "Yüksek" : Math.abs(data.max_drawdown) > 0.15 ? "Orta" : "Düşük";
  const levelColor = level === "Yüksek" ? "text-red-400" : level === "Orta" ? "text-yellow-400" : "text-emerald-400";

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border/30 bg-muted/10 flex items-center justify-between">
        <p className="text-[12px] font-medium text-muted-foreground">Risk Metrikleri</p>
        <span className={`text-[11px] font-medium ${levelColor}`}>{level} Risk</span>
      </div>
      <div className="divide-y divide-border/20">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center justify-between px-4 py-2 text-[13px]">
            <span className="text-muted-foreground">{r.name}</span>
            <span className={`font-mono ${r.color}`}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
