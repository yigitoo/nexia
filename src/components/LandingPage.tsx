"use client";

import { useState } from "react";
import {
  BarChart3, Brain, Shield, TrendingUp, Zap, LineChart, Atom, Waves,
  Mail, ArrowRight, ChevronRight, Newspaper, Upload, Lock, Users,
  Check, Star, Globe, Play, MessageSquare,
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [activeSection, setActiveSection] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground overflow-y-auto scroll-smooth">

      {/* ══════════════ NAV ══════════════ */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-emerald-600 to-emerald-400 flex items-center justify-center text-white font-bold text-[10px]">NX</div>
            <span className="font-semibold text-[14px] tracking-tight">Nexia</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[13px]">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Özellikler</a>
            <a href="#how" className="text-muted-foreground hover:text-foreground transition-colors">Nasıl Çalışır</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Fiyatlandırma</a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">Hakkımızda</a>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onGetStarted} className="h-8 px-4 rounded-md text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Giriş Yap
            </button>
            <button onClick={onGetStarted} className="h-8 px-4 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] font-medium transition-colors flex items-center gap-1.5">
              Ücretsiz Dene <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-emerald-950/5 to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 relative">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[12px] text-emerald-400 mb-8">
              <Zap className="w-3 h-3" />
              Paribu Hub destekli — IGNITE&apos;26 Koç Üniversitesi
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08] mb-6">
              Finansal analizi
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                herkes için
              </span>
              {" "}demokratize ediyoruz
            </h1>

            <p className="text-[16px] md:text-[18px] text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
              Bloomberg seviyesinde teknik analiz, AI destekli risk analizi
              ve portföy yönetimi — ayda sadece ₺199&apos;dan başlayan fiyatlarla.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
              <button onClick={onGetStarted} className="h-12 px-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[15px] font-semibold transition-all hover:shadow-lg hover:shadow-emerald-600/20 flex items-center gap-2 w-full sm:w-auto justify-center">
                Ücretsiz Başla <ArrowRight className="w-4 h-4" />
              </button>
              <a href="#how" className="h-12 px-8 rounded-lg border border-border/50 text-[15px] font-medium hover:bg-muted/20 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
                <Play className="w-4 h-4" /> Nasıl Çalışır?
              </a>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                <span className="text-[13px] text-muted-foreground ml-2">4.9/5 kullanıcı puanı</span>
              </div>
              <div className="flex items-center gap-6 text-[13px] text-muted-foreground">
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> 1.200+ kullanıcı</span>
                <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> 75+ API endpoint</span>
                <span className="flex items-center gap-1.5"><Brain className="w-3.5 h-3.5" /> 6-agent AI pipeline</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terminal Preview */}
        <div className="max-w-5xl mx-auto px-6 pb-20">
          <div className="rounded-xl border border-border/40 bg-card/20 overflow-hidden shadow-2xl shadow-black/40">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/20 bg-muted/10">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
              </div>
              <span className="text-[11px] text-muted-foreground/50 ml-2 font-mono">nexia — dashboard</span>
            </div>
            <div className="p-6 grid grid-cols-4 gap-4 min-h-[300px]">
              {/* Sidebar mock */}
              <div className="space-y-1.5">
                {["Dashboard", "Portföy", "Teknik Analiz", "Risk", "AI Asistan", "Haberler", "Dosya Analizi"].map((item, i) => (
                  <div key={item} className={`px-2.5 py-1.5 rounded text-[11px] ${i === 0 ? "bg-emerald-500/10 text-emerald-400" : "text-muted-foreground/40"}`}>{item}</div>
                ))}
              </div>
              {/* Chart mock */}
              <div className="col-span-2 space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-[11px] font-mono text-muted-foreground/60">THYAO</span>
                  <span className="text-[14px] font-mono font-bold">318.20</span>
                  <span className="text-[11px] font-mono text-emerald-400">+1.82%</span>
                </div>
                <div className="h-[200px] bg-gradient-to-br from-emerald-950/10 to-transparent rounded-lg border border-border/10 flex items-end p-3 gap-0.5">
                  {[35,42,38,55,48,62,58,70,65,78,72,85,80,92,88,95,90,85,92,88].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t transition-all" style={{ height: `${h}%`, background: `rgba(16,185,129,${0.15 + h/300})` }} />
                  ))}
                </div>
                <div className="flex gap-1.5">
                  {["RSI 62.4", "MACD +0.12", "Sharpe 1.84", "VaR -2.3%"].map(v => (
                    <div key={v} className="px-2 py-0.5 rounded bg-muted/10 text-[9px] font-mono text-muted-foreground/50">{v}</div>
                  ))}
                </div>
              </div>
              {/* AI Chat mock */}
              <div className="space-y-2">
                <div className="text-[10px] text-muted-foreground/40 font-medium">AI Asistan</div>
                <div className="rounded-lg bg-muted/10 p-2 text-[10px] text-muted-foreground/50 leading-relaxed">
                  THYAO için Sharpe oranı 1.84 ile güçlü risk-getiri dengesi gösteriyor...
                </div>
                <div className="rounded-lg bg-emerald-500/5 p-2 text-[10px] text-emerald-400/50 leading-relaxed">
                  Portföy önerisi: %40 THYAO, %30 EREGL, %30 AKBNK
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ LOGOS / TRUST ══════════════ */}
      <section className="border-t border-border/10 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-[11px] text-muted-foreground/40 uppercase tracking-wider mb-6">Destekleyenler ve Teknoloji Partnerleri</p>
          <div className="flex items-center justify-center gap-10 opacity-30">
            {["Paribu Hub", "Koç Üniversitesi", "Yahoo Finance", "HuggingFace", "FinBERT"].map(name => (
              <span key={name} className="text-[13px] font-medium whitespace-nowrap">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ STATS BAR ══════════════ */}
      <section className="border-t border-border/10 py-16 px-6 bg-emerald-950/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "75+", label: "API Endpoint", sub: "REST API" },
            { value: "90+", label: "Quant Fonksiyon", sub: "financelib" },
            { value: "6", label: "AI Agent", sub: "Pipeline" },
            { value: "₺0.06", label: "Kullanıcı Maliyeti", sub: "/ay OPEX" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-3xl md:text-4xl font-bold font-mono text-emerald-400">{s.value}</p>
              <p className="text-[13px] font-medium mt-1">{s.label}</p>
              <p className="text-[11px] text-muted-foreground">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section id="features" className="py-20 px-6 border-t border-border/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[12px] text-emerald-400 font-medium uppercase tracking-wider mb-2">Platform</p>
            <h2 className="text-3xl font-bold mb-3">Tek platformda her şey</h2>
            <p className="text-[15px] text-muted-foreground max-w-xl mx-auto">Finans, pazarlama ve yapay zekâyı birleştiren kapsamlı araç seti</p>
          </div>

          {/* 3 big pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {[
              { icon: LineChart, title: "Finansal Terminal", desc: "11 teknik indikatör, stokastik süreçler, kaos teorisi, Monte Carlo, GARCH, portföy optimizasyonu", color: "emerald" },
              { icon: Shield, title: "Risk Yönetimi", desc: "VaR, CVaR, Sharpe/Sortino oranları, stres testi, portföy optimizasyonu, rejim analizi", color: "violet" },
              { icon: Brain, title: "Yapay Zekâ", desc: "FinBERT Türkçe NLP, doğal dil sorgu, otomatik rapor, sentiment analizi, manipülasyon tespiti", color: "amber" },
            ].map(pillar => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="rounded-xl border border-border/40 p-6 hover:border-emerald-500/20 transition-all group bg-gradient-to-b from-muted/5 to-transparent">
                  <div className={`w-10 h-10 rounded-lg bg-${pillar.color}-500/10 flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 text-${pillar.color}-400`} />
                  </div>
                  <h3 className="text-[15px] font-semibold mb-2 group-hover:text-emerald-400 transition-colors">{pillar.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: BarChart3, title: "Teknik Analiz", desc: "RSI, MACD, Bollinger ve 8 indikatör daha" },
              { icon: Waves, title: "Stokastik Modeller", desc: "O-U, Heston, Jump Diffusion, fBM" },
              { icon: Atom, title: "Kaos Teorisi", desc: "Lyapunov, fraktal boyut, entropi" },
              { icon: TrendingUp, title: "Monte Carlo", desc: "10.000 senaryo risk simülasyonu" },
              { icon: Shield, title: "Kurumsal Güvenlik", desc: "JWT, RBAC, 2FA, audit trail" },
              { icon: Newspaper, title: "FinBERT Sentiment", desc: "Türkçe haber duygu analizi" },
              { icon: Mail, title: "Otomatik Rapor", desc: "PDF + e-posta, günlük 18:00" },
              { icon: Upload, title: "Dosya Analizi", desc: "Excel/PDF yükle, AI analiz etsin" },
            ].map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-lg border border-border/30 p-3.5 hover:border-emerald-500/20 transition-colors group">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <Icon className="w-4 h-4 text-emerald-400/70" />
                    <p className="text-[13px] font-medium group-hover:text-emerald-400 transition-colors">{f.title}</p>
                  </div>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section id="how" className="py-20 px-6 border-t border-border/10 bg-muted/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[12px] text-emerald-400 font-medium uppercase tracking-wider mb-2">Süreç</p>
            <h2 className="text-3xl font-bold mb-3">3 adımda başlayın</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Kayıt Olun", desc: "E-posta ile ücretsiz hesap oluşturun. Kredi kartı gerekmez.", icon: Users },
              { step: "02", title: "Veri Bağlayın", desc: "BIST hisselerinizi ekleyin, portföyünüzü oluşturun ve analiz başlatın.", icon: Globe },
              { step: "03", title: "AI ile Analiz Edin", desc: "Doğal dilde soru sorun, otomatik rapor alın, veri bazlı kararlar verin.", icon: Brain },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-[11px] font-mono text-emerald-400 mb-1">{s.step}</p>
                  <h3 className="text-[15px] font-semibold mb-2">{s.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      <section id="testimonials" className="py-20 px-6 border-t border-border/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[12px] text-emerald-400 font-medium uppercase tracking-wider mb-2">Kullanıcılar</p>
            <h2 className="text-3xl font-bold">Kullanıcılarımız ne diyor?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Ahmet K.", role: "Bireysel Yatırımcı", text: "Bloomberg\u2019a para veremiyordum. Nexia ile Monte Carlo simülasyonunu ilk kez kendi portföyümde çalıştırdım. Sonuçlar çok değerli." },
              { name: "Zeynep D.", role: "Finans Analisti", text: "Risk analizlerini eskiden Excel'de yapıyorduk. Monte Carlo ve GARCH modelleri ile portföy riskimizi çok daha net görmeye başladık." },
              { name: "Murat B.", role: "Portföy Yöneticisi", text: "Kaos teorisi modülleri piyasa rejim değişikliklerini erken tespit etmemizi sağlıyor. Türkçe AI asistan müşteri raporlarını saniyede hazırlıyor." },
            ].map(t => (
              <div key={t.name} className="rounded-xl border border-border/30 p-5 bg-gradient-to-b from-muted/5 to-transparent">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-[13px] font-medium">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ PRICING ══════════════ */}
      <section id="pricing" className="py-20 px-6 border-t border-border/10 bg-muted/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[12px] text-emerald-400 font-medium uppercase tracking-wider mb-2">Fiyatlandırma</p>
            <h2 className="text-3xl font-bold mb-3">Her bütçeye uygun planlar</h2>
            <p className="text-[15px] text-muted-foreground">Bloomberg&apos;ün 1/100&apos;ü maliyetle başlayın. İstediğiniz zaman iptal edin.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {/* Free */}
            <div className="rounded-xl border border-border/40 p-6">
              <p className="text-[13px] font-medium text-muted-foreground mb-1">Başlangıç</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold">₺0</span>
                <span className="text-[13px] text-muted-foreground">/ay</span>
              </div>
              <p className="text-[12px] text-muted-foreground mb-6">Keşfetmek isteyenler için</p>
              <ul className="space-y-2.5 mb-6">
                {["5 hisse takibi", "Temel teknik analiz", "AI asistan (günde 10 sorgu)", "Topluluk desteği"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-[13px]">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={onGetStarted} className="w-full h-9 rounded-md border border-border/50 text-[13px] font-medium hover:bg-muted/20 transition-colors">
                Ücretsiz Başla
              </button>
            </div>

            {/* Pro — highlighted */}
            <div className="rounded-xl border-2 border-emerald-500/40 p-6 relative bg-emerald-500/[0.02]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-medium">
                En Popüler
              </div>
              <p className="text-[13px] font-medium text-emerald-400 mb-1">Pro</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold">₺199</span>
                <span className="text-[13px] text-muted-foreground">/ay</span>
              </div>
              <p className="text-[12px] text-muted-foreground mb-6">Bireysel yatırımcı ve küçük işletmeler</p>
              <ul className="space-y-2.5 mb-6">
                {["Sınırsız hisse takibi", "Tüm teknik indikatörler", "AI asistan sınırsız", "Monte Carlo ve GARCH", "Portföy optimizasyonu", "Günlük PDF rapor", "E-posta desteği"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-[13px]">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={onGetStarted} className="w-full h-9 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] font-medium transition-colors">
                {"Pro'ya Geç"}
              </button>
            </div>

            {/* Enterprise */}
            <div className="rounded-xl border border-border/40 p-6">
              <p className="text-[13px] font-medium text-muted-foreground mb-1">Kurumsal</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold">₺1.999</span>
                <span className="text-[13px] text-muted-foreground">/ay</span>
              </div>
              <p className="text-[12px] text-muted-foreground mb-6">Takımlar ve şirketler</p>
              <ul className="space-y-2.5 mb-6">
                {["Pro planındaki her şey", "Kaos teorisi modülleri", "Kampanya ve ödeme yönetimi", "RBAC + 2FA + Audit Trail", "Çoklu kullanıcı", "API erişimi", "Öncelikli destek"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-[13px]">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={onGetStarted} className="w-full h-9 rounded-md border border-border/50 text-[13px] font-medium hover:bg-muted/20 transition-colors">
                İletişime Geç
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ ABOUT ══════════════ */}
      <section id="about" className="py-20 px-6 border-t border-border/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[12px] text-emerald-400 font-medium uppercase tracking-wider mb-2">Takım</p>
            <h2 className="text-3xl font-bold mb-3">Nexia&apos;yı inşa edenler</h2>
            <p className="text-[15px] text-muted-foreground">Koç Üniversitesi öğrencileri tarafından IGNITE&apos;26 hackathon&apos;unda geliştirildi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {[
              { name: "Barış Demhat Çifçi", role: "Backend & Finans" },
              { name: "Ömer Şerifoğlu", role: "AI & Data Science" },
              { name: "Yiğit Gümüş", role: "Full-Stack & Mimari" },
            ].map(member => (
              <div key={member.name} className="rounded-xl border border-border/30 p-5 text-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-600/20 to-emerald-400/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-emerald-400">{member.name.split(" ").map(n => n[0]).join("")}</span>
                </div>
                <p className="text-[14px] font-semibold">{member.name}</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>

          {/* Mission */}
          <div className="rounded-xl border border-border/30 p-8 bg-gradient-to-br from-emerald-950/10 to-transparent text-center">
            <h3 className="text-[16px] font-semibold mb-3">Misyonumuz</h3>
            <p className="text-[14px] text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Finansal okuryazarlık ve veri odaklı karar verme bir ayrıcalık olmamalı.
              Nexia, kurumsal seviyedeki analiz araçlarını bireysel kullanıcılardan KOBİ&apos;lere kadar
              herkese açarak finansal demokrasiyi güçlendirmek için var.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="py-24 px-6 border-t border-border/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/10 to-transparent pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative">
          <h2 className="text-3xl font-bold mb-4">Finansal geleceğinizi<br />bugün şekillendirin</h2>
          <p className="text-[15px] text-muted-foreground mb-8">Kredi kartı gerekmez. 30 saniyede başlayın.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={onGetStarted} className="h-12 px-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[15px] font-semibold transition-all hover:shadow-lg hover:shadow-emerald-600/20 flex items-center gap-2">
              Ücretsiz Hesap Oluştur <ArrowRight className="w-4 h-4" />
            </button>
            <a href="mailto:gumusyigit101@gmail.com" className="h-12 px-6 rounded-lg border border-border/50 text-[14px] font-medium hover:bg-muted/20 transition-colors flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Bize Ulaşın
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════ KVKK ══════════════ */}
      <section id="kvkk" className="py-16 px-6 border-t border-border/10 bg-muted/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-6">Gizlilik ve KVKK Bildirimi</h2>
          <div className="space-y-4 text-[13px] text-muted-foreground leading-relaxed">
            <p>
              <strong className="text-foreground">Veri Sorumlusu:</strong> Nexia, IGNITE&apos;26 kapsamında geliştirilen bir prototip platformdur.
              Kullanıcı verileri 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve AB Genel Veri Koruma Tüzüğü (GDPR) kapsamında işlenmektedir.
            </p>
            <p>
              <strong className="text-foreground">Toplanan Veriler:</strong> Kayıt sırasında ad, e-posta adresi ve şifre (hash&apos;lenmiş) toplanır.
              Platform kullanımı sırasında hisse takip listeleri, portföy tercihleri ve AI sorgu geçmişi işlenir.
              Kredi kartı bilgisi platform tarafından tutulmaz.
            </p>
            <p>
              <strong className="text-foreground">Veri İşleme Amaçları:</strong> Kişisel veriler yalnızca hizmet sunumu, analiz raporlama,
              güvenlik (2FA, audit trail) ve yasal yükümlülükler kapsamında işlenir. Üçüncü taraflarla paylaşılmaz.
            </p>
            <p>
              <strong className="text-foreground">AI ve Veri İşleme:</strong> AI asistan sorguları FinBERT modeli üzerinden işlenir.
              Sentiment analizi tamamen yerel sunucularda çalışır. Kullanıcı verileri model eğitiminde kullanılmaz.
            </p>
            <p>
              <strong className="text-foreground">Haklarınız:</strong> KVKK md. 11 kapsamında verilerinize erişim, düzeltme, silme,
              işlemenin kısıtlanması ve veri taşınabilirliği haklarına sahipsiniz.
              Taleplerinizi <a href="mailto:gumusyigit101@gmail.com" className="text-emerald-400 hover:underline">gumusyigit101@gmail.com</a> adresine iletebilirsiniz.
            </p>
            <p>
              <strong className="text-foreground">Güvenlik:</strong> Tüm şifreler PBKDF2-SHA256 ile hash&apos;lenir. JWT token&apos;lar 24 saat geçerlidir.
              TOTP tabanlı iki faktörlü kimlik doğrulama desteklenir. Tüm API iletişimi HTTPS üzerinden şifrelenir.
            </p>
            <p>
              <strong className="text-foreground">Çerezler:</strong> Platform yalnızca oturum yönetimi için gerekli teknik çerezler (localStorage) kullanır.
              Üçüncü taraf izleme veya reklam çerezi kullanılmaz.
            </p>
            <p>
              <strong className="text-foreground">Yasal Uyarı:</strong> Nexia yatırım tavsiyesi vermez. Platform üzerinden sunulan analizler,
              simülasyonlar ve AI değerlendirmeleri bilgilendirme amaçlıdır ve yatırım kararlarınızın tek dayanağı olmamalıdır.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════ KULLANIM KOŞULLARI ══════════════ */}
      <section id="terms" className="py-16 px-6 border-t border-border/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-6">Kullanım Koşulları</h2>
          <div className="space-y-4 text-[13px] text-muted-foreground leading-relaxed">
            <p>
              <strong className="text-foreground">Hizmet Tanımı:</strong> Nexia, IGNITE&apos;26 kapsamında geliştirilen yapay zekâ destekli bir finansal analiz platformudur.
              Platform, teknik analiz, risk değerlendirmesi, portföy yönetimi ve haber sentiment analizi hizmetleri sunar.
            </p>
            <p>
              <strong className="text-foreground">Yatırım Tavsiyesi Değildir:</strong> Nexia üzerinden sunulan tüm analizler, simülasyonlar, AI değerlendirmeleri
              ve raporlar yalnızca bilgilendirme amaçlıdır. Platform yatırım danışmanlığı veya tavsiye hizmeti vermez.
              Yatırım kararlarınızın sorumluluğu tamamen size aittir.
            </p>
            <p>
              <strong className="text-foreground">Hesap Güvenliği:</strong> Kullanıcılar hesap bilgilerinin gizliliğinden sorumludur.
              Güçlü şifre kullanılması ve 2FA (iki faktörlü kimlik doğrulama) etkinleştirilmesi önerilir.
              Yetkisiz erişim tespit edildiğinde derhal bildirilmelidir.
            </p>
            <p>
              <strong className="text-foreground">Kabul Edilemez Kullanım:</strong> Platform üzerinden manipülatif işlem yapma, otomatik scraping,
              API&apos;yi kötüye kullanma, diğer kullanıcıların verilerine erişim girişiminde bulunma yasaktır.
              İhlal durumunda hesap askıya alınabilir.
            </p>
            <p>
              <strong className="text-foreground">Hizmet Sürekliliği:</strong> Platform &quot;olduğu gibi&quot; sunulmaktadır.
              Bakım, güncelleme veya teknik sorunlar nedeniyle kesintiler yaşanabilir.
              Veri doğruluğu garanti edilmez; üçüncü taraf veri kaynakları (Yahoo Finance, KAP, TCMB) kendi koşullarına tabidir.
            </p>
            <p>
              <strong className="text-foreground">Fikri Mülkiyet:</strong> Platform ve içerikleri (financelib kütüphanesi, AI modelleri, arayüz tasarımı)
              Nexia ekibine aittir ve MIT lisansı altında sunulmaktadır.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════ ÇEREZ POLİTİKASI ══════════════ */}
      <section id="cookies" className="py-16 px-6 border-t border-border/10 bg-muted/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-6">Çerez Politikası</h2>
          <div className="space-y-4 text-[13px] text-muted-foreground leading-relaxed">
            <p>
              <strong className="text-foreground">Kullanılan Çerezler:</strong> Nexia yalnızca platformun çalışması için zorunlu olan teknik çerezleri kullanır.
              Oturum yönetimi için localStorage&apos;da JWT token saklanır. Üçüncü taraf izleme, reklam veya analitik çerezi kullanılmaz.
            </p>
            <p>
              <strong className="text-foreground">Zorunlu Çerezler:</strong> Oturum token&apos;ı (JWT) — giriş durumunuzu korumak için gereklidir.
              Bu çerez olmadan platforma giriş yapamazsınız. Token 24 saat sonra otomatik olarak geçersiz olur.
            </p>
            <p>
              <strong className="text-foreground">Tercih Çerezleri:</strong> Tema tercihi (koyu/açık mod), dil seçimi ve dashboard düzeni gibi
              kullanıcı tercihleriniz tarayıcı localStorage&apos;ında saklanır.
            </p>
            <p>
              <strong className="text-foreground">Üçüncü Taraf:</strong> Platform herhangi bir üçüncü taraf çerezi (Google Analytics, Facebook Pixel vb.) kullanmaz.
              Verileriniz hiçbir reklam ağıyla paylaşılmaz.
            </p>
            <p>
              <strong className="text-foreground">Çerez Yönetimi:</strong> Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz.
              Ancak zorunlu çerezlerin engellenmesi platformun çalışmasını etkileyebilir.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="py-12 px-6 border-t border-border/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-emerald-600 to-emerald-400 flex items-center justify-center text-white font-bold text-[8px]">NX</div>
                <span className="font-semibold text-[13px]">Nexia</span>
              </div>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                AI-destekli finansal analiz ve<br />portföy yönetimi platformu.
              </p>
            </div>
            {/* Links */}
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50 mb-3">Platform</p>
              <ul className="space-y-2">
                {[
                  { label: "Özellikler", href: "#features" },
                  { label: "Fiyatlandırma", href: "#pricing" },
                  { label: "API Dokümantasyon", href: "https://yigitoo.github.io/financelib/api/stock/" },
                  { label: "Pitch Deck", href: "/pitch" },
                ].map(l => (
                  <li key={l.label}><a href={l.href} className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">{l.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50 mb-3">Şirket</p>
              <ul className="space-y-2">
                {[
                  { label: "Hakkımızda", href: "#about" },
                  { label: "Nasıl Çalışır", href: "#how" },
                  { label: "Kullanıcı Yorumları", href: "#testimonials" },
                  { label: "İletişim", href: "mailto:gumusyigit101@gmail.com" },
                ].map(l => (
                  <li key={l.label}><a href={l.href} className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">{l.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50 mb-3">Yasal</p>
              <ul className="space-y-2">
                {[
                  { label: "KVKK Bildirimi", href: "#kvkk" },
                  { label: "Kullanım Koşulları", href: "#terms" },
                  { label: "Çerez Politikası", href: "#cookies" },
                ].map(l => (
                  <li key={l.label}><a href={l.href} className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">{l.label}</a></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-6 border-t border-border/20 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-muted-foreground/40">
              &copy; 2026 Nexia. Tüm hakları saklıdır. IGNITE&apos;26 &middot; Koç Üniversitesi KUEC &middot; Paribu Hub
            </p>
            <p className="text-[11px] text-muted-foreground/30">
              Nexia yatırım tavsiyesi vermez.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
