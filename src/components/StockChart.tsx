"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";

interface StockChartProps {
  symbol: string;
  data?: { time: string; close: number }[];
}

const PERIODS: { label: string; value: string }[] = [
  { label: "1H", value: "5d" },
  { label: "1A", value: "1mo" },
  { label: "3A", value: "3mo" },
  { label: "6A", value: "6mo" },
  { label: "1Y", value: "1y" },
];

export function StockChart({ symbol, data: externalData }: StockChartProps) {
  const [activePeriod, setActivePeriod] = useState("3mo");
  const [liveData, setLiveData] = useState<{ time: string; close: number }[] | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch real data from API
  useEffect(() => {
    let cancelled = false;
    api.getHistorical(symbol, activePeriod)
      .then((res) => {
        if (!cancelled && res.data?.length) {
          setLiveData(res.data.map((d) => ({ time: d.time, close: d.close })));
        }
      })
      .catch(() => {
        if (!cancelled) setLiveData(null);
      });
    return () => { cancelled = true; };
  }, [symbol, activePeriod]);

  const chartData = externalData || liveData || generateDemoData(symbol, 90);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || chartData.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = container.clientWidth;
    const h = container.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    const pad = { top: 16, right: 56, bottom: 24, left: 52 };
    const cw = w - pad.left - pad.right;
    const ch = h - pad.top - pad.bottom;

    const closes = chartData.map((d) => d.close);
    const min = Math.min(...closes) * 0.997;
    const max = Math.max(...closes) * 1.003;
    const range = max - min;
    const isUp = closes[closes.length - 1] >= closes[0];

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (ch / 4) * i;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
      const price = max - (range / 4) * i;
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.font = "10px monospace";
      ctx.textAlign = "right";
      ctx.fillText(price.toFixed(1), pad.left - 6, y + 3);
    }

    // Area
    const toX = (i: number) => pad.left + (i / (chartData.length - 1)) * cw;
    const toY = (v: number) => pad.top + ((max - v) / range) * ch;

    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch);
    grad.addColorStop(0, isUp ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)");
    grad.addColorStop(1, "rgba(0,0,0,0)");

    ctx.beginPath();
    chartData.forEach((d, i) => (i === 0 ? ctx.moveTo(toX(i), toY(d.close)) : ctx.lineTo(toX(i), toY(d.close))));
    ctx.lineTo(toX(chartData.length - 1), pad.top + ch);
    ctx.lineTo(pad.left, pad.top + ch);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    chartData.forEach((d, i) => (i === 0 ? ctx.moveTo(toX(i), toY(d.close)) : ctx.lineTo(toX(i), toY(d.close))));
    ctx.strokeStyle = isUp ? "#10b981" : "#ef4444";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Current price dashed line
    const lastClose = closes[closes.length - 1];
    const ly = toY(lastClose);
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = isUp ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad.left, ly); ctx.lineTo(w - pad.right, ly); ctx.stroke();
    ctx.setLineDash([]);

    // Price label
    ctx.fillStyle = isUp ? "#10b981" : "#ef4444";
    const labelW = 52;
    ctx.fillRect(w - pad.right, ly - 9, labelW, 18);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "left";
    ctx.fillText(lastClose.toFixed(2), w - pad.right + 4, ly + 3);

    // Date labels
    const step = Math.max(1, Math.floor(chartData.length / 6));
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.font = "9px monospace";
    ctx.textAlign = "center";
    for (let i = 0; i < chartData.length; i += step) {
      const d = new Date(chartData[i].time);
      ctx.fillText(`${d.getDate()}/${d.getMonth() + 1}`, toX(i), h - 4);
    }
  }, [chartData]);

  const lastClose = chartData[chartData.length - 1]?.close ?? 0;
  const firstClose = chartData[0]?.close ?? 0;
  const changePct = firstClose ? ((lastClose - firstClose) / firstClose * 100) : 0;
  const isUp = changePct >= 0;

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 bg-muted/10">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-sm font-semibold">{symbol.replace(".IS", "")}</span>
          <span className="font-mono text-lg font-bold">{lastClose.toFixed(2)}</span>
          <span className={`font-mono text-[12px] ${isUp ? "text-emerald-400" : "text-red-400"}`}>
            {isUp ? "+" : ""}{changePct.toFixed(2)}%
          </span>
        </div>
        <div className="flex gap-0.5 bg-muted/30 rounded-md p-0.5">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                activePeriod === p.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActivePeriod(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="h-[260px] w-full bg-background">
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>
    </div>
  );
}

function generateDemoData(symbol: string, days: number) {
  const seed = symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  let price = 100 + (seed % 300);
  const data = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const change = (Math.random() - 0.48) * 0.02 * price;
    price = Math.max(price + change, 1);
    data.push({ time: date.toISOString().split("T")[0], close: price });
  }
  return data;
}
