"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Activity,
  BarChart3,
  LineChart,
  Layers,
  Zap,
  Atom,
  Brain,
  Waves,
  Search,
  Loader2,
  TrendingDown,
  Shield,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import type { RiskData } from "@/lib/api";

/* ─── Tool definitions ──────────────────────────────────────── */

interface ToolDef {
  title: string;
  desc: string;
  icon: React.ElementType;
  action: string;
  color: string; // tailwind color token, e.g. "emerald"
}

const QUANT_TOOLS: ToolDef[] = [
  { title: "Monte Carlo Simulasyonu", desc: "GBM ile 10.000 senaryo portfoy risk tahmini", icon: BarChart3, action: "monte_carlo", color: "emerald" },
  { title: "Value at Risk (VaR)", desc: "Parametrik ve tarihsel VaR/CVaR hesaplama", icon: Activity, action: "risk", color: "cyan" },
  { title: "GARCH Volatilite", desc: "GARCH(1,1), EGARCH, GJR-GARCH modelleri", icon: LineChart, action: "garch", color: "violet" },
  { title: "Rejim Tespiti", desc: "Hidden Markov Model ile boga/ayi rejim tespiti", icon: Layers, action: "regime", color: "amber" },
];

const STOCHASTIC_TOOLS: ToolDef[] = [
  { title: "Ornstein-Uhlenbeck", desc: "Ortalamaya donus sureci — faiz, spread modelleme", icon: Waves, action: "ou", color: "sky" },
  { title: "Jump Diffusion (Merton)", desc: "Ani piyasa soklarini modelleyen sicrama difuzyonu", icon: Zap, action: "jump", color: "orange" },
  { title: "Heston Stokastik Vol.", desc: "Stokastik volatilite — vol gulumsemesi modelleme", icon: LineChart, action: "heston", color: "rose" },
  { title: "Fraksiyonel Brown Hareketi", desc: "Hurst usteli ile uzun hafiza / trend analizi", icon: Waves, action: "fbm", color: "indigo" },
];

const CHAOS_TOOLS: ToolDef[] = [
  { title: "Lyapunov Usteli", desc: "Baslangic kosullarina hassasiyet — kaos tespiti", icon: Atom, action: "chaos", color: "red" },
  { title: "Korelasyon Boyutu", desc: "Grassberger-Procaccia fraktal boyut tahmini", icon: Layers, action: "chaos", color: "fuchsia" },
  { title: "Entropi Analizi", desc: "Shannon, yaklasik ve ornek entropi olcumleri", icon: Brain, action: "entropy", color: "teal" },
  { title: "Faz Uzayi Yeniden Insasi", desc: "Takens gomme teoremi ile cekici analizi", icon: Atom, action: "chaos", color: "lime" },
];

/* ─── Color utility ─────────────────────────────────────────── */

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; ring: string }> = {
  emerald: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30", ring: "ring-emerald-500/20" },
  cyan:    { bg: "bg-cyan-500/15",    text: "text-cyan-400",    border: "border-cyan-500/30",    ring: "ring-cyan-500/20" },
  violet:  { bg: "bg-violet-500/15",  text: "text-violet-400",  border: "border-violet-500/30",  ring: "ring-violet-500/20" },
  amber:   { bg: "bg-amber-500/15",   text: "text-amber-400",   border: "border-amber-500/30",   ring: "ring-amber-500/20" },
  sky:     { bg: "bg-sky-500/15",     text: "text-sky-400",     border: "border-sky-500/30",     ring: "ring-sky-500/20" },
  orange:  { bg: "bg-orange-500/15",  text: "text-orange-400",  border: "border-orange-500/30",  ring: "ring-orange-500/20" },
  rose:    { bg: "bg-rose-500/15",    text: "text-rose-400",    border: "border-rose-500/30",    ring: "ring-rose-500/20" },
  indigo:  { bg: "bg-indigo-500/15",  text: "text-indigo-400",  border: "border-indigo-500/30",  ring: "ring-indigo-500/20" },
  red:     { bg: "bg-red-500/15",     text: "text-red-400",     border: "border-red-500/30",     ring: "ring-red-500/20" },
  fuchsia: { bg: "bg-fuchsia-500/15", text: "text-fuchsia-400", border: "border-fuchsia-500/30", ring: "ring-fuchsia-500/20" },
  teal:    { bg: "bg-teal-500/15",    text: "text-teal-400",    border: "border-teal-500/30",    ring: "ring-teal-500/20" },
  lime:    { bg: "bg-lime-500/15",    text: "text-lime-400",    border: "border-lime-500/30",    ring: "ring-lime-500/20" },
};

function colors(c: string) {
  return COLOR_MAP[c] ?? COLOR_MAP.emerald;
}

/* ─── Number formatting helper ──────────────────────────────── */

function fmt(value: number | undefined | null, opts?: { percent?: boolean; decimals?: number }): string {
  if (value == null || isNaN(value)) return "—";
  const d = opts?.decimals ?? 2;
  const n = opts?.percent ? value * 100 : value;
  const formatted = n.toFixed(d);
  return opts?.percent ? `${formatted}%` : formatted;
}

/* ─── Main component ────────────────────────────────────────── */

export function RiskView() {
  const [symbol, setSymbol] = useState("THYAO.IS");
  const [searchInput, setSearchInput] = useState("");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [riskSummary, setRiskSummary] = useState<RiskData | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  /* Fetch summary risk metrics whenever symbol changes */
  const loadSummary = useCallback(async (sym: string) => {
    setSummaryLoading(true);
    try {
      const data = await api.getRisk(sym);
      setRiskSummary(data);
    } catch {
      setRiskSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary(symbol);
  }, [symbol, loadSummary]);

  /* Symbol search handler */
  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchInput.trim()) {
      const sym = searchInput.toUpperCase().includes(".IS")
        ? searchInput.toUpperCase()
        : `${searchInput.toUpperCase()}.IS`;
      setSymbol(sym);
      setSearchInput("");
      setResult(null);
      setActiveAction(null);
    }
  };

  /* Run a quant model */
  async function runAnalysis(action: string) {
    setLoading(true);
    setActiveAction(action);
    setResult(null);
    try {
      let data;
      switch (action) {
        case "monte_carlo":
          data = await api.monteCarlo(symbol); break;
        case "garch":
          data = await api.garch(symbol); break;
        case "risk":
          data = await api.getRisk(symbol); break;
        case "chaos":
          data = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/quant/chaos`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symbol }),
          }).then(r => r.json()); break;
        case "entropy":
          data = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/quant/entropy`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symbol }),
          }).then(r => r.json()); break;
        case "ou":
          data = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/quant/ou`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symbol }),
          }).then(r => r.json()); break;
        case "jump":
          data = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/quant/jump-diffusion`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symbol }),
          }).then(r => r.json()); break;
        case "heston":
          data = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/quant/heston`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symbol }),
          }).then(r => r.json()); break;
        default:
          data = { message: "Bu modul yakinda aktif olacak" };
      }
      setResult(data as Record<string, unknown>);
    } catch {
      setResult({ error: "Backend baglantisi gerekli" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* ── Toolbar ────────────────────────────────── */}
      <div className="flex items-center justify-between h-14 px-6 border-b border-border/40 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold">Kantitatif Analiz</h1>
          <span className="font-mono text-[13px] text-emerald-400 font-medium">
            {symbol.replace(".IS", "")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Sembol ara (orn: GARAN)"
              className="pl-8 h-8 w-48 text-[13px] bg-muted/30 border-border/50"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
          {(loading || summaryLoading) && (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>

      {/* ── Content ────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6">
        {/* ── Summary stat cards ──────────────────── */}
        <SummaryPanel data={riskSummary} loading={summaryLoading} />

        {/* ── Model sections ─────────────────────── */}
        <Section
          title="Klasik Risk Modelleri"
          items={QUANT_TOOLS}
          onRun={runAnalysis}
          activeAction={activeAction}
          loading={loading}
        />
        <Section
          title="Stokastik Surecler"
          items={STOCHASTIC_TOOLS}
          onRun={runAnalysis}
          activeAction={activeAction}
          loading={loading}
        />
        <Section
          title="Kaos Teorisi"
          items={CHAOS_TOOLS}
          onRun={runAnalysis}
          activeAction={activeAction}
          loading={loading}
        />

        {/* ── Result card ────────────────────────── */}
        {result && <ResultCard result={result} action={activeAction} />}
      </div>
    </div>
  );
}

/* ─── Summary Panel ─────────────────────────────────────────── */

function SummaryPanel({ data, loading }: { data: RiskData | null; loading: boolean }) {
  const stats = [
    {
      label: "Sharpe Orani",
      value: fmt(data?.sharpe_ratio),
      icon: TrendingDown,
      good: (data?.sharpe_ratio ?? 0) > 1,
    },
    {
      label: "Sortino Orani",
      value: fmt(data?.sortino_ratio),
      icon: Shield,
      good: (data?.sortino_ratio ?? 0) > 1.5,
    },
    {
      label: "VaR (%95)",
      value: fmt(data?.var_95, { percent: true }),
      icon: AlertTriangle,
      good: Math.abs(data?.var_95 ?? 0) < 0.03,
    },
    {
      label: "Maks. Dusus",
      value: fmt(data?.max_drawdown, { percent: true }),
      icon: Activity,
      good: Math.abs(data?.max_drawdown ?? 0) < 0.2,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="rounded-xl border border-border/50 bg-muted/10 p-4 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                {s.label}
              </span>
              <Icon className="w-3.5 h-3.5 text-muted-foreground/50" />
            </div>
            {loading ? (
              <div className="h-6 w-20 rounded bg-muted/30 animate-pulse" />
            ) : (
              <span className="text-lg font-mono font-semibold tracking-tight">
                {s.value}
              </span>
            )}
            {!loading && data && (
              <span
                className={`text-[10px] font-medium ${
                  s.good ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {s.good ? "Iyi" : "Dikkat"}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Collapsible Section ───────────────────────────────────── */

function Section({
  title,
  items,
  onRun,
  activeAction,
  loading,
}: {
  title: string;
  items: ToolDef[];
  onRun: (action: string) => void;
  activeAction: string | null;
  loading: boolean;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 mb-2 group"
      >
        {open ? (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/60" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
        )}
        <span className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider group-hover:text-muted-foreground transition-colors">
          {title}
        </span>
      </button>

      {open && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {items.map((t) => (
            <ModelCard
              key={t.title}
              tool={t}
              isRunning={activeAction === t.action && loading}
              disabled={loading}
              onRun={() => onRun(t.action)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Model Card ────────────────────────────────────────────── */

function ModelCard({
  tool,
  isRunning,
  disabled,
  onRun,
}: {
  tool: ToolDef;
  isRunning: boolean;
  disabled: boolean;
  onRun: () => void;
}) {
  const Icon = tool.icon;
  const c = colors(tool.color);

  return (
    <button
      onClick={onRun}
      disabled={disabled}
      className={`
        relative overflow-hidden rounded-xl border p-4 text-left transition-all
        ${isRunning ? `${c.border} ring-1 ${c.ring}` : "border-border/50 hover:border-border"}
        disabled:opacity-50 group
      `}
    >
      {/* Running progress bar at top */}
      {isRunning && (
        <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden">
          <div className={`h-full w-1/3 ${c.bg} animate-[shimmer_1.5s_ease-in-out_infinite]`}
            style={{
              background: `linear-gradient(90deg, transparent, var(--tw-gradient-to, currentColor), transparent)`,
              animation: "shimmer 1.5s ease-in-out infinite",
            }}
          />
          <style>{`
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(400%); }
            }
          `}</style>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${c.bg} transition-colors`}>
          {isRunning ? (
            <Loader2 className={`w-4 h-4 ${c.text} animate-spin`} />
          ) : (
            <Icon className={`w-4 h-4 ${c.text}`} />
          )}
        </div>
        <div className="min-w-0">
          <p className={`text-[13px] font-medium transition-colors ${isRunning ? c.text : "group-hover:text-foreground"}`}>
            {tool.title}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
            {tool.desc}
          </p>
        </div>
      </div>
    </button>
  );
}

/* ─── Result Card ───────────────────────────────────────────── */

function ResultCard({ result, action }: { result: Record<string, unknown>; action: string | null }) {
  const isError = "error" in result;

  /* Try to pull out known numeric fields for a nicer display */
  const numericEntries: { key: string; value: number }[] = [];
  const otherEntries: { key: string; value: unknown }[] = [];

  for (const [k, v] of Object.entries(result)) {
    if (typeof v === "number") {
      numericEntries.push({ key: k, value: v });
    } else if (k !== "sample_paths" && k !== "symbol") {
      otherEntries.push({ key: k, value: v });
    }
  }

  const hasStructured = numericEntries.length > 0;

  return (
    <div
      className={`rounded-xl border p-4 ${
        isError
          ? "border-red-500/20 bg-red-500/5"
          : "border-emerald-500/20 bg-emerald-500/5"
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        {isError ? (
          <AlertTriangle className="w-4 h-4 text-red-400" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        )}
        <span className={`text-[12px] font-semibold ${isError ? "text-red-400" : "text-emerald-400"}`}>
          {isError ? "Hata" : `Sonuc${action ? ` — ${action}` : ""}`}
        </span>
      </div>

      {/* Structured numeric display */}
      {hasStructured && !isError && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
          {numericEntries.map(({ key, value }) => (
            <div key={key} className="rounded-lg bg-background/50 border border-border/30 px-3 py-2">
              <p className="text-[10px] text-muted-foreground truncate">{formatKey(key)}</p>
              <p className="text-[13px] font-mono font-medium mt-0.5">{formatNumber(value)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Remaining non-numeric data as JSON */}
      {otherEntries.length > 0 && (
        <pre className="text-[11px] font-mono text-muted-foreground whitespace-pre-wrap overflow-x-auto leading-relaxed max-h-60 overflow-y-auto">
          {JSON.stringify(
            Object.fromEntries(otherEntries.map(({ key, value }) => [key, value])),
            null,
            2,
          )}
        </pre>
      )}

      {/* Fallback: if no structured data, show raw */}
      {!hasStructured && (
        <pre className="text-[11px] font-mono text-muted-foreground whitespace-pre-wrap overflow-x-auto leading-relaxed max-h-60 overflow-y-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

/* ─── Helpers ───────────────────────────────────────────────── */

function formatKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatNumber(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }
  if (Math.abs(value) < 0.01 && value !== 0) {
    return value.toExponential(3);
  }
  return value.toFixed(4);
}
