"use client";

import { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Wallet,
  BarChart3,
  PieChart,
  Award,
  AlertTriangle,
  ShoppingCart,
  Package,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Position {
  sym: string;
  name: string;
  amount: number;
  entry: number;
  current: number;
}

const INITIAL_POSITIONS: Position[] = [
  { sym: "THYAO", name: "Turk Hava Yollari", amount: 500, entry: 312.5, current: 318.2 },
  { sym: "GARAN", name: "Garanti BBVA", amount: 1000, entry: 128.4, current: 125.8 },
  { sym: "EREGL", name: "Eregeli Demir Celik", amount: 2000, entry: 52.3, current: 54.1 },
  { sym: "AKBNK", name: "Akbank", amount: 1500, entry: 67.8, current: 69.2 },
  { sym: "BIMAS", name: "BIM Magazalar", amount: 300, entry: 185.0, current: 188.5 },
];

const COLORS = [
  "#10b981", // emerald-500
  "#3b82f6", // blue-500
  "#f59e0b", // amber-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#06b6d4", // cyan-500
  "#f97316", // orange-500
  "#14b8a6", // teal-500
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCurrencyDetailed(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// --- Donut Chart (pure SVG) ---

function DonutChart({
  slices,
}: {
  slices: { label: string; value: number; color: string }[];
}) {
  const total = slices.reduce((s, sl) => s + sl.value, 0);
  if (total === 0) return null;

  const radius = 70;
  const cx = 90;
  const cy = 90;
  const strokeWidth = 28;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;
  const arcs = slices.map((sl) => {
    const pct = sl.value / total;
    const offset = circumference * (1 - accumulated) + circumference * 0.25;
    accumulated += pct;
    return {
      ...sl,
      pct,
      dashArray: `${circumference * pct} ${circumference * (1 - pct)}`,
      dashOffset: offset,
    };
  });

  return (
    <div className="flex items-center gap-6">
      <svg width={180} height={180} viewBox="0 0 180 180" className="shrink-0">
        {arcs.map((arc) => (
          <circle
            key={arc.label}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeWidth}
            strokeDasharray={arc.dashArray}
            strokeDashoffset={arc.dashOffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        ))}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          className="fill-foreground text-[13px] font-semibold"
        >
          {formatCurrency(total)}
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Toplam Deger
        </text>
      </svg>

      <div className="flex flex-col gap-1.5 min-w-0">
        {arcs.map((arc) => (
          <div key={arc.label} className="flex items-center gap-2 text-[12px]">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: arc.color }}
            />
            <span className="text-muted-foreground truncate">{arc.label}</span>
            <span className="font-mono ml-auto text-foreground">
              %{(arc.pct * 100).toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main Component ---

export function PortfolioView() {
  const [positions, setPositions] = useState<Position[]>(INITIAL_POSITIONS);

  // Add stock form
  const [newSym, setNewSym] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newEntry, setNewEntry] = useState("");

  // Computed metrics
  const metrics = useMemo(() => {
    const totalValue = positions.reduce((s, p) => s + p.current * p.amount, 0);
    const totalCost = positions.reduce((s, p) => s + p.entry * p.amount, 0);
    const totalPnl = totalValue - totalCost;
    const totalPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

    // Daily change (mock: random-ish based on pnl direction)
    const dailyChangePct = totalPct * 0.15;

    // Per-position P&L
    const positionPnls = positions.map((p) => ({
      sym: p.sym,
      pnl: (p.current - p.entry) * p.amount,
      pct: ((p.current - p.entry) / p.entry) * 100,
      value: p.current * p.amount,
    }));

    const best = positionPnls.length > 0
      ? positionPnls.reduce((a, b) => (a.pct > b.pct ? a : b))
      : null;
    const worst = positionPnls.length > 0
      ? positionPnls.reduce((a, b) => (a.pct < b.pct ? a : b))
      : null;

    // Diversification score: 1 - HHI (Herfindahl-Hirschman Index)
    const weights = positionPnls.map((p) =>
      totalValue > 0 ? p.value / totalValue : 0
    );
    const hhi = weights.reduce((s, w) => s + w * w, 0);
    const diversScore = positions.length > 0 ? Math.round((1 - hhi) * 100) : 0;

    return {
      totalValue,
      totalCost,
      totalPnl,
      totalPct,
      dailyChangePct,
      positionPnls,
      best,
      worst,
      diversScore,
    };
  }, [positions]);

  function handleAddPosition() {
    const sym = newSym.trim().toUpperCase();
    const amount = parseFloat(newAmount);
    const entry = parseFloat(newEntry);
    if (!sym || isNaN(amount) || isNaN(entry) || amount <= 0 || entry <= 0)
      return;

    const existing = positions.find((p) => p.sym === sym);
    if (existing) {
      // Average up/down
      const totalAmount = existing.amount + amount;
      const avgEntry =
        (existing.entry * existing.amount + entry * amount) / totalAmount;
      setPositions((prev) =>
        prev.map((p) =>
          p.sym === sym
            ? { ...p, amount: totalAmount, entry: avgEntry }
            : p
        )
      );
    } else {
      setPositions((prev) => [
        ...prev,
        { sym, name: sym, amount, entry, current: entry },
      ]);
    }

    setNewSym("");
    setNewAmount("");
    setNewEntry("");
  }

  function handleRemovePosition(sym: string) {
    setPositions((prev) => prev.filter((p) => p.sym !== sym));
  }

  // Donut slices
  const donutSlices = positions.map((p, i) => ({
    label: p.sym,
    value: p.current * p.amount,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold">Portföy</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Pozisyon takibi ve kâr/zarar analizi
          </p>
        </div>
        <button
          onClick={async () => {
            try {
              const res = await fetch("http://localhost:8000/api/reports/pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
              });
              if (res.ok) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `nexia-portfoy-raporu-${new Date().toISOString().slice(0, 10)}.pdf`;
                a.click();
                URL.revokeObjectURL(url);
              }
            } catch { /* backend offline */ }
          }}
          className="h-8 px-3 flex items-center gap-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[12px] font-medium transition-colors"
        >
          <Package className="w-3.5 h-3.5" />
          PDF İndir
        </button>
      </div>

      {/* Add Stock Section */}
      <div className="rounded-lg border border-border/50 p-4 bg-muted/5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-md bg-emerald-500/10 flex items-center justify-center">
            <Plus className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-[13px] font-medium">Hisse Ekle</p>
        </div>
        <div className="flex items-end gap-3 flex-wrap">
          <div className="flex-1 min-w-[120px]">
            <label className="text-[11px] text-muted-foreground mb-1 block">
              Sembol
            </label>
            <Input
              placeholder="orn: THYAO"
              className="h-9 text-[13px] bg-muted/30 border-border/50 font-mono"
              value={newSym}
              onChange={(e) => setNewSym(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddPosition()}
            />
          </div>
          <div className="w-28">
            <label className="text-[11px] text-muted-foreground mb-1 block">
              Adet
            </label>
            <Input
              type="number"
              placeholder="500"
              className="h-9 text-[13px] bg-muted/30 border-border/50 font-mono"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddPosition()}
            />
          </div>
          <div className="w-32">
            <label className="text-[11px] text-muted-foreground mb-1 block">
              Alis Fiyati (TL)
            </label>
            <Input
              type="number"
              placeholder="150.00"
              step="0.01"
              className="h-9 text-[13px] bg-muted/30 border-border/50 font-mono"
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddPosition()}
            />
          </div>
          <Button
            onClick={handleAddPosition}
            className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Satin Al
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={Wallet}
          label="Toplam Deger"
          value={formatCurrency(metrics.totalValue)}
          sub={`Maliyet: ${formatCurrency(metrics.totalCost)}`}
        />
        <SummaryCard
          icon={metrics.totalPnl >= 0 ? TrendingUp : TrendingDown}
          label="Toplam K/Z"
          value={`${metrics.totalPnl >= 0 ? "+" : ""}${formatCurrency(metrics.totalPnl)}`}
          valueColor={metrics.totalPnl >= 0 ? "text-emerald-400" : "text-red-400"}
          sub={`${metrics.totalPct >= 0 ? "+" : ""}${metrics.totalPct.toFixed(2)}%`}
          subColor={metrics.totalPct >= 0 ? "text-emerald-400/70" : "text-red-400/70"}
        />
        <SummaryCard
          icon={BarChart3}
          label="Gunluk Degisim"
          value={`${metrics.dailyChangePct >= 0 ? "+" : ""}${metrics.dailyChangePct.toFixed(2)}%`}
          valueColor={
            metrics.dailyChangePct >= 0 ? "text-emerald-400" : "text-red-400"
          }
          sub="Son islem gunune gore"
        />
        <SummaryCard
          icon={Package}
          label="Pozisyon Sayisi"
          value={positions.length.toString()}
          sub={`${positions.filter((p) => p.current >= p.entry).length} karda, ${positions.filter((p) => p.current < p.entry).length} zararda`}
        />
      </div>

      {/* Donut Chart + Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Donut */}
        <div className="rounded-lg border border-border/50 p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-4 h-4 text-muted-foreground" />
            <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
              Portfoy Dagilimi
            </p>
          </div>
          {positions.length > 0 ? (
            <DonutChart slices={donutSlices} />
          ) : (
            <p className="text-[13px] text-muted-foreground py-8 text-center">
              Henuz pozisyon yok
            </p>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="rounded-lg border border-border/50 p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-muted-foreground" />
            <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
              Performans Metrikleri
            </p>
          </div>

          {/* Diversification Score */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px] text-muted-foreground">
                Diversifikasyon Skoru
              </span>
              <span className="text-[13px] font-mono font-semibold">
                {metrics.diversScore}/100
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${metrics.diversScore}%`,
                  backgroundColor:
                    metrics.diversScore >= 70
                      ? "#10b981"
                      : metrics.diversScore >= 40
                        ? "#f59e0b"
                        : "#ef4444",
                }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground/60 mt-1">
              {metrics.diversScore >= 70
                ? "Iyi cesitlendirilmis portfoy"
                : metrics.diversScore >= 40
                  ? "Orta duzey cesitlendirme"
                  : "Dusuk cesitlendirme - daha fazla pozisyon ekleyin"}
            </p>
          </div>

          {/* Best / Worst */}
          {metrics.best && (
            <div className="flex items-start gap-3 rounded-md bg-emerald-500/5 border border-emerald-500/10 p-3">
              <TrendingUp className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] text-emerald-400/70 font-medium">
                  En Iyi Performans
                </p>
                <p className="text-[14px] font-mono font-semibold text-emerald-400">
                  {metrics.best.sym}{" "}
                  <span className="text-[12px]">
                    +{metrics.best.pct.toFixed(2)}%
                  </span>
                </p>
                <p className="text-[11px] text-muted-foreground">
                  K/Z: {formatCurrencyDetailed(metrics.best.pnl)}
                </p>
              </div>
            </div>
          )}

          {metrics.worst && (
            <div className="flex items-start gap-3 rounded-md bg-red-500/5 border border-red-500/10 p-3">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] text-red-400/70 font-medium">
                  En Kotu Performans
                </p>
                <p className="text-[14px] font-mono font-semibold text-red-400">
                  {metrics.worst.sym}{" "}
                  <span className="text-[12px]">
                    {metrics.worst.pct.toFixed(2)}%
                  </span>
                </p>
                <p className="text-[11px] text-muted-foreground">
                  K/Z: {formatCurrencyDetailed(metrics.worst.pnl)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Positions Table */}
      <div className="rounded-lg border border-border/50 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border/40 bg-muted/20 flex items-center justify-between">
          <p className="text-[12px] font-medium text-muted-foreground">
            Pozisyonlar ({positions.length})
          </p>
        </div>
        {positions.length === 0 ? (
          <div className="px-4 py-12 text-center text-[13px] text-muted-foreground">
            Henuz pozisyon eklenmedi. Yukaridaki formu kullanarak hisse ekleyin.
          </div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border/40 bg-muted/20 text-muted-foreground text-[11px]">
                <th className="text-left font-medium px-4 py-2.5">Hisse</th>
                <th className="text-right font-medium px-4 py-2.5">Adet</th>
                <th className="text-right font-medium px-4 py-2.5">
                  Giris Fiyati
                </th>
                <th className="text-right font-medium px-4 py-2.5">
                  Guncel Fiyat
                </th>
                <th className="text-right font-medium px-4 py-2.5">
                  Piyasa Degeri
                </th>
                <th className="text-right font-medium px-4 py-2.5">K/Z</th>
                <th className="text-right font-medium px-4 py-2.5">%</th>
                <th className="text-right font-medium px-4 py-2.5 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {positions.map((p, i) => {
                const pnl = (p.current - p.entry) * p.amount;
                const pct = ((p.current - p.entry) / p.entry) * 100;
                const up = pnl >= 0;
                const marketValue = p.current * p.amount;
                return (
                  <tr
                    key={p.sym}
                    className={`transition-colors hover:bg-muted/30 ${
                      i % 2 === 1 ? "bg-muted/10" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{
                            backgroundColor: COLORS[i % COLORS.length],
                          }}
                        />
                        <span className="font-mono font-medium">{p.sym}</span>
                        <span className="text-muted-foreground text-[11px] hidden sm:inline">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="text-right font-mono px-4 py-3">
                      {p.amount.toLocaleString("tr-TR")}
                    </td>
                    <td className="text-right font-mono px-4 py-3 text-muted-foreground">
                      {p.entry.toFixed(2)}
                    </td>
                    <td className="text-right font-mono px-4 py-3">
                      {p.current.toFixed(2)}
                    </td>
                    <td className="text-right font-mono px-4 py-3 text-muted-foreground">
                      {formatCurrency(marketValue)}
                    </td>
                    <td
                      className={`text-right font-mono px-4 py-3 ${
                        up ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {up ? "+" : ""}
                      {formatCurrencyDetailed(pnl)}
                    </td>
                    <td className="text-right px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-0.5 font-mono text-[12px] ${
                          up ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {up ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {up ? "+" : ""}
                        {pct.toFixed(2)}%
                      </span>
                    </td>
                    <td className="text-right px-4 py-3">
                      <button
                        onClick={() => handleRemovePosition(p.sym)}
                        className="inline-flex items-center gap-1 text-[11px] text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-md px-2 py-1 transition-colors"
                        title="Pozisyonu sat"
                      >
                        <Trash2 className="w-3 h-3" />
                        Sat
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Table footer with totals */}
            <tfoot>
              <tr className="border-t border-border/40 bg-muted/20 text-[12px] font-medium">
                <td className="px-4 py-2.5 text-muted-foreground">Toplam</td>
                <td className="text-right font-mono px-4 py-2.5">
                  {positions
                    .reduce((s, p) => s + p.amount, 0)
                    .toLocaleString("tr-TR")}
                </td>
                <td className="px-4 py-2.5" />
                <td className="px-4 py-2.5" />
                <td className="text-right font-mono px-4 py-2.5">
                  {formatCurrency(metrics.totalValue)}
                </td>
                <td
                  className={`text-right font-mono px-4 py-2.5 ${
                    metrics.totalPnl >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {metrics.totalPnl >= 0 ? "+" : ""}
                  {formatCurrencyDetailed(metrics.totalPnl)}
                </td>
                <td
                  className={`text-right font-mono px-4 py-2.5 ${
                    metrics.totalPct >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {metrics.totalPct >= 0 ? "+" : ""}
                  {metrics.totalPct.toFixed(2)}%
                </td>
                <td className="px-4 py-2.5" />
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}

// --- Summary Card ---

function SummaryCard({
  icon: Icon,
  label,
  value,
  valueColor,
  sub,
  subColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueColor?: string;
  sub?: string;
  subColor?: string;
}) {
  return (
    <div className="rounded-lg border border-border/50 px-5 py-4 space-y-1">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-muted-foreground/60" />
        <p className="text-[11px] text-muted-foreground font-medium">{label}</p>
      </div>
      <p className={`text-2xl font-bold font-mono ${valueColor || ""}`}>
        {value}
      </p>
      {sub && (
        <p className={`text-[11px] ${subColor || "text-muted-foreground/60"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}
