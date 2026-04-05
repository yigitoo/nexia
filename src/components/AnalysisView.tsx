"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import type { IndicatorSeries } from "@/lib/api";

type Panel = "rsi" | "macd" | "bollinger" | "stochastic" | "adx" | "atr" | "cci" | "williams" | "aroon" | "volume";

const PANELS: { id: Panel; label: string }[] = [
  { id: "rsi", label: "RSI" },
  { id: "macd", label: "MACD" },
  { id: "bollinger", label: "Bollinger" },
  { id: "volume", label: "Hacim" },
  { id: "stochastic", label: "Stochastic" },
  { id: "adx", label: "ADX" },
  { id: "atr", label: "ATR" },
  { id: "cci", label: "CCI" },
  { id: "williams", label: "Williams %R" },
  { id: "aroon", label: "Aroon" },
];

const PERIODS = [
  { label: "1A", value: "1mo" },
  { label: "3A", value: "3mo" },
  { label: "6A", value: "6mo" },
  { label: "1Y", value: "1y" },
];

export function AnalysisView() {
  const [symbol, setSymbol] = useState("THYAO.IS");
  const [searchInput, setSearchInput] = useState("");
  const [period, setPeriod] = useState("6mo");
  const [data, setData] = useState<IndicatorSeries | null>(null);
  const [loading, setLoading] = useState(false);
  const [activePanel, setActivePanel] = useState<Panel>("rsi");

  const loadData = useCallback(async (sym: string, per: string) => {
    setLoading(true);
    try {
      const res = await api.getIndicatorSeries(sym, per);
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(symbol, period); }, [symbol, period, loadData]);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchInput.trim()) {
      const sym = searchInput.toUpperCase().includes(".IS") ? searchInput.toUpperCase() : `${searchInput.toUpperCase()}.IS`;
      setSymbol(sym);
      setSearchInput("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between h-14 px-6 border-b border-border/40 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold">Teknik Analiz</h1>
          <span className="font-mono text-[13px] text-emerald-400 font-medium">{symbol.replace(".IS", "")}</span>
          {data && <span className="font-mono text-[13px]">{data.close[data.close.length - 1]?.toFixed(2)}</span>}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Hisse (ör: GARAN)"
              className="pl-8 h-8 w-40 text-[13px] bg-muted/30 border-border/50"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
          <div className="flex gap-0.5 bg-muted/30 rounded-md p-0.5">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${period === p.value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setPeriod(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
          {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
        </div>
      </div>

      {/* Indicator tabs */}
      <div className="flex items-center gap-0.5 px-6 border-b border-border/30 overflow-x-auto shrink-0">
        {PANELS.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePanel(p.id)}
            className={`px-3 py-2 text-[11px] font-medium whitespace-nowrap transition-colors relative ${activePanel === p.id ? "text-emerald-400" : "text-muted-foreground hover:text-foreground"}`}
          >
            {p.label}
            {activePanel === p.id && (
              <span className="absolute bottom-0 left-1 right-1 h-[2px] rounded-full bg-emerald-400" />
            )}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="flex-1 min-h-0 p-6 space-y-4 overflow-y-auto">
        {data ? (
          <>
            <PriceChart data={data} overlays={activePanel === "bollinger" ? ["bollinger"] : ["sma"]} />
            <IndicatorChart data={data} panel={activePanel} />
            <SummaryBar data={data} />
          </>
        ) : !loading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-[13px]">
            Backend bağlantısı gerekli veya veri bulunamadı
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────── */
/*  Price Chart with overlays                */
/* ────────────────────────────────────────── */

function PriceChart({ data, overlays }: { data: IndicatorSeries; overlays: string[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = container.clientWidth;
    const h = container.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    const pad = { top: 12, right: 56, bottom: 20, left: 52 };
    const cw = w - pad.left - pad.right;
    const ch = h - pad.top - pad.bottom;
    const close = data.close;
    const n = close.length;

    // Compute bounds including overlays
    let allVals = [...close];
    if (overlays.includes("bollinger") && data.bb_upper) {
      data.bb_upper.forEach(v => { if (v != null) allVals.push(v); });
      data.bb_lower?.forEach(v => { if (v != null) allVals.push(v); });
    }
    const min = Math.min(...allVals) * 0.998;
    const max = Math.max(...allVals) * 1.002;
    const range = max - min;

    const toX = (i: number) => pad.left + (i / (n - 1)) * cw;
    const toY = (v: number) => pad.top + ((max - v) / range) * ch;

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)"; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (ch / 4) * i;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.font = "10px monospace"; ctx.textAlign = "right";
      ctx.fillText((max - (range / 4) * i).toFixed(1), pad.left - 6, y + 3);
    }

    // Bollinger bands fill
    if (overlays.includes("bollinger") && data.bb_upper && data.bb_lower) {
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < n; i++) {
        const v = data.bb_upper[i];
        if (v == null) continue;
        if (!started) { ctx.moveTo(toX(i), toY(v)); started = true; }
        else ctx.lineTo(toX(i), toY(v));
      }
      for (let i = n - 1; i >= 0; i--) {
        const v = data.bb_lower?.[i];
        if (v != null) ctx.lineTo(toX(i), toY(v));
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(99,102,241,0.06)";
      ctx.fill();

      drawLine(ctx, data.bb_upper, n, toX, toY, "rgba(99,102,241,0.3)", 1);
      drawLine(ctx, data.bb_lower, n, toX, toY, "rgba(99,102,241,0.3)", 1);
      drawLine(ctx, data.bb_middle || [], n, toX, toY, "rgba(99,102,241,0.15)", 1);
    }

    // SMA/EMA overlays
    if (overlays.includes("sma")) {
      drawLine(ctx, data.sma_20, n, toX, toY, "#f59e0b", 1);
      drawLine(ctx, data.sma_50, n, toX, toY, "#8b5cf6", 1);
      drawLine(ctx, data.ema_20, n, toX, toY, "#06b6d4", 1);
    }

    // Price line
    const isUp = close[n - 1] >= close[0];
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch);
    grad.addColorStop(0, isUp ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.beginPath();
    close.forEach((v, i) => (i === 0 ? ctx.moveTo(toX(i), toY(v)) : ctx.lineTo(toX(i), toY(v))));
    ctx.lineTo(toX(n - 1), pad.top + ch); ctx.lineTo(pad.left, pad.top + ch);
    ctx.closePath(); ctx.fillStyle = grad; ctx.fill();

    ctx.beginPath();
    close.forEach((v, i) => (i === 0 ? ctx.moveTo(toX(i), toY(v)) : ctx.lineTo(toX(i), toY(v))));
    ctx.strokeStyle = isUp ? "#10b981" : "#ef4444"; ctx.lineWidth = 1.5; ctx.stroke();

    // Current price
    const ly = toY(close[n - 1]);
    ctx.fillStyle = isUp ? "#10b981" : "#ef4444";
    ctx.fillRect(w - pad.right, ly - 9, 54, 18);
    ctx.fillStyle = "#fff"; ctx.font = "bold 10px monospace"; ctx.textAlign = "left";
    ctx.fillText(close[n - 1].toFixed(2), w - pad.right + 4, ly + 3);

    // Date labels
    const step = Math.max(1, Math.floor(n / 6));
    ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.font = "9px monospace"; ctx.textAlign = "center";
    for (let i = 0; i < n; i += step) {
      const d = new Date(data.dates[i]);
      ctx.fillText(`${d.getDate()}/${d.getMonth() + 1}`, toX(i), h - 3);
    }
  }, [data, overlays]);

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <div className="px-4 py-2 border-b border-border/30 bg-muted/10 flex items-center gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full inline-block ${data.close[data.close.length - 1] >= data.close[0] ? "bg-emerald-400" : "bg-red-400"}`} />
          Fiyat
        </span>
        {overlays.includes("sma") && (
          <>
            <span className="flex items-center gap-1"><span className="w-3 h-px bg-amber-500 inline-block" /> SMA20</span>
            <span className="flex items-center gap-1"><span className="w-3 h-px bg-violet-500 inline-block" /> SMA50</span>
            <span className="flex items-center gap-1"><span className="w-3 h-px bg-cyan-500 inline-block" /> EMA20</span>
          </>
        )}
        {overlays.includes("bollinger") && (
          <span className="flex items-center gap-1"><span className="w-3 h-px bg-indigo-400 inline-block" /> Bollinger</span>
        )}
      </div>
      <div ref={containerRef} className="h-[320px] w-full bg-background">
        <canvas ref={ref} className="block w-full h-full" />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────── */
/*  Indicator sub-chart                      */
/* ────────────────────────────────────────── */

function IndicatorChart({ data, panel }: { data: IndicatorSeries; panel: Panel }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = container.clientWidth;
    const h = container.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    const pad = { top: 10, right: 56, bottom: 16, left: 52 };
    const cw = w - pad.left - pad.right;
    const ch = h - pad.top - pad.bottom;
    const n = data.dates.length;
    const toX = (i: number) => pad.left + (i / (n - 1)) * cw;

    ctx.clearRect(0, 0, w, h);

    // Get series + range based on panel
    let series1: (number | null)[] = [];
    let series2: (number | null)[] = [];
    let minV = 0, maxV = 100;
    let color1 = "#10b981", color2 = "#f59e0b";
    let refLines: { val: number; color: string; label: string }[] = [];
    let isHistogram = false;
    let histogramData: (number | null)[] = [];

    switch (panel) {
      case "rsi":
        series1 = data.rsi;
        refLines = [{ val: 70, color: "rgba(239,68,68,0.3)", label: "70" }, { val: 30, color: "rgba(16,185,129,0.3)", label: "30" }];
        break;
      case "macd":
        series1 = data.macd; series2 = data.macd_signal;
        histogramData = data.macd_histogram; isHistogram = true;
        color1 = "#10b981"; color2 = "#f59e0b";
        { const vals = [...series1, ...series2, ...histogramData].filter(v => v != null) as number[];
          minV = Math.min(...vals); maxV = Math.max(...vals); }
        refLines = [{ val: 0, color: "rgba(255,255,255,0.1)", label: "0" }];
        break;
      case "stochastic":
        series1 = data.stoch_k || []; series2 = data.stoch_d || [];
        refLines = [{ val: 80, color: "rgba(239,68,68,0.3)", label: "80" }, { val: 20, color: "rgba(16,185,129,0.3)", label: "20" }];
        color1 = "#06b6d4"; color2 = "#f59e0b";
        break;
      case "adx":
        series1 = data.adx;
        refLines = [{ val: 25, color: "rgba(245,158,11,0.3)", label: "25" }];
        { const vals = series1.filter(v => v != null) as number[];
          minV = Math.min(0, ...vals); maxV = Math.max(50, ...vals); }
        break;
      case "atr":
        series1 = data.atr;
        { const vals = series1.filter(v => v != null) as number[];
          minV = Math.min(...vals) * 0.9; maxV = Math.max(...vals) * 1.1; }
        color1 = "#8b5cf6";
        break;
      case "cci":
        series1 = data.cci || [];
        refLines = [{ val: 100, color: "rgba(239,68,68,0.3)", label: "100" }, { val: -100, color: "rgba(16,185,129,0.3)", label: "-100" }];
        { const vals = series1.filter(v => v != null) as number[];
          minV = Math.min(-200, ...vals); maxV = Math.max(200, ...vals); }
        break;
      case "williams":
        series1 = data.williams_r || [];
        minV = -100; maxV = 0;
        refLines = [{ val: -20, color: "rgba(239,68,68,0.3)", label: "-20" }, { val: -80, color: "rgba(16,185,129,0.3)", label: "-80" }];
        color1 = "#ec4899";
        break;
      case "aroon":
        series1 = data.aroon_up || []; series2 = data.aroon_down || [];
        color1 = "#10b981"; color2 = "#ef4444";
        break;
      case "volume":
        series1 = data.volume.map(v => v);
        { const vals = series1.filter(v => v != null) as number[];
          minV = 0; maxV = Math.max(...vals) * 1.1; }
        isHistogram = true; histogramData = series1;
        series1 = [];
        color1 = "#6366f1";
        break;
      case "bollinger":
        series1 = data.rsi; // Show RSI under bollinger overlay
        refLines = [{ val: 70, color: "rgba(239,68,68,0.3)", label: "70" }, { val: 30, color: "rgba(16,185,129,0.3)", label: "30" }];
        break;
    }

    const range = maxV - minV || 1;
    const toY = (v: number) => pad.top + ((maxV - v) / range) * ch;

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)"; ctx.lineWidth = 1;
    for (let i = 0; i <= 2; i++) {
      const y = pad.top + (ch / 2) * i;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.font = "9px monospace"; ctx.textAlign = "right";
      ctx.fillText((maxV - (range / 2) * i).toFixed(panel === "atr" ? 4 : 1), pad.left - 6, y + 3);
    }

    // Reference lines
    for (const rl of refLines) {
      const y = toY(rl.val);
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = rl.color; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = rl.color; ctx.font = "9px monospace"; ctx.textAlign = "right";
      ctx.fillText(rl.label, pad.left - 6, y + 3);
    }

    // Histogram
    if (isHistogram && histogramData.length > 0) {
      const barW = Math.max(1, cw / n - 1);
      for (let i = 0; i < n; i++) {
        const v = histogramData[i];
        if (v == null) continue;
        const y0 = toY(0);
        const y1 = toY(v);
        ctx.fillStyle = panel === "volume"
          ? (i > 0 && data.close[i] >= data.close[i - 1] ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)")
          : (v >= 0 ? "rgba(16,185,129,0.5)" : "rgba(239,68,68,0.5)");
        ctx.fillRect(toX(i) - barW / 2, Math.min(y0, y1), barW, Math.abs(y1 - y0) || 1);
      }
    }

    // Lines
    if (series1.length > 0) drawLine(ctx, series1, n, toX, toY, color1, 1.5);
    if (series2.length > 0) drawLine(ctx, series2, n, toX, toY, color2, 1);

    // Current value
    const lastVal = [...series1].reverse().find(v => v != null);
    if (lastVal != null) {
      ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.font = "10px monospace"; ctx.textAlign = "left";
      ctx.fillText(lastVal.toFixed(panel === "atr" ? 4 : 2), w - pad.right + 4, toY(lastVal) + 3);
    }
  }, [data, panel]);

  const panelLabel = PANELS.find(p => p.id === panel)?.label || panel;

  // Compute current indicator value for tooltip
  const lastOf = (arr: (number | null)[]) => {
    for (let i = arr.length - 1; i >= 0; i--) if (arr[i] != null) return arr[i];
    return null;
  };
  let currentValue: string | null = null;
  let currentColor = "text-muted-foreground";
  switch (panel) {
    case "rsi": case "bollinger": {
      const v = lastOf(data.rsi);
      currentValue = v != null ? v.toFixed(1) : null;
      currentColor = v != null ? (v > 70 ? "text-red-400" : v < 30 ? "text-emerald-400" : "text-muted-foreground") : "text-muted-foreground";
      break;
    }
    case "macd": { const v = lastOf(data.macd); currentValue = v != null ? v.toFixed(4) : null; currentColor = (v ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"; break; }
    case "stochastic": { const v = lastOf(data.stoch_k || []); currentValue = v != null ? v.toFixed(1) : null; break; }
    case "adx": { const v = lastOf(data.adx); currentValue = v != null ? v.toFixed(1) : null; currentColor = (v ?? 0) > 25 ? "text-emerald-400" : "text-yellow-400"; break; }
    case "atr": { const v = lastOf(data.atr); currentValue = v != null ? v.toFixed(4) : null; currentColor = "text-violet-400"; break; }
    case "cci": { const v = lastOf(data.cci || []); currentValue = v != null ? v.toFixed(1) : null; currentColor = (v ?? 0) > 100 ? "text-red-400" : (v ?? 0) < -100 ? "text-emerald-400" : "text-muted-foreground"; break; }
    case "williams": { const v = lastOf(data.williams_r || []); currentValue = v != null ? v.toFixed(1) : null; currentColor = (v ?? -50) > -20 ? "text-red-400" : (v ?? -50) < -80 ? "text-emerald-400" : "text-muted-foreground"; break; }
    case "aroon": { const v = lastOf(data.aroon_up || []); currentValue = v != null ? v.toFixed(1) : null; break; }
    case "volume": { const v = lastOf(data.volume.map(x => x)); currentValue = v != null ? (v >= 1e6 ? (v / 1e6).toFixed(1) + "M" : (v / 1e3).toFixed(0) + "K") : null; break; }
  }

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <div className="px-4 py-2 border-b border-border/30 bg-muted/10 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="font-medium text-foreground">{panelLabel}</span>
          {panel === "macd" && (
            <>
              <span className="flex items-center gap-1"><span className="w-3 h-px bg-emerald-500 inline-block" /> MACD</span>
              <span className="flex items-center gap-1"><span className="w-3 h-px bg-amber-500 inline-block" /> Sinyal</span>
            </>
          )}
          {panel === "stochastic" && (
            <>
              <span className="flex items-center gap-1"><span className="w-3 h-px bg-cyan-500 inline-block" /> %K</span>
              <span className="flex items-center gap-1"><span className="w-3 h-px bg-amber-500 inline-block" /> %D</span>
            </>
          )}
          {panel === "aroon" && (
            <>
              <span className="flex items-center gap-1"><span className="w-3 h-px bg-emerald-500 inline-block" /> Up</span>
              <span className="flex items-center gap-1"><span className="w-3 h-px bg-red-500 inline-block" /> Down</span>
            </>
          )}
        </div>
        {currentValue != null && (
          <span className={`font-mono text-[12px] font-semibold ${currentColor} bg-muted/30 px-2 py-0.5 rounded`}>
            {currentValue}
          </span>
        )}
      </div>
      <div ref={containerRef} className="h-[200px] w-full bg-background">
        <canvas ref={ref} className="block w-full h-full" />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────── */
/*  Summary bar with current values          */
/* ────────────────────────────────────────── */

function SummaryBar({ data }: { data: IndicatorSeries }) {
  const n = data.dates.length;
  const last = (arr: (number | null)[]) => {
    for (let i = arr.length - 1; i >= 0; i--) if (arr[i] != null) return arr[i];
    return null;
  };

  const rsi = last(data.rsi);
  const macd = last(data.macd);
  const adx = last(data.adx);

  const rsiSignal = rsi == null ? "—" : rsi > 70 ? "Aşırı Alım" : rsi < 30 ? "Aşırı Satım" : "Nötr";
  const rsiColor = rsi == null ? "" : rsi > 70 ? "text-red-400" : rsi < 30 ? "text-emerald-400" : "text-muted-foreground";
  const trendSignal = adx == null ? "—" : adx > 25 ? "Güçlü Trend" : "Zayıf Trend";

  const items = [
    { label: "RSI", value: rsi?.toFixed(1) ?? "—", signal: rsiSignal, color: rsiColor },
    { label: "MACD", value: macd?.toFixed(4) ?? "—", signal: (macd ?? 0) > 0 ? "Yükseliş" : "Düşüş", color: (macd ?? 0) > 0 ? "text-emerald-400" : "text-red-400" },
    { label: "ADX", value: adx?.toFixed(1) ?? "—", signal: trendSignal, color: (adx ?? 0) > 25 ? "text-emerald-400" : "text-yellow-400" },
    { label: "SMA20", value: last(data.sma_20)?.toFixed(2) ?? "—", signal: data.close[n - 1] > (last(data.sma_20) ?? 0) ? "Üstünde" : "Altında", color: data.close[n - 1] > (last(data.sma_20) ?? 0) ? "text-emerald-400" : "text-red-400" },
    { label: "ATR", value: last(data.atr)?.toFixed(4) ?? "—", signal: "", color: "" },
  ];

  const signalBadgeBg = (color: string) => {
    if (color.includes("emerald")) return "bg-emerald-500/10 border-emerald-500/20";
    if (color.includes("red")) return "bg-red-500/10 border-red-500/20";
    if (color.includes("yellow")) return "bg-yellow-500/10 border-yellow-500/20";
    return "bg-muted/20 border-border/30";
  };

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden bg-muted/5">
      <div className="px-4 py-1.5 border-b border-border/30 bg-muted/10">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Ozet Gostergeler</span>
      </div>
      <div className="flex divide-x divide-border/30">
        {items.map((item) => (
          <div key={item.label} className="flex-1 px-4 py-3">
            <p className="text-[10px] text-muted-foreground font-medium">{item.label}</p>
            <p className="text-[13px] font-mono font-semibold mt-1">{item.value}</p>
            {item.signal && (
              <span className={`inline-block mt-1.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${item.color} ${signalBadgeBg(item.color)}`}>
                {item.signal}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────── */
/*  Helpers                                  */
/* ────────────────────────────────────────── */

function drawLine(
  ctx: CanvasRenderingContext2D,
  series: (number | null)[],
  n: number,
  toX: (i: number) => number,
  toY: (v: number) => number,
  color: string,
  width: number,
) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  let started = false;
  for (let i = 0; i < n; i++) {
    const v = series[i];
    if (v == null) { started = false; continue; }
    if (!started) { ctx.moveTo(toX(i), toY(v)); started = true; }
    else ctx.lineTo(toX(i), toY(v));
  }
  ctx.stroke();
}
