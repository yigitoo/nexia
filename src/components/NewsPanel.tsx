"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp, TrendingDown, Minus, Clock, Newspaper, RefreshCw,
  Search, Filter, ExternalLink, BarChart3,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface NewsItem {
  title: string;
  source: string;
  time: string;
  sentiment: "positive" | "negative" | "neutral";
  confidence?: number;
}

const FALLBACK_NEWS: NewsItem[] = [
  { title: "THYAO hisseleri yeni rekor kırdı, analistler hedef fiyatı yükseltti", source: "Bloomberg HT", time: "14:32", sentiment: "positive", confidence: 0.92 },
  { title: "TCMB faiz kararı öncesi piyasalarda temkinli bekleyiş sürüyor", source: "Reuters TR", time: "13:45", sentiment: "neutral", confidence: 0.78 },
  { title: "Paribu yeni DeFi ürünlerini kullanıcılara sunmaya hazırlanıyor", source: "Paribu Blog", time: "12:18", sentiment: "positive", confidence: 0.85 },
  { title: "EREGL çelik üretiminde düşüş beklentisi açıklandı", source: "KAP", time: "11:50", sentiment: "negative", confidence: 0.88 },
  { title: "Dolar/TL paritesinde yeni denge arayışı devam ediyor", source: "Ekonomist", time: "10:22", sentiment: "neutral", confidence: 0.65 },
  { title: "ASELS savunma ihracatında 2026 hedeflerini geride bıraktı", source: "AA", time: "09:15", sentiment: "positive", confidence: 0.94 },
  { title: "GARAN net kârını bir önceki yıla göre %35 artırdı", source: "KAP", time: "08:45", sentiment: "positive", confidence: 0.91 },
  { title: "Küresel piyasalarda durgunluk endişeleri derinleşiyor", source: "Bloomberg", time: "08:30", sentiment: "negative", confidence: 0.82 },
  { title: "KAP: KCHOL yıllık faaliyet raporunu yayımladı", source: "KAP", time: "08:00", sentiment: "neutral", confidence: 0.72 },
  { title: "BIMAS yurt dışı mağaza sayısını 1.000'e çıkardı", source: "AA", time: "07:30", sentiment: "positive", confidence: 0.87 },
];

type SentimentFilter = "all" | "positive" | "negative" | "neutral";

const SentimentBadge = ({ s, confidence }: { s: string; confidence?: number }) => {
  const config = {
    positive: { icon: TrendingUp, label: "Pozitif", cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
    negative: { icon: TrendingDown, label: "Negatif", cls: "text-red-400 bg-red-400/10 border-red-400/20" },
    neutral: { icon: Minus, label: "Nötr", cls: "text-white/40 bg-white/5 border-white/10" },
  }[s] || { icon: Minus, label: "Nötr", cls: "text-white/40 bg-white/5 border-white/10" };
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-medium ${config.cls}`}>
      <Icon className="w-3 h-3" />
      {config.label}
      {confidence != null && <span className="opacity-60">{Math.round(confidence * 100)}%</span>}
    </div>
  );
};

export function NewsPanel() {
  const [news, setNews] = useState<NewsItem[]>(FALLBACK_NEWS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState<SentimentFilter>("all");
  const [searchSymbol, setSearchSymbol] = useState("THYAO");

  async function fetchNews(symbol?: string) {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/sentiment/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: symbol || searchSymbol }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.articles?.length) {
          setNews(data.articles.map((a: { text: string; sentiment: string; confidence?: number }) => ({
            title: a.text,
            source: "FinBERT",
            time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
            sentiment: a.sentiment as "positive" | "negative" | "neutral",
            confidence: a.confidence,
          })));
        }
      }
    } catch {
      // Keep fallback
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchNews(); }, []);

  const counts = { positive: 0, negative: 0, neutral: 0 };
  news.forEach((n) => counts[n.sentiment]++);
  const total = news.length;

  // Filter news
  const filtered = news.filter((n) => {
    if (sentimentFilter !== "all" && n.sentiment !== sentimentFilter) return false;
    if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleSymbolSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchSymbol.trim()) {
      fetchNews(searchSymbol.trim().toUpperCase());
    }
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-emerald-400" />
            Haberler & Sentiment Analizi
          </h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">FinBERT ile Türkçe haber duygu analizi</p>
        </div>
        <button onClick={() => fetchNews()} disabled={loading} className="h-8 px-3 flex items-center gap-1.5 rounded-md hover:bg-muted/30 text-muted-foreground text-[12px] transition-colors border border-border/30">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Yenile
        </button>
      </div>

      {/* Sentiment summary cards */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-lg border border-border/40 p-3 bg-muted/5">
          <div className="text-[11px] text-muted-foreground mb-1">Toplam</div>
          <div className="text-xl font-bold">{total}</div>
          <div className="text-[10px] text-muted-foreground">haber</div>
        </div>
        <div className="rounded-lg border border-emerald-500/20 p-3 bg-emerald-500/5 cursor-pointer hover:bg-emerald-500/10 transition-colors" onClick={() => setSentimentFilter(sentimentFilter === "positive" ? "all" : "positive")}>
          <div className="text-[11px] text-emerald-400 mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Pozitif</div>
          <div className="text-xl font-bold text-emerald-400">{counts.positive}</div>
          <div className="text-[10px] text-emerald-400/50">%{total ? Math.round((counts.positive / total) * 100) : 0}</div>
        </div>
        <div className="rounded-lg border border-border/40 p-3 bg-muted/5 cursor-pointer hover:bg-muted/10 transition-colors" onClick={() => setSentimentFilter(sentimentFilter === "neutral" ? "all" : "neutral")}>
          <div className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1"><Minus className="w-3 h-3" /> Nötr</div>
          <div className="text-xl font-bold">{counts.neutral}</div>
          <div className="text-[10px] text-muted-foreground">%{total ? Math.round((counts.neutral / total) * 100) : 0}</div>
        </div>
        <div className="rounded-lg border border-red-500/20 p-3 bg-red-500/5 cursor-pointer hover:bg-red-500/10 transition-colors" onClick={() => setSentimentFilter(sentimentFilter === "negative" ? "all" : "negative")}>
          <div className="text-[11px] text-red-400 mb-1 flex items-center gap-1"><TrendingDown className="w-3 h-3" /> Negatif</div>
          <div className="text-xl font-bold text-red-400">{counts.negative}</div>
          <div className="text-[10px] text-red-400/50">%{total ? Math.round((counts.negative / total) * 100) : 0}</div>
        </div>
      </div>

      {/* Sentiment bar visualization */}
      <div className="h-2 rounded-full overflow-hidden flex bg-muted/20">
        {counts.positive > 0 && <div className="bg-emerald-500 transition-all duration-500" style={{ width: `${(counts.positive / total) * 100}%` }} />}
        {counts.neutral > 0 && <div className="bg-white/20 transition-all duration-500" style={{ width: `${(counts.neutral / total) * 100}%` }} />}
        {counts.negative > 0 && <div className="bg-red-500 transition-all duration-500" style={{ width: `${(counts.negative / total) * 100}%` }} />}
      </div>

      {/* Search & Filter bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Haberlerde ara..."
            className="pl-8 h-8 text-[13px] bg-muted/30 border-border/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative w-36">
          <BarChart3 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Sembol (ör: GARAN)"
            className="pl-8 h-8 text-[13px] bg-muted/30 border-border/50"
            value={searchSymbol}
            onChange={(e) => setSearchSymbol(e.target.value.toUpperCase())}
            onKeyDown={handleSymbolSearch}
          />
        </div>
        <div className="flex gap-0.5 bg-muted/30 rounded-md p-0.5">
          {([
            { id: "all" as const, label: "Tümü" },
            { id: "positive" as const, label: "Pozitif" },
            { id: "neutral" as const, label: "Nötr" },
            { id: "negative" as const, label: "Negatif" },
          ]).map((f) => (
            <button
              key={f.id}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${sentimentFilter === f.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setSentimentFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* News list */}
      <div className="rounded-lg border border-border/50 overflow-hidden divide-y divide-border/20">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-[13px] text-muted-foreground">
            <Filter className="w-5 h-5 mx-auto mb-2 opacity-30" />
            Filtrelere uygun haber bulunamadı
          </div>
        ) : (
          filtered.map((item, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3.5 hover:bg-muted/20 transition-colors group cursor-default">
              <div className="mt-0.5 shrink-0">
                <SentimentBadge s={item.sentiment} confidence={item.confidence} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] leading-snug group-hover:text-foreground transition-colors">{item.title}</p>
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                  <span className="font-medium">{item.source}</span>
                  <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{item.time}</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/30 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))
        )}
      </div>

      {/* Footer info */}
      <p className="text-[11px] text-muted-foreground/40 text-center">
        Sentiment analizi FinBERT (savasy/bert-base-turkish-sentiment-cased) modeli ile yapılmaktadır
      </p>
    </div>
  );
}
