import { NextRequest, NextResponse } from "next/server";

const FINANCELIB_API = process.env.FINANCELIB_API_URL || "http://localhost:8000";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const SYSTEM_PROMPT = `Sen "Nexia" adlı yapay zekâ destekli finansal analiz terminalinin AI asistanısın.
Türk finans profesyonellerine (portföy yöneticileri, analistler, bağımsız danışmanlar) yardımcı oluyorsun.

Görevlerin:
1. Hisse senedi teknik analizi (RSI, MACD, Bollinger, SMA, EMA, ADX, ATR, Stochastic, CCI, Aroon, Williams %R)
2. Risk değerlendirmesi (Sharpe, Sortino, VaR, CVaR, Max Drawdown, Beta, Alpha)
3. Portföy optimizasyonu (korelasyon, diversifikasyon, Markowitz, risk-getiri dengesi)
4. Temel analiz (P/E, P/B, ROE, ROA, borç oranları, DCF değerleme)
5. Döviz ve emtia analizi
6. Monte Carlo simülasyonu ve GARCH volatilite yorumlama
7. Haber sentiment analizi (FinBERT)

Kurallar:
- Her zaman Türkçe yanıt ver, Türkçe karakterleri doğru kullan (ö, ü, ı, ş, ç, ğ, İ)
- Sayısal verileri markdown formatında sun: **bold** başlıklar, - bullet listeler
- Kısa ve öz ol, profesyonel dil kullan, gereksiz tekrar yapma
- Veri bazlı analiz yap, spekülasyon yapma, "yatırım tavsiyesi değildir" uyarısı ekle
- BIST hisseleri için .IS uzantısı kullan (ör: THYAO.IS)
- Karşılaştırma isteklerinde tablo formatı kullan`;

async function fetchFinanceData(message: string) {
  const results: Record<string, unknown> = {};

  const symbolPatterns = message.match(
    /\b(THYAO|GARAN|AKBNK|EREGL|BIMAS|ASELS|SASA|KCHOL|TUPRS|SAHOL|PGSUS|TAVHL|FROTO|TOASO|ARCLK|PETKM|KOZAL|SISE|HEKTS|MGROS)\b/gi
  );
  const symbols = symbolPatterns
    ? [...new Set(symbolPatterns.map((s) => s.toUpperCase()))]
    : [];

  for (const sym of symbols.slice(0, 3)) {
    const fullSym = `${sym}.IS`;
    try {
      const [stockRes, indicatorRes, riskRes] = await Promise.allSettled([
        fetch(`${FINANCELIB_API}/api/stock/${fullSym}`),
        fetch(`${FINANCELIB_API}/api/stock/${fullSym}/indicators?period=3mo`),
        fetch(`${FINANCELIB_API}/api/stock/${fullSym}/risk?period=1y`),
      ]);
      if (stockRes.status === "fulfilled" && stockRes.value.ok)
        results[`${sym}_stock`] = await stockRes.value.json();
      if (indicatorRes.status === "fulfilled" && indicatorRes.value.ok)
        results[`${sym}_indicators`] = await indicatorRes.value.json();
      if (riskRes.status === "fulfilled" && riskRes.value.ok)
        results[`${sym}_risk`] = await riskRes.value.json();
    } catch {
      // skip
    }
  }

  // Forex
  if (message.match(/\b(USD|EUR|GBP|dolar|euro|sterlin|kur)\b/i)) {
    try {
      const res = await fetch(`${FINANCELIB_API}/api/forex/USD/TRY`);
      if (res.ok) results["usd_try"] = await res.json();
    } catch { /* skip */ }
    try {
      const res = await fetch(`${FINANCELIB_API}/api/forex/EUR/TRY`);
      if (res.ok) results["eur_try"] = await res.json();
    } catch { /* skip */ }
  }

  // Commodities
  if (message.match(/\b(altın|altin|gold|petrol|oil|gümüş|silver|emtia)\b/i)) {
    try {
      const res = await fetch(`${FINANCELIB_API}/api/commodities`);
      if (res.ok) results["commodities"] = await res.json();
    } catch { /* skip */ }
  }

  // Monte Carlo
  if (message.match(/\b(monte carlo|simülasyon|simulasyon|senaryo)\b/i) && symbols.length > 0) {
    try {
      const res = await fetch(`${FINANCELIB_API}/api/quant/monte-carlo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: `${symbols[0]}.IS`, simulations: 1000, days: 252 }),
      });
      if (res.ok) results["monte_carlo"] = await res.json();
    } catch { /* skip */ }
  }

  // GARCH
  if (message.match(/\b(garch|volatilite|oynaklık|oynaklik)\b/i) && symbols.length > 0) {
    try {
      const res = await fetch(`${FINANCELIB_API}/api/quant/garch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: `${symbols[0]}.IS` }),
      });
      if (res.ok) results["garch"] = await res.json();
    } catch { /* skip */ }
  }

  // Portfolio optimization (when comparing)
  if (symbols.length >= 2 && message.match(/\b(karşılaştır|karsilastir|portföy|portfoy|optimiz|ağırlık|agirlik)\b/i)) {
    try {
      const res = await fetch(`${FINANCELIB_API}/api/quant/optimize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbols: symbols.map(s => `${s}.IS`) }),
      });
      if (res.ok) results["portfolio_optimization"] = await res.json();
    } catch { /* skip */ }
  }

  // Chaos theory
  if (message.match(/\b(kaos|chaos|lyapunov|entropi|entropy|fraktal|fractal|stokastik|stochastic|hurst)\b/i) && symbols.length > 0) {
    try {
      const res = await fetch(`${FINANCELIB_API}/api/quant/chaos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: `${symbols[0]}.IS` }),
      });
      if (res.ok) results["chaos_analysis"] = await res.json();
    } catch { /* skip */ }
  }

  // Jump diffusion
  if (message.match(/\b(jump|sıçrama|merton|ani hareket)\b/i) && symbols.length > 0) {
    try {
      const res = await fetch(`${FINANCELIB_API}/api/quant/jump-diffusion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: `${symbols[0]}.IS` }),
      });
      if (res.ok) results["jump_diffusion"] = await res.json();
    } catch { /* skip */ }
  }

  // Ornstein-Uhlenbeck
  if (message.match(/\b(ortalamaya dönüş|mean.?revert|ou |ornstein)\b/i) && symbols.length > 0) {
    try {
      const res = await fetch(`${FINANCELIB_API}/api/quant/ou`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: `${symbols[0]}.IS` }),
      });
      if (res.ok) results["ou_analysis"] = await res.json();
    } catch { /* skip */ }
  }

  // Fundamental ratios
  if (message.match(/\b(temel|fundamental|bilanço|bilanco|P\/E|PD\/DD|ROE|ROA|değerleme|degerleme)\b/i) && symbols.length > 0) {
    try {
      const res = await fetch(`${FINANCELIB_API}/api/fundamental/${symbols[0]}.IS/ratios`);
      if (res.ok) results[`${symbols[0]}_fundamentals`] = await res.json();
    } catch { /* skip */ }
  }

  return results;
}

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    const financeData = await fetchFinanceData(message);
    const dataContext =
      Object.keys(financeData).length > 0
        ? `\n\nFinanceLib API'den çekilen güncel veriler:\n${JSON.stringify(financeData, null, 2)}`
        : "\n\n(Not: Backend'den veri çekilemedi, genel bilgilerle yanıt ver)";

    // No API key → demo response
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ response: generateDemoResponse(message, financeData) });
    }

    // Build Gemini request
    const contents = [];

    // Add history
    for (const m of (history || []).slice(-6)) {
      if (m.role === "user" || m.role === "assistant") {
        contents.push({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        });
      }
    }

    // Add current message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-06-17:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT + dataContext }],
          },
          contents,
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      console.error("Gemini API error:", geminiRes.status, err);
      return NextResponse.json({ response: generateDemoResponse(message, financeData) });
    }

    const result = await geminiRes.json();
    const text =
      result.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Yanıt oluşturulamadı.";

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { response: "Bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}

function generateDemoResponse(message: string, data: Record<string, unknown>): string {
  const symbols = Object.keys(data)
    .filter((k) => k.endsWith("_stock"))
    .map((k) => k.replace("_stock", ""));

  if (symbols.length > 0) {
    let response = "";
    for (const sym of symbols) {
      const stock = data[`${sym}_stock`] as Record<string, number> | undefined;
      const risk = data[`${sym}_risk`] as Record<string, number> | undefined;
      const indicators = data[`${sym}_indicators`] as Record<string, number> | undefined;

      response += `**${sym} Analizi**\n\n`;

      if (stock) {
        response += `**Fiyat:** ${stock.price} TL\n`;
        response += `**Değişim:** ${stock.change_percent >= 0 ? "+" : ""}${stock.change_percent}%\n\n`;
      }

      if (indicators) {
        response += `**Teknik Göstergeler:**\n`;
        response += `- RSI: ${indicators.rsi} ${indicators.rsi > 70 ? "(Aşırı Alım)" : indicators.rsi < 30 ? "(Aşırı Satım)" : "(Nötr)"}\n`;
        response += `- MACD: ${indicators.macd} / Sinyal: ${indicators.macd_signal}\n`;
        response += `- SMA20: ${indicators.sma_20} | SMA50: ${indicators.sma_50}\n`;
        response += `- Bollinger: ${indicators.bb_lower} - ${indicators.bb_upper}\n\n`;
      }

      if (risk) {
        response += `**Risk Metrikleri:**\n`;
        response += `- Sharpe Oranı: ${risk.sharpe_ratio}\n`;
        response += `- Sortino Oranı: ${risk.sortino_ratio}\n`;
        response += `- Max Drawdown: ${(risk.max_drawdown * 100).toFixed(2)}%\n`;
        response += `- VaR (95%): ${(risk.var_95 * 100).toFixed(2)}%\n`;
        response += `- Yıllık Getiri: ${(risk.annualized_return * 100).toFixed(2)}%\n\n`;
      }
    }
    return response.trim();
  }

  if (data["usd_try"]) {
    const usd = data["usd_try"] as Record<string, unknown>;
    const eur = data["eur_try"] as Record<string, unknown>;
    let response = `**Döviz Kurları**\n\n`;
    response += `- USD/TRY: ${usd.rate}\n`;
    if (eur) response += `- EUR/TRY: ${eur.rate}\n`;
    return response;
  }

  if (message.toLowerCase().includes("portföy") || message.toLowerCase().includes("portfoy")) {
    return `**Portföy Önerileri**\n\nPortföy analizi için takip ettiğiniz hisseleri belirtin.\n\nÖrnek: "THYAO, GARAN, EREGL portföyümü analiz et"\n\nSize risk-getiri optimizasyonu, korelasyon analizi ve diversifikasyon önerileri sunabilirim.`;
  }

  return `Sorunuzu anladım: "${message}"\n\nDetaylı analiz için bir BIST hisse sembolü belirtin (ör: THYAO, GARAN, AKBNK).\n\n**Yapabileceklerim:**\n- Teknik analiz (RSI, MACD, Bollinger)\n- Risk metrikleri (Sharpe, VaR, CVaR)\n- Döviz kurları (USD/TRY, EUR/TRY)\n- Portföy optimizasyonu`;
}
