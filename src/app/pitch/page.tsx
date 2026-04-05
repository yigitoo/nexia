"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Brain,
  Newspaper,
  BarChart3,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Zap,
  Globe,
  Award,
  ArrowRight,
  Check,
  X,
  Minus,
  Server,
  Cpu,
  Layers,
  Mail,
  Maximize,
  Minimize,
  Rocket,
  Smartphone,
  Code,
  Database,
} from "lucide-react";

/* ════════════════════════════════════════
   NEXIA PITCH DECK — IGNITE'26
   20 slides · dark theme · hover glow
   ════════════════════════════════════════ */

const TOTAL_SLIDES = 22;

// Sunucu notları — her slide için
const speakerNotes: Record<number, string> = {
  0: "Şu an Türkiye'de borsada yatırım yapan 8.5 milyon kişi var. Bunların %73'ü — yani 6 milyondan fazlası — yatırım kararlarını duygulara dayandırıyor. Nexia, bu tabloyu değiştirmek için burada.",
  1: "Türkiye'nin finansal okuryazarlık endeksi 100 üzerinden 62. Bloomberg yıllık 24 bin dolar. Midas ve Fintables temel işlemler için iyi ama risk analizi yok.",
  2: "Nexia, karmaşık verileri alıp günlük dile çeviriyor. 3 katmanda: güvenlik kalkanı, insan dilinde analiz, kişisel haber asistanı. Arkada 90+ quant fonksiyon çalışıyor.",
  3: "Gelişmekte olan ülkelerde 300 milyon+ yatırımcı var. Türkiye'de 8.6 milyon BIST yatırımcısı. İlk yıl 50 bin aktif kullanıcı hedefliyoruz.",
  4: "4 farklı persona ile gerçek insanlara odaklandık. Ece FOMO ile hareket eden öğrenci, Ahmet karar felci yaşayan baba, Muhittin teknoloji korkan emekli, Selin Bloomberg bütçesi olmayan CFO.",
  5: "Her persona için gerçek dünya senaryoları hazırladık. Nexia her birinde somut çözüm sunuyor.",
  6: "Altyapımızda 401 testle doğrulanmış 90+ quant fonksiyon çalışıyor. Monte Carlo, GARCH, Heston, kaos teorisi metrikleri — akademik seviyede araçlar.",
  7: "Frontend Next.js 16, backend FastAPI, AI katmanında FinBERT, quant engine'de 6 stokastik model. Tümü entegre çalışıyor.",
  8: "Rakiplerle karşılaştırmada güçlü yanımız derin analiz motoru ve Türkçe NLP. Zayıf yanımız henüz mobil uygulama olmaması ve sıfırdan başlıyor olmamız.",
  9: "Freemium model: ücretsiz katman ile kullanıcı edinme, Pro ₺199, Premium ₺499, Kurumsal özel teklif.",
  10: "3 gelir kanalı: B2C abonelik, API lisanslama, anonim veri analitiği. %96 brüt marj hedefliyoruz.",
  11: "CAPEX ~$1.330 + ₺18K kira. OPEX ~$230/ay. Kullanıcı başı maliyet $0.23 — Bloomberg'ün 10.000'de 1'i.",
  12: "Pro abonelik geliri ~$5.50, OPEX $0.23 — 24 kat brüt marj. Ölçeklendikçe marj %99'a çıkıyor.",
  13: "4 çeyrekte lansmanından ölçeklendirmeye. Q3 beta, Q4 Pro, Q1 mobil, Q2 uluslararası genişleme.",
  14: "Nexia sadece bir fikir değil — çalışan bir prototip. Canlı demo gösterebiliriz.",
  15: "2 yıllık vizyon: mobil uygulama, MENA genişleme, API marketplace, Series A hedefi.",
  16: "3 kişilik ekip: Yiğit sistem mimarisi, Ömer pazar araştırması, Barış iş modeli ve persona tasarımı.",
  17: "Türkiye'den başlayarak 4 bölgeye açılmayı planlıyoruz. Gelişmekte olan ülkelerde 300 milyonun üzerinde yatırımcı var ve çoğu profesyonel araçlara erişemiyor.",
  18: "Üç exit senaryomuz var. Öncelikli olarak stratejik satın alma — aracı kurum veya fintech tarafından. Alternatif olarak venture backed growth ya da kârlı bağımsız şirket modeli.",
  19: "Finansal güvenlik bir lüks değil, temel haktır. Nexia bu hakkı 8.6 milyon insanın cebine taşıyor.",
  20: "Sunumumuzu dinlediğiniz için teşekkür ederiz. Sorularınızı almaktan mutluluk duyarız.",
  21: "Nexia tanıtım videosu — ürünümüzün çalışan halini izliyorsunuz.",
};

export default function PitchPage() {
  const [current, setCurrent] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [slideKey, setSlideKey] = useState(0);
  const [isDark, setIsDark] = useState(true); // default dark
  const containerRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (dir: number) => {
      setCurrent((p) => Math.max(0, Math.min(TOTAL_SLIDES - 1, p + dir)));
      setSlideKey((k) => k + 1);
    },
    []
  );

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case " ":
        case "PageDown":
          e.preventDefault();
          go(1);
          break;
        case "n":
        case "N":
          e.preventDefault();
          setShowNotes((v) => !v);
          break;
        case "ArrowLeft":
        case "p":
        case "P":
        case "PageUp":
          e.preventDefault();
          go(-1);
          break;
        case "Home":
          e.preventDefault();
          setCurrent(0);
          break;
        case "End":
          e.preventDefault();
          setCurrent(TOTAL_SLIDES - 1);
          break;
        case "f":
        case "F":
        case "F11":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "d":
        case "D":
          e.preventDefault();
          setIsDark((v) => !v);
          break;
        case "Escape":
          if (document.fullscreenElement) {
            document.exitFullscreen();
            setIsFullscreen(false);
          }
          break;
      }
    };

    const fsHandler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    window.addEventListener("keydown", handler);
    document.addEventListener("fullscreenchange", fsHandler);
    return () => {
      window.removeEventListener("keydown", handler);
      document.removeEventListener("fullscreenchange", fsHandler);
    };
  }, [go, toggleFullscreen]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      ref={containerRef}
      className={`relative h-screen w-screen overflow-hidden select-none transition-colors duration-500 ${isDark ? "pitch-dark" : "pitch-light"}`}
      onMouseMove={handleMouseMove}
    >
      {/* Ambient multi-glow following mouse */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-all duration-500"
        style={{
          background: `
            radial-gradient(900px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16,185,129,0.06), transparent 50%),
            radial-gradient(600px circle at ${mousePos.x + 200}px ${mousePos.y - 100}px, rgba(45,212,191,0.04), transparent 50%),
            radial-gradient(400px circle at ${mousePos.x - 150}px ${mousePos.y + 80}px, rgba(99,102,241,0.03), transparent 50%)
          `,
        }}
      />

      {/* Floating particles */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-emerald-500/15 animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${10 + i * 12}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${6 + i * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Slide container */}
      <div className={`relative z-10 h-full w-full transition-all duration-300 ${showNotes ? "pb-[18vh]" : ""}`}>
        {slides.map((Slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 flex flex-col items-center justify-center px-[5vw] py-[4vh] transition-all duration-600 ease-out ${
              i === current
                ? "opacity-100 translate-x-0 scale-100"
                : i < current
                ? "opacity-0 -translate-x-[30%] scale-90 pointer-events-none"
                : "opacity-0 translate-x-[30%] scale-90 pointer-events-none"
            }`}
          >
            <Slide mousePos={mousePos} slideKey={slideKey} />
          </div>
        ))}
      </div>

      {/* Speaker notes panel */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-500 ${showNotes ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
        <div className="mx-[3vw] mb-[6vh] bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-5 shadow-2xl shadow-gray-300/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">Sunucu Notları</span>
            <button onClick={() => setShowNotes(false)} className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors px-2 py-0.5 rounded border border-gray-200">
              ESC / N
            </button>
          </div>
          <p className="text-[clamp(13px,1.3vw,17px)] text-gray-700 leading-relaxed">
            {speakerNotes[current] || "Bu slayt için not bulunmuyor."}
          </p>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-[2vh] left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-black/[0.03] backdrop-blur-md border border-black/[0.08] rounded-full px-4 py-2">
        <button
          onClick={() => go(-1)}
          disabled={current === 0}
          className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-20 transition-all hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-500 rounded-full ${
                i === current
                  ? "w-6 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400 shadow-lg shadow-emerald-500/30"
                  : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => go(1)}
          disabled={current === TOTAL_SLIDES - 1}
          className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-20 transition-all hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Top bar */}
      <div className="fixed top-[2vh] right-[2vw] z-50 flex items-center gap-2">
        <span className="text-[10px] pitch-muted font-mono">
          {String(current + 1).padStart(2, "0")}/{TOTAL_SLIDES}
        </span>
        <button
          onClick={() => setIsDark((v) => !v)}
          className="p-1.5 rounded-lg pitch-card-bg pitch-border hover:opacity-80 transition-all hover:scale-110"
          title="Tema değiştir (D)"
        >
          {isDark ? (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          )}
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg pitch-card-bg pitch-border hover:opacity-80 transition-all hover:scale-110"
          title="Tam ekran (F)"
        >
          {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Notes toggle button + keyboard hints */}
      <div className="fixed top-[2vh] left-[2vw] z-50 flex items-center gap-3">
        <button
          onClick={() => setShowNotes((v) => !v)}
          className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-300 text-[11px] font-medium ${
            showNotes
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-black/[0.03] border-black/[0.08] text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="hidden group-hover:inline">Notlar</span>
        </button>
        <div className="hidden md:flex items-center gap-2 text-[9px] text-gray-300 font-mono">
          <span className="px-1.5 py-0.5 rounded border border-gray-200">←→</span>
          <span>gezin</span>
          <span className="px-1.5 py-0.5 rounded border border-gray-200 ml-1">F</span>
          <span>tam ekran</span>
          <span className="px-1.5 py-0.5 rounded border border-gray-200 ml-1">N</span>
          <span>notlar</span>
          <span className="px-1.5 py-0.5 rounded border border-gray-200 ml-1">D</span>
          <span>tema</span>
        </div>
      </div>

      {/* CSS animations + theme */}
      <style jsx global>{`
        /* ═══ DARK THEME (default) ═══ */
        .pitch-dark {
          background: #09090b;
          color: #fafafa;
        }
        .pitch-dark .pitch-card-bg { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.06); }
        .pitch-dark .pitch-border { border-color: rgba(255,255,255,0.06); }
        .pitch-dark .pitch-muted { color: rgba(255,255,255,0.3); }

        /* ═══ LIGHT THEME ═══ */
        .pitch-light {
          background: #fafafa;
          color: #1a1a2e;
        }
        .pitch-light .pitch-card-bg { background: rgba(0,0,0,0.02); border-color: rgba(0,0,0,0.08); }
        .pitch-light .pitch-border { border-color: rgba(0,0,0,0.08); }
        .pitch-light .pitch-muted { color: rgba(0,0,0,0.35); }

        /* Light theme overrides for tailwind classes */
        .pitch-light .text-gray-300 { color: #9ca3af; }
        .pitch-light .text-gray-400 { color: #6b7280; }
        .pitch-light .text-gray-500 { color: #4b5563; }
        .pitch-light .text-gray-600 { color: #374151; }
        .pitch-light .text-gray-700 { color: #1f2937; }
        .pitch-light .text-gray-800 { color: #111827; }
        .pitch-light .text-gray-900 { color: #030712; }
        .pitch-light .border-gray-100 { border-color: #e5e7eb; }
        .pitch-light .border-gray-200 { border-color: #d1d5db; }

        /* Dark theme overrides — restore white-based text */
        .pitch-dark .text-gray-300 { color: rgba(255,255,255,0.15); }
        .pitch-dark .text-gray-400 { color: rgba(255,255,255,0.30); }
        .pitch-dark .text-gray-500 { color: rgba(255,255,255,0.45); }
        .pitch-dark .text-gray-600 { color: rgba(255,255,255,0.55); }
        .pitch-dark .text-gray-700 { color: rgba(255,255,255,0.70); }
        .pitch-dark .text-gray-800 { color: rgba(255,255,255,0.80); }
        .pitch-dark .text-gray-900 { color: rgba(255,255,255,0.90); }
        .pitch-dark .border-gray-100 { border-color: rgba(255,255,255,0.05); }
        .pitch-dark .border-gray-200 { border-color: rgba(255,255,255,0.08); }
        .pitch-dark .bg-gray-100 { background: rgba(255,255,255,0.05); }
        .pitch-dark .bg-gray-200 { background: rgba(255,255,255,0.10); }
        .pitch-dark .bg-gray-300 { background: rgba(255,255,255,0.15); }
        .pitch-dark .bg-gray-400 { background: rgba(255,255,255,0.25); }
        .pitch-dark .from-gray-900 { --tw-gradient-from: #fafafa; }
        .pitch-dark .to-gray-600 { --tw-gradient-to: rgba(255,255,255,0.70); }

        /* Dark notes panel */
        .pitch-dark .bg-white\\/90 { background: rgba(0,0,0,0.85) !important; }
        .pitch-dark .shadow-gray-300\\/50 { box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5) !important; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.2; }
          50% { transform: translateY(-30px) scale(1.5); opacity: 0.5; }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }

        @keyframes card-entrance {
          from { opacity: 0; transform: translateY(24px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes auto-glow-pulse {
          0%, 100% { box-shadow: 0 0 0 0 transparent; transform: scale(1); }
          50% { box-shadow: 0 0 30px 4px rgba(16,185,129,0.15); transform: scale(1.02) translateY(-2px); }
        }

        @keyframes auto-shimmer {
          0% { opacity: 0; }
          30% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-auto-shimmer { animation: auto-shimmer 2s ease-in-out forwards; }

        @keyframes auto-border-glow {
          0%, 100% { border-color: rgba(0,0,0,0.08); }
          50% { border-color: rgba(16,185,129,0.4); }
        }
        .animate-auto-glow { animation: auto-border-glow 3s ease-in-out 1.5s 2; }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════
   REUSABLE COMPONENTS
   ═══════════════════════════════════ */

interface SlideProps {
  mousePos: { x: number; y: number };
  slideKey: number;
}

function GlowCard({
  children,
  className = "",
  glowColor = "emerald",
  delay = 0,
  autoGlow = false,
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  delay?: number;
  autoGlow?: boolean;
}) {
  const glowMap: Record<string, string> = {
    emerald: "hover:shadow-emerald-500/25 hover:border-emerald-500/40 before:bg-emerald-500/10",
    amber: "hover:shadow-amber-500/25 hover:border-amber-500/40 before:bg-amber-500/10",
    red: "hover:shadow-red-500/25 hover:border-red-500/40 before:bg-red-500/10",
    violet: "hover:shadow-violet-500/25 hover:border-violet-500/40 before:bg-violet-500/10",
    blue: "hover:shadow-blue-500/25 hover:border-blue-500/40 before:bg-blue-500/10",
    teal: "hover:shadow-teal-500/25 hover:border-teal-500/40 before:bg-teal-500/10",
  };

  return (
    <div
      className={`group relative bg-black/[0.02] backdrop-blur-sm border border-black/[0.08] rounded-2xl p-[clamp(1rem,2vw,1.5rem)]
      transition-all duration-500 hover:bg-black/[0.04] hover:shadow-2xl hover:-translate-y-1.5 hover:scale-[1.02]
      before:absolute before:inset-0 before:rounded-2xl before:opacity-0 before:transition-opacity before:duration-500
      hover:before:opacity-100
      ${autoGlow ? "animate-auto-glow" : ""}
      ${glowMap[glowColor] || glowMap.emerald} ${className}`}
      style={{
        animationDelay: delay ? `${delay}ms` : undefined,
        opacity: delay ? 0 : undefined,
        animation: delay
          ? `card-entrance 0.6s ease-out ${delay}ms forwards${autoGlow ? `, auto-glow-pulse 3s ease-in-out ${delay + 1500}ms 2` : ""}`
          : autoGlow
          ? "auto-glow-pulse 3s ease-in-out 1s 2"
          : undefined,
      }}
    >
      {/* Shimmer sweep on hover + auto shimmer */}
      <div className={`absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${autoGlow ? "animate-auto-shimmer" : ""}`}
        style={autoGlow ? { animationDelay: `${delay + 800}ms` } : undefined}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function Tag({ children, color = "emerald" }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    emerald: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    amber: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    red: "text-red-400 border-red-500/30 bg-red-500/10",
    violet: "text-violet-400 border-violet-500/30 bg-violet-500/10",
    blue: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    teal: "text-teal-400 border-teal-500/30 bg-teal-500/10",
  };
  return (
    <span className={`text-[clamp(8px,1vw,12px)] font-semibold tracking-wider uppercase px-3 py-1 rounded-full border ${colors[color] || colors.emerald}`}>
      {children}
    </span>
  );
}

function StatCard({ value, label, color = "emerald" }: { value: string; label: string; color?: string }) {
  const gradients: Record<string, string> = {
    emerald: "from-emerald-400 to-teal-400",
    red: "from-red-400 to-orange-400",
    amber: "from-amber-400 to-yellow-300",
    violet: "from-violet-400 to-purple-400",
    blue: "from-blue-400 to-cyan-400",
    teal: "from-teal-400 to-cyan-400",
  };
  return (
    <GlowCard glowColor={color} className="text-center">
      <div className={`text-[clamp(1.5rem,3.5vw,2.5rem)] font-extrabold mb-1 bg-gradient-to-r ${gradients[color] || gradients.emerald} bg-clip-text text-transparent`}>
        {value}
      </div>
      <div className="text-[clamp(9px,1vw,13px)] text-gray-500">{label}</div>
    </GlowCard>
  );
}

function SectionTitle({ tag, title, subtitle }: { tag: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-[clamp(2rem,4vh,3rem)]">
      <Tag>{tag}</Tag>
      <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold mt-4 tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent leading-tight">
        {title}
      </h2>
      {subtitle && <p className="text-[clamp(13px,1.5vw,18px)] text-gray-400 mt-3 max-w-3xl mx-auto">{subtitle}</p>}
    </div>
  );
}

/* ═══════════════════════════════════
   20 SLIDES
   ═══════════════════════════════════ */

// ─── 1: Kapak ───
function SlideCover({}: SlideProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-[2vh]">
      <div className="relative group cursor-pointer">
        <div className="absolute -inset-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-3xl opacity-20 group-hover:opacity-50 transition-opacity duration-700 animate-pulse" />
        <div className="absolute -inset-10 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-emerald-500/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative w-[clamp(4rem,10vw,7rem)] h-[clamp(4rem,10vw,7rem)] bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-700">
          <span className="text-[clamp(1.5rem,4vw,3rem)] font-black text-white tracking-tighter">NX</span>
        </div>
      </div>

      <h1 className="text-[clamp(3rem,9vw,6rem)] font-black tracking-tighter bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 bg-clip-text text-transparent leading-none">
        NEXIA
      </h1>

      <p className="text-[clamp(1rem,2.2vw,1.6rem)] text-gray-500 font-light tracking-wide italic">
        &ldquo;7&apos;den 70&apos;e, Herkes İçin Finansal Güvenlik&rdquo;
      </p>

      <div className="flex items-center gap-3 mt-2">
        <Tag>IGNITE&apos;26</Tag>
        <span className="text-gray-300">|</span>
        <span className="text-[clamp(10px,1.1vw,14px)] text-gray-400">Barış &middot; Ömer &middot; Yiğit</span>
      </div>

      <div className="mt-[3vh] flex items-center gap-2 text-gray-300 text-[clamp(10px,1vw,13px)] animate-bounce">
        <span>Başlamak için</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
}

// ─── 2: Problem ───
function SlideProblem({}: SlideProps) {
  const problems = [
    { icon: BarChart3, stat: "62/100", label: "Finansal okuryazarlık endeksi", color: "red" },
    { icon: DollarSign, stat: "$24K/yıl", label: "Bloomberg erişim maliyeti", color: "amber" },
    { icon: Users, stat: "%73", label: "Duygusal karar veren yatırımcı", color: "red" },
    { icon: Shield, stat: "8.6M", label: "Korumasız bireysel yatırımcı", color: "amber" },
  ];

  return (
    <div className="w-full max-w-[90vw] xl:max-w-6xl">
      <SectionTitle
        tag="Problem"
        title="₺2.1 Trilyon Risk Altında"
        subtitle="Türkiye'de milyonlarca yatırımcı bilgisiz, korumasız ve manipülasyona açık"
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[clamp(0.5rem,1.5vw,1rem)] mb-[2vh]">
        {problems.map((p, i) => (
          <GlowCard key={i} glowColor={p.color} className="text-center" delay={i * 150} autoGlow={i === 2}>
            <p.icon className={`w-[clamp(1.2rem,2.5vw,2rem)] h-[clamp(1.2rem,2.5vw,2rem)] mx-auto mb-2 ${p.color === "red" ? "text-red-400" : "text-amber-400"}`} />
            <div className={`text-[clamp(1.3rem,3vw,2.2rem)] font-extrabold mb-0.5 ${p.color === "red" ? "text-red-400" : "text-amber-400"}`}>{p.stat}</div>
            <div className="text-[clamp(8px,0.9vw,12px)] text-gray-400">{p.label}</div>
          </GlowCard>
        ))}
      </div>
      <GlowCard glowColor="red" className="text-center">
        <p className="text-[clamp(11px,1.2vw,15px)] text-gray-500">
          Mevcut çözümler (Midas, Fintables): <span className="text-red-400 font-semibold">Sadece al-sat. Risk analizi yok.</span>
        </p>
      </GlowCard>
    </div>
  );
}

// ─── 3: Çözüm ───
function SlideSolution({}: SlideProps) {
  const features = [
    { icon: Shield, title: "Güvenlik Kalkanı", desc: "Sahte tüyoları filtrele, pump-and-dump tespiti, manipülasyon uyarısı", color: "text-emerald-400" },
    { icon: Brain, title: "İnsan Dilinde Analiz", desc: "'Sharpe oranı 1.84' değil → 'Portföyün sağlıklı, risk düşük'", color: "text-teal-400" },
    { icon: Newspaper, title: "Kişisel Haber Asistanı", desc: "Haberleri senin adına okur: 'Bu gelişme seni nasıl etkiler?'", color: "text-blue-400" },
    { icon: BarChart3, title: "Profesyonel Altyapı", desc: "90+ kantitatif fonksiyon, 6 stokastik model, kaos teorisi metrikleri", color: "text-violet-400" },
  ];

  return (
    <div className="w-full max-w-[90vw] xl:max-w-6xl">
      <SectionTitle tag="Çözüm" title="Bloomberg Zekâsı, WhatsApp Sadeliği" subtitle="Karmaşık veriyi, günlük hayatta herkesin anlayacağı dile çeviriyoruz" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(0.5rem,1.5vw,1.2rem)]">
        {features.map((f, i) => (
          <GlowCard key={i} glowColor={["emerald","teal","blue","violet"][i]} delay={i * 200} autoGlow={i === 0}>
            <div className="flex items-start gap-[clamp(0.5rem,1.5vw,1rem)]">
              <div className={`p-[clamp(0.5rem,1vw,0.75rem)] rounded-xl bg-gray-100 ${f.color} shrink-0`}>
                <f.icon className="w-[clamp(1rem,2vw,1.5rem)] h-[clamp(1rem,2vw,1.5rem)]" />
              </div>
              <div>
                <h3 className="text-[clamp(12px,1.3vw,16px)] font-bold mb-1">{f.title}</h3>
                <p className="text-[clamp(10px,1vw,13px)] text-gray-500">{f.desc}</p>
              </div>
            </div>
          </GlowCard>
        ))}
      </div>
    </div>
  );
}

// ─── 4: TAM SAM SOM ───
function SlideTamSamSom({}: SlideProps) {
  return (
    <div className="w-full max-w-[90vw] xl:max-w-6xl">
      <SectionTitle tag="Pazar Büyüklüğü" title="TAM / SAM / SOM" />
      <div className="grid grid-cols-3 gap-[clamp(0.75rem,2vw,1.5rem)]">
        {/* TAM */}
        <GlowCard glowColor="emerald" className="text-center !py-[clamp(2rem,4vh,3rem)]">
          <div className="w-[clamp(3rem,5vw,4.5rem)] h-[clamp(3rem,5vw,4.5rem)] rounded-full border-2 border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <Globe className="w-[clamp(1.2rem,2.5vw,2rem)] h-[clamp(1.2rem,2.5vw,2rem)] text-emerald-400" />
          </div>
          <div className="text-[clamp(9px,1vw,12px)] text-emerald-400/60 font-bold tracking-[0.2em] uppercase mb-2">TAM — Global Pazar</div>
          <div className="text-[clamp(2.5rem,5vw,4rem)] font-black text-emerald-400 leading-none mb-2">300M+</div>
          <div className="text-[clamp(11px,1.2vw,15px)] text-gray-500 leading-relaxed">Gelişmekte olan ülkelerdeki<br />bireysel yatırımcı sayısı</div>
          <div className="mt-3 text-[clamp(9px,0.9vw,12px)] text-emerald-400/40 font-medium">Hindistan, Brezilya, Meksika, MENA...</div>
        </GlowCard>

        {/* SAM */}
        <GlowCard glowColor="teal" className="text-center !py-[clamp(2rem,4vh,3rem)]">
          <div className="w-[clamp(3rem,5vw,4.5rem)] h-[clamp(3rem,5vw,4.5rem)] rounded-full border-2 border-teal-500/30 bg-teal-500/10 flex items-center justify-center mx-auto mb-4">
            <Target className="w-[clamp(1.2rem,2.5vw,2rem)] h-[clamp(1.2rem,2.5vw,2rem)] text-teal-400" />
          </div>
          <div className="text-[clamp(9px,1vw,12px)] text-teal-400/60 font-bold tracking-[0.2em] uppercase mb-2">SAM — Türkiye</div>
          <div className="text-[clamp(2.5rem,5vw,4rem)] font-black text-teal-400 leading-none mb-2">8.6M</div>
          <div className="text-[clamp(11px,1.2vw,15px)] text-gray-500 leading-relaxed">Borsa İstanbul&apos;da işlem yapan<br />aktif bireysel yatırımcı</div>
          <div className="mt-3 text-[clamp(9px,0.9vw,12px)] text-teal-400/40 font-medium">₺2.1 trilyon toplam portföy değeri</div>
        </GlowCard>

        {/* SOM */}
        <GlowCard glowColor="blue" className="text-center !py-[clamp(2rem,4vh,3rem)]">
          <div className="w-[clamp(3rem,5vw,4.5rem)] h-[clamp(3rem,5vw,4.5rem)] rounded-full border-2 border-blue-500/30 bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
            <Users className="w-[clamp(1.2rem,2.5vw,2rem)] h-[clamp(1.2rem,2.5vw,2rem)] text-blue-400" />
          </div>
          <div className="text-[clamp(9px,1vw,12px)] text-blue-400/60 font-bold tracking-[0.2em] uppercase mb-2">SOM — Yıl 1 Hedef</div>
          <div className="text-[clamp(2.5rem,5vw,4rem)] font-black text-blue-400 leading-none mb-2">50K</div>
          <div className="text-[clamp(11px,1.2vw,15px)] text-gray-500 leading-relaxed">İlk yıl sonunda ulaşılacak<br />aktif kullanıcı hedefi</div>
          <div className="mt-3 text-[clamp(9px,0.9vw,12px)] text-blue-400/40 font-medium">%8 Pro dönüşüm → 4K ücretli abone</div>
        </GlowCard>
      </div>
    </div>
  );
}

// ─── 5: Personalar (tek sayfa) ───
function SlidePersonas({}: SlideProps) {
  const personas = [
    { name: "Ece Koç", age: 18, role: "Üniversite öğrencisi", tag: "B2C", color: "amber", pain: "FOMO, TikTok tüyolarına güveniyor", solution: "Manipülasyon kalkanı + eğitici mod" },
    { name: "Ahmet Yıldız", age: 34, role: "İK Uzmanı", tag: "B2C", color: "emerald", pain: "Karar felci, düşük finansal okuryazarlık", solution: "Sade arayüz + net mesajlar" },
    { name: "Muhittin Arslan", age: 67, role: "Emekli memur", tag: "B2C", color: "blue", pain: "Teknoloji korkusu, panik satış eğilimi", solution: "'Anaparan güvende' sakinleştirici" },
    { name: "Selin Demir", age: 38, role: "CFO · Üretim şirketi", tag: "B2B", color: "red", pain: "Bloomberg bütçesi yok, 4 saat rapor", solution: "30 sn otomatik risk raporu" },
  ];

  return (
    <div className="w-full max-w-[90vw] xl:max-w-6xl">
      <SectionTitle tag="Hedef Kitle" title="8.6 Milyon Yatırımcı. Tek Platform." subtitle="4 persona — B2C bireysel + B2B kurumsal" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[clamp(0.5rem,1vw,1rem)]">
        {personas.map((p, i) => (
          <GlowCard key={i} glowColor={p.color}>
            <div className="flex items-center gap-2 mb-3">
              <Tag color={p.color}>{p.tag}</Tag>
            </div>
            <h4 className="font-bold text-[clamp(12px,1.2vw,15px)]">{p.name}, {p.age}</h4>
            <p className="text-[clamp(9px,0.8vw,11px)] text-gray-400 mb-3">{p.role}</p>
            <div className="space-y-2">
              <div className="flex items-start gap-1.5">
                <X className="w-3 h-3 text-red-400 mt-0.5 shrink-0" />
                <span className="text-[clamp(9px,0.9vw,12px)] text-gray-500">{p.pain}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Check className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-[clamp(9px,0.9vw,12px)] text-emerald-400/70">{p.solution}</span>
              </div>
            </div>
          </GlowCard>
        ))}
      </div>
    </div>
  );
}

// ─── 6: Edge Cases ───
function SlideUseCases({}: SlideProps) {
  const cases = [
    { persona: "Ece (18)", scenario: "TikTok'ta 'SASA uçacak' postu gördü", without: "Hemen alır, pump-dump'a kurban gider", with: "Nexia uyarı: 'Bu hesabın manipülasyon skoru yüksek!'", color: "amber" },
    { persona: "Ahmet (34)", scenario: "Faiz kararı açıklandı, ne yapacağını bilmiyor", without: "Panik yapar, parasını mevduata atar", with: "Nexia özet: 'Faiz artışı portföyünü %2 olumlu etkiler'", color: "emerald" },
    { persona: "Muhittin (67)", scenario: "Borsa %5 düştü, kıyamet senaryoları", without: "Tüm portföyünü panik satış yapar", with: "Nexia: 'Anaparan güvende, uzun vadede sorun yok'", color: "blue" },
    { persona: "Selin (38)", scenario: "Dolar %3 yükseldi, yönetim kurulu rapor istiyor", without: "4 saat Excel'de rapor hazırlar", with: "Nexia 30 saniyede profesyonel risk raporu üretir", color: "red" },
  ];

  return (
    <div className="w-full max-w-[90vw] xl:max-w-6xl">
      <SectionTitle tag="Kullanım Senaryoları" title="Edge Cases & Persona Uygulamaları" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(0.5rem,1vw,1rem)]">
        {cases.map((c, i) => (
          <GlowCard key={i} glowColor={c.color}>
            <div className="flex items-center gap-2 mb-2">
              <Tag color={c.color}>{c.persona}</Tag>
            </div>
            <p className="text-[clamp(10px,1.1vw,14px)] text-gray-600 mb-3 font-medium">{c.scenario}</p>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2 text-[clamp(9px,1vw,13px)]">
                <X className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                <span className="text-gray-400">{c.without}</span>
              </div>
              <div className="flex items-start gap-2 text-[clamp(9px,1vw,13px)]">
                <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-emerald-400/70">{c.with}</span>
              </div>
            </div>
          </GlowCard>
        ))}
      </div>
    </div>
  );
}

// ─── 7: Ürün Altyapısı ───
function SlideProduct({}: SlideProps) {
  const features = [
    { label: "Kantitatif Fonksiyon", value: "90+", desc: "Sharpe, Sortino, VaR, CVaR, Monte Carlo..." },
    { label: "Stokastik Model", value: "6", desc: "GBM, GARCH, Heston, Jump-Diffusion, O-U, Kaos" },
    { label: "Teknik İndikatör", value: "11", desc: "RSI, MACD, Bollinger, ADX, ATR, Stochastic..." },
    { label: "Test Kapsaması", value: "401+", desc: "Doğrulanmış birim ve entegrasyon testleri" },
    { label: "Sentiment Modeli", value: "FinBERT", desc: "Türkçe finans haberlerinde %87+ doğruluk" },
    { label: "Veri Kaynakları", value: "5+", desc: "Yahoo Finance, BIST, KAP, TCMB, NewsAPI" },
  ];

  return (
    <div className="w-full max-w-[90vw] xl:max-w-6xl">
      <SectionTitle tag="Ürün" title="Altyapıda Ne Çalışıyor?" subtitle="Kullanıcı görmüyor ama arkada profesyonel seviyede analiz motoru çalışıyor" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-[clamp(0.5rem,1vw,1rem)]">
        {features.map((f, i) => (
          <GlowCard key={i} glowColor={i % 2 === 0 ? "emerald" : "teal"}>
            <div className="text-[clamp(1.3rem,2.8vw,2.2rem)] font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">{f.value}</div>
            <div className="text-[clamp(10px,1.1vw,14px)] font-semibold text-gray-700 mb-0.5">{f.label}</div>
            <div className="text-[clamp(8px,0.9vw,12px)] text-gray-400">{f.desc}</div>
          </GlowCard>
        ))}
      </div>
    </div>
  );
}

// ─── 8: Sistem Mimarisi ───
function SlideArchitecture({}: SlideProps) {
  const layers = [
    { icon: Globe, title: "Frontend", items: ["Next.js 16 + React 19", "Tailwind CSS v4", "Lightweight Charts"], color: "text-blue-400", glow: "blue" },
    { icon: Server, title: "Backend API", items: ["FastAPI (Python)", "60+ REST endpoint", "JWT + 2FA Auth"], color: "text-emerald-400", glow: "emerald" },
    { icon: Brain, title: "AI & ML", items: ["FinBERT (Türkçe NLP)", "Sentiment Analizi", "Manipülasyon Tespiti"], color: "text-violet-400", glow: "violet" },
    { icon: Cpu, title: "Quant Engine", items: ["Monte Carlo Sim.", "GARCH Volatilite", "Heston & Kaos Teorisi"], color: "text-teal-400", glow: "teal" },
    { icon: Layers, title: "Veri Katmanı", items: ["Yahoo Finance (anlık)", "BIST / KAP / TCMB", "Redis Cache"], color: "text-amber-400", glow: "amber" },
    { icon: Shield, title: "Güvenlik", items: ["RBAC yetkilendirme", "PBKDF2 + TOTP 2FA", "Audit trail"], color: "text-red-400", glow: "red" },
  ];

  return (
    <div className="w-full max-w-[90vw] xl:max-w-6xl">
      <SectionTitle tag="Mimari" title="Sistem Mimarisi" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-[clamp(0.5rem,1vw,1rem)]">
        {layers.map((l, i) => (
          <GlowCard key={i} glowColor={l.glow}>
            <l.icon className={`w-[clamp(1rem,2vw,1.5rem)] h-[clamp(1rem,2vw,1.5rem)] mb-2 ${l.color}`} />
            <h4 className="font-bold text-[clamp(11px,1.1vw,14px)] mb-2">{l.title}</h4>
            <ul className="space-y-1">
              {l.items.map((item, j) => (
                <li key={j} className="text-[clamp(8px,0.9vw,12px)] text-gray-500 flex items-center gap-1.5">
                  <div className={`w-1 h-1 rounded-full shrink-0 ${l.color.replace("text-", "bg-")}`} />
                  {item}
                </li>
              ))}
            </ul>
          </GlowCard>
        ))}
      </div>
    </div>
  );
}

// ─── 9: Rakip Analizi ───
function SlideCompetitor({}: SlideProps) {
  type CellVal = "yes" | "no" | "partial" | string;
  const rows: { label: string; midas: CellVal; fintables: CellVal; bloomberg: CellVal; nexia: CellVal }[] = [
    { label: "Risk Analizi (VaR, CVaR)", midas: "no", fintables: "no", bloomberg: "yes", nexia: "yes" },
    { label: "Türkçe AI Asistan", midas: "no", fintables: "no", bloomberg: "no", nexia: "yes" },
    { label: "Stokastik Modeller", midas: "no", fintables: "no", bloomberg: "yes", nexia: "yes" },
    { label: "KAP/BIST/TCMB Entegrasyon", midas: "partial", fintables: "partial", bloomberg: "no", nexia: "yes" },
    { label: "Haber Kaynakları & Sentiment", midas: "partial", fintables: "partial", bloomberg: "yes", nexia: "partial" },
    { label: "Temel Analiz Paketi", midas: "partial", fintables: "yes", bloomberg: "yes", nexia: "partial" },
    { label: "Mobil Uygulama", midas: "yes", fintables: "yes", bloomberg: "yes", nexia: "no" },
    { label: "Kullanıcı Tabanı", midas: "1M+", fintables: "200K+", bloomberg: "350K+", nexia: "Yeni" },
    { label: "Aylık Maliyet", midas: "Ücretsiz", fintables: "~240₺", bloomberg: "~$2K", nexia: "199₺" },
  ];

  const renderCell = (val: CellVal) => {
    if (val === "yes") return <Check className="w-3.5 h-3.5 text-emerald-400 mx-auto" />;
    if (val === "no") return <X className="w-3.5 h-3.5 text-red-400/40 mx-auto" />;
    if (val === "partial") return <Minus className="w-3.5 h-3.5 text-amber-400 mx-auto" />;
    return <span className="text-[clamp(9px,0.9vw,12px)] text-gray-500">{val}</span>;
  };

  return (
    <div className="w-full max-w-[85vw] xl:max-w-5xl">
      <SectionTitle tag="Rekabet Analizi" title="Piyasadaki Konumumuz" subtitle="Realist karşılaştırma — güçlü ve zayıf yanlarımız" />
      <GlowCard className="overflow-hidden !p-0">
        <table className="w-full text-[clamp(9px,1vw,13px)]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-2 md:p-3 text-gray-400 font-medium">Kriter</th>
              <th className="p-2 md:p-3 text-gray-400">Midas</th>
              <th className="p-2 md:p-3 text-gray-400">Fintables</th>
              <th className="p-2 md:p-3 text-gray-400">Bloomberg</th>
              <th className="p-2 md:p-3 text-emerald-400 font-bold">NEXIA</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-black/[0.02] transition-colors">
                <td className="p-2 md:p-3 text-gray-600 font-medium">{r.label}</td>
                <td className="p-2 md:p-3 text-center">{renderCell(r.midas)}</td>
                <td className="p-2 md:p-3 text-center">{renderCell(r.fintables)}</td>
                <td className="p-2 md:p-3 text-center">{renderCell(r.bloomberg)}</td>
                <td className="p-2 md:p-3 text-center bg-emerald-500/[0.04]">{renderCell(r.nexia)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlowCard>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <GlowCard glowColor="emerald" className="!py-2 !px-3">
          <p className="text-[clamp(8px,0.8vw,11px)] text-emerald-400 font-semibold mb-0.5">GÜÇLÜ YANLARIMIZ</p>
          <p className="text-[clamp(8px,0.8vw,11px)] text-gray-500">Derin analiz motoru, Türkçe NLP, manipülasyon koruması</p>
        </GlowCard>
        <GlowCard glowColor="amber" className="!py-2 !px-3">
          <p className="text-[clamp(8px,0.8vw,11px)] text-amber-400 font-semibold mb-0.5">ZAYIF YANLARIMIZ</p>
          <p className="text-[clamp(8px,0.8vw,11px)] text-gray-500">Henüz mobil yok, kullanıcı tabanı sıfırdan, marka bilinirliği düşük</p>
        </GlowCard>
      </div>
    </div>
  );
}

// ─── 10: Fiyatlandırma ───
function SlidePricing({}: SlideProps) {
  const plans = [
    { name: "Ücretsiz", price: "₺0", period: "sonsuza dek", highlight: false, glow: "blue", features: ["3 hisse takibi", "Temel indikatörler", "Sınırlı AI (5 soru/gün)"] },
    { name: "Pro", price: "₺199", period: "/ay", highlight: true, glow: "emerald", features: ["Sınırsız hisse", "Tüm quant modeller", "Sınırsız AI", "Günlük PDF rapor", "FinBERT sentiment"] },
    { name: "Premium", price: "₺499", period: "/ay", highlight: false, glow: "violet", features: ["Pro + her şey", "Kaos teorisi", "Stokastik modeller", "API erişimi (1K/gün)"] },
    { name: "Kurumsal", price: "Özel", period: "teklif", highlight: false, glow: "amber", features: ["Sınırsız API", "Çoklu kullanıcı (RBAC)", "Beyaz etiket", "SLA garantisi"] },
  ];

  return (
    <div className="w-full max-w-[90vw] xl:max-w-6xl">
      <SectionTitle tag="Fiyatlandırma" title="Her Bütçeye Uygun Plan" subtitle="Bloomberg kalitesi, cep dostu fiyat" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[clamp(0.5rem,1vw,1rem)]">
        {plans.map((p, i) => (
          <GlowCard key={i} glowColor={p.glow} className={p.highlight ? "ring-1 ring-emerald-500/30" : ""}>
            {p.highlight && <div className="text-[clamp(7px,0.7vw,10px)] text-emerald-400 font-bold uppercase tracking-wider mb-1">En Popüler</div>}
            <h4 className="text-[clamp(12px,1.2vw,16px)] font-bold mb-1">{p.name}</h4>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-[clamp(1.3rem,2.5vw,2rem)] font-extrabold">{p.price}</span>
              <span className="text-[clamp(9px,0.8vw,12px)] text-gray-400">{p.period}</span>
            </div>
            <ul className="space-y-1.5">
              {p.features.map((f, j) => (
                <li key={j} className="text-[clamp(8px,0.9vw,12px)] text-gray-500 flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />{f}
                </li>
              ))}
            </ul>
          </GlowCard>
        ))}
      </div>
    </div>
  );
}

// ─── 11: İş Modeli ───
function SlideBusinessModel({}: SlideProps) {
  return (
    <div className="w-full max-w-[85vw] xl:max-w-5xl">
      <SectionTitle tag="İş Modeli" title="Gelir Kanalları & Sürdürülebilirlik" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(0.5rem,1.5vw,1.2rem)] mb-[2vh]">
        <GlowCard glowColor="emerald">
          <DollarSign className="w-[clamp(1.2rem,2vw,2rem)] h-[clamp(1.2rem,2vw,2rem)] text-emerald-400 mb-2" />
          <h4 className="font-bold text-[clamp(12px,1.2vw,15px)] mb-1">B2C Abonelik</h4>
          <p className="text-[clamp(9px,1vw,13px)] text-gray-500">Freemium → Pro (₺199) & Premium (₺499). Hedef: %8 dönüşüm.</p>
        </GlowCard>
        <GlowCard glowColor="blue">
          <Zap className="w-[clamp(1.2rem,2vw,2rem)] h-[clamp(1.2rem,2vw,2rem)] text-blue-400 mb-2" />
          <h4 className="font-bold text-[clamp(12px,1.2vw,15px)] mb-1">API Lisanslama</h4>
          <p className="text-[clamp(9px,1vw,13px)] text-gray-500">Fintech şirketlerine 90+ quant fonksiyon as-a-service.</p>
        </GlowCard>
        <GlowCard glowColor="violet">
          <BarChart3 className="w-[clamp(1.2rem,2vw,2rem)] h-[clamp(1.2rem,2vw,2rem)] text-violet-400 mb-2" />
          <h4 className="font-bold text-[clamp(12px,1.2vw,15px)] mb-1">Veri Analitiği</h4>
          <p className="text-[clamp(9px,1vw,13px)] text-gray-500">Anonim piyasa sentiment verileri, kurumsal içerik lisansı.</p>
        </GlowCard>
      </div>
      <GlowCard glowColor="emerald" className="text-center">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-[clamp(1.2rem,2.5vw,2rem)] font-extrabold text-emerald-400">~320K₺</div>
            <div className="text-[clamp(8px,0.8vw,11px)] text-gray-400 mt-0.5">Aylık gelir hedefi (1K)</div>
          </div>
          <div>
            <div className="text-[clamp(1.2rem,2.5vw,2rem)] font-extrabold text-teal-400">%85</div>
            <div className="text-[clamp(8px,0.8vw,11px)] text-gray-400 mt-0.5">Brüt marj</div>
          </div>
          <div>
            <div className="text-[clamp(1.2rem,2.5vw,2rem)] font-extrabold text-emerald-300">~24x</div>
            <div className="text-[clamp(8px,0.8vw,11px)] text-gray-400 mt-0.5">OPEX/Gelir oranı (Pro)</div>
          </div>
        </div>
      </GlowCard>
    </div>
  );
}

// ─── 12: CAPEX / OPEX ───
function SlideCapexOpex({}: SlideProps) {
  return (
    <div className="w-full max-w-[85vw] xl:max-w-5xl">
      <SectionTitle tag="Maliyet Analizi" title="CAPEX & OPEX Projeksiyonu" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(0.5rem,1.5vw,1.2rem)]">
        <GlowCard glowColor="amber">
          <h4 className="text-amber-400 font-bold text-[clamp(10px,1vw,13px)] mb-3 uppercase tracking-wider">CAPEX — İlk Yatırım Maliyeti</h4>
          {[
            { item: "AI kodlama araçları (6 ay)", cost: "$600", note: "Aylık $100 × 6 ay" },
            { item: "Ofis & coworking kirası (6 ay)", cost: "₺18.000", note: "Aylık ₺3.000 × 6 ay" },
            { item: "FinBERT fine-tune (GPU eğitim)", cost: "$150", note: "Colab Pro + HuggingFace" },
            { item: "Cloud altyapı kurulumu", cost: "$200", note: "VPS + Redis + PostgreSQL" },
            { item: "Domain, SSL, branding", cost: "$80", note: "nexia.app + logo + tasarım" },
            { item: "Yasal & KVKK danışmanlık", cost: "$300", note: "SPK uyum, gizlilik politikası" },
            { item: "CI/CD & test altyapısı", cost: "$0", note: "GitHub Actions + pytest (açık kaynak)" },
          ].map((c, i) => (
            <div key={i} className="flex items-center justify-between text-[clamp(10px,1.1vw,14px)] border-b border-gray-100 py-2">
              <span className="text-gray-600">{c.item}</span>
              <div className="text-right shrink-0 ml-3">
                <span className="font-bold text-amber-400">{c.cost}</span>
                <span className="text-gray-400 ml-2 text-[clamp(8px,0.8vw,11px)]">{c.note}</span>
              </div>
            </div>
          ))}
          <div className="mt-3 pt-3 border-t border-amber-500/20 flex justify-between items-center">
            <span className="text-[clamp(11px,1.2vw,15px)] text-gray-700 font-bold">Toplam CAPEX</span>
            <span className="text-[clamp(1.2rem,2.2vw,1.8rem)] font-extrabold text-amber-400">~$1.330 + ₺18K</span>
          </div>
        </GlowCard>

        <GlowCard glowColor="emerald">
          <h4 className="text-emerald-400 font-bold text-[clamp(10px,1vw,13px)] mb-3 uppercase tracking-wider">OPEX — Aylık İşletme (1K Kullanıcı)</h4>
          {[
            { item: "Cloud sunucu (VPS/Compute)", cost: "$45/ay", note: "FastAPI + Redis + PostgreSQL" },
            { item: "Vercel Pro (Frontend CDN)", cost: "$20/ay", note: "Next.js hosting + edge" },
            { item: "FinBERT inference (GPU)", cost: "$35/ay", note: "HuggingFace Inference API" },
            { item: "AI kodlama aracı", cost: "$100/ay", note: "Geliştirme hızlandırıcı" },
            { item: "3. parti API abonelikleri", cost: "$15/ay", note: "NewsAPI Pro + yedek kaynaklar" },
            { item: "E-posta & monitoring", cost: "$15/ay", note: "SMTP + uptime + hata takibi" },
          ].map((c, i) => (
            <div key={i} className="flex items-center justify-between text-[clamp(10px,1.1vw,14px)] border-b border-gray-100 py-2">
              <span className="text-gray-600">{c.item}</span>
              <div className="text-right shrink-0 ml-3">
                <span className="font-bold text-emerald-400">{c.cost}</span>
                <span className="text-gray-400 ml-2 text-[clamp(8px,0.8vw,11px)]">{c.note}</span>
              </div>
            </div>
          ))}
          <div className="mt-3 pt-3 border-t border-emerald-500/20 flex justify-between items-center">
            <span className="text-[clamp(11px,1.2vw,15px)] text-gray-700 font-bold">Toplam OPEX</span>
            <span className="text-[clamp(1.2rem,2.2vw,1.8rem)] font-extrabold text-emerald-400">~$230/ay</span>
          </div>
        </GlowCard>
      </div>

      <GlowCard glowColor="teal" className="mt-3 text-center">
        <div className="text-[clamp(11px,1.2vw,15px)] font-bold text-teal-400">
          Kullanıcı başı OPEX: <span className="text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold">$0.23</span>
          <span className="text-gray-400 text-[clamp(10px,1.1vw,14px)] ml-3">vs Bloomberg $2,000/ay</span>
        </div>
      </GlowCard>
    </div>
  );
}

// ─── 13: Birim Ekonomi ───
function SlideUnitEconomics({}: SlideProps) {
  return (
    <div className="w-full max-w-[85vw] xl:max-w-5xl">
      <SectionTitle tag="Birim Ekonomi" title="Her Kullanıcı Neredeyse Saf Kâr" />
      <div className="grid grid-cols-4 gap-[clamp(0.5rem,1vw,1rem)] mb-[2vh]">
        <StatCard value="$0.23" label="Kullanıcı başı OPEX" color="emerald" />
        <StatCard value="~$5.50" label="Pro abonelik geliri" color="blue" />
        <StatCard value="~24x" label="Brüt marj çarpanı" color="violet" />
        <StatCard value="%96" label="Brüt marj" color="teal" />
      </div>
      <GlowCard glowColor="emerald">
        <h4 className="font-bold text-[clamp(11px,1.1vw,14px)] mb-3">Ölçek Projeksiyonu</h4>
        <div className="grid grid-cols-4 gap-3 text-center">
          {[
            { users: "1K", revenue: "320K₺", opex: "~$230", margin: "%96" },
            { users: "10K", revenue: "3.2M₺", opex: "~$1.5K", margin: "%98" },
            { users: "50K", revenue: "16M₺", opex: "~$5K", margin: "%99" },
            { users: "100K", revenue: "32M₺", opex: "~$9K", margin: "%99+" },
          ].map((p, i) => (
            <div key={i} className="p-2 rounded-xl bg-black/[0.02] hover:bg-black/[0.04] transition-all duration-300 hover:scale-105 cursor-default">
              <div className="text-[clamp(1rem,2vw,1.5rem)] font-extrabold text-emerald-400">{p.users}</div>
              <div className="text-[clamp(7px,0.7vw,10px)] text-gray-400 mt-0.5">Kullanıcı</div>
              <div className="text-[clamp(10px,1vw,13px)] font-semibold text-gray-600 mt-1">{p.revenue}/ay</div>
              <div className="text-[clamp(7px,0.7vw,10px)] text-gray-400">OPEX: {p.opex}</div>
              <div className="text-[clamp(8px,0.9vw,11px)] text-emerald-400 font-bold mt-0.5">Marj: {p.margin}</div>
            </div>
          ))}
        </div>
      </GlowCard>
    </div>
  );
}

// ─── 14: Go-to-Market ───
function SlideGoToMarket({}: SlideProps) {
  const phases = [
    {
      phase: "Q3 2026",
      title: "Lansman",
      icon: Rocket,
      color: "emerald",
      iconClass: "text-emerald-400",
      bgClass: "bg-emerald-500/10 border-emerald-500/20",
      items: [
        "Açık beta ile üniversite finans kulüplerinde test",
        "Ücretsiz plan — product-led growth stratejisi",
        "Blog, kısa video ve sosyal medya içerik üretimi",
        "İlk 1.000 kullanıcı hedefi",
      ],
    },
    {
      phase: "Q4 2026",
      title: "Büyüme",
      icon: TrendingUp,
      color: "teal",
      iconClass: "text-teal-400",
      bgClass: "bg-teal-500/10 border-teal-500/20",
      items: [
        "Pro plan lansmanı (₺199/ay)",
        "B2B pilot: 3-5 kurumsal müşteri ile PoC",
        "Davet sistemi: arkadaşını getir, 1 ay ücretsiz",
        "Hedef: %8 ücretsiz → ücretli dönüşüm oranı",
      ],
    },
    {
      phase: "Q1 2027",
      title: "Genişleme",
      icon: Globe,
      color: "blue",
      iconClass: "text-blue-400",
      bgClass: "bg-blue-500/10 border-blue-500/20",
      items: [
        "Mobil uygulama lansmanı (iOS & Android)",
        "API marketplace — 3. parti geliştirici ekosistemi",
        "Aracı kurum entegrasyonları (A1 Capital, Midas)",
        "Premium plan (₺499) ve kurumsal paketler",
      ],
    },
    {
      phase: "Q2 2027",
      title: "Ölçeklendirme",
      icon: Layers,
      color: "violet",
      iconClass: "text-violet-400",
      bgClass: "bg-violet-500/10 border-violet-500/20",
      items: [
        "MENA bölgesine çok dilli genişleme",
        "Kurumsal veri ürünleri & sentiment endeksi",
        "50K aktif kullanıcı — Series A hazırlığı",
        "SPK lisanslı bilgi platformu sertifikası",
      ],
    },
  ];

  return (
    <div className="w-full max-w-[92vw] xl:max-w-6xl">
      <SectionTitle tag="Yol Haritası" title="Go-to-Market Stratejisi" subtitle="4 çeyrekte lansmanından ölçeklendirmeye" />

      {/* Timeline connector */}
      <div className="relative">
        {/* Horizontal line behind cards */}
        <div className="hidden md:block absolute top-[3.5rem] left-[5%] right-[5%] h-0.5 bg-gradient-to-r from-emerald-500/30 via-teal-500/30 via-blue-500/30 to-violet-500/30 z-0" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-[clamp(0.75rem,1.5vw,1.5rem)] relative z-10">
          {phases.map((p, i) => {
            const Icon = p.icon;
            return (
              <GlowCard key={i} glowColor={p.color} className="!py-[clamp(1.2rem,2.5vh,2rem)]">
                {/* Phase badge with icon */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-[clamp(2.5rem,4vw,3.5rem)] h-[clamp(2.5rem,4vw,3.5rem)] rounded-xl ${p.bgClass} border flex items-center justify-center shrink-0`}>
                    <Icon className={`w-[clamp(1.2rem,2vw,1.8rem)] h-[clamp(1.2rem,2vw,1.8rem)] ${p.iconClass}`} />
                  </div>
                  <div>
                    <Tag color={p.color}>{p.phase}</Tag>
                    <h4 className="font-bold text-[clamp(14px,1.5vw,20px)] mt-1">{p.title}</h4>
                  </div>
                </div>

                {/* Items */}
                <ul className="space-y-2.5">
                  {p.items.map((item, j) => (
                    <li key={j} className="text-[clamp(11px,1.1vw,15px)] text-gray-500 flex items-start gap-2.5">
                      <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${p.iconClass.replace("text-", "bg-")} opacity-60`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </GlowCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── 16: Demo — Telefon Mockup'ları ───
function SlideDemo({}: SlideProps) {
  const screens = [
    { src: "/screenshots/dashboard.png", label: "Dashboard", desc: "Anlık piyasa verileri ve portföy özeti" },
    { src: "/screenshots/analysis.png", label: "Teknik Analiz", desc: "11 indikatör, RSI, MACD, Bollinger" },
    { src: "/screenshots/ai-chat.png", label: "AI Asistan", desc: "Türkçe doğal dilde soru-cevap" },
  ];

  return (
    <div className="w-full max-w-[92vw] xl:max-w-6xl">
      <SectionTitle tag="Demo" title="Nexia Çalışıyor." subtitle="Çalışan prototip — sadece bir fikir değil" />

      <div className="flex items-center justify-center gap-[clamp(1rem,3vw,3rem)]">
        {screens.map((s, i) => (
          <div
            key={i}
            className="group relative"
            style={{
              transform: i === 1 ? "scale(1.08)" : `rotate(${i === 0 ? "-4" : "4"}deg) scale(0.95)`,
              zIndex: i === 1 ? 10 : 5,
            }}
          >
            {/* Phone frame glow */}
            <div className={`absolute -inset-3 bg-gradient-to-br ${i === 1 ? "from-emerald-500/20 to-teal-500/20" : "from-gray-200/50 to-gray-200/50"} rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

            {/* Phone frame */}
            <div className="relative bg-gray-900 rounded-[2rem] p-[6px] shadow-2xl shadow-black/60 group-hover:shadow-emerald-500/20 transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[35%] h-[1.8rem] bg-gray-900 rounded-b-2xl z-20" />

              {/* Screen */}
              <div className="relative w-[clamp(180px,20vw,260px)] h-[clamp(360px,42vh,520px)] rounded-[1.7rem] overflow-hidden bg-gray-50">
                <Image
                  src={s.src}
                  alt={s.label}
                  fill
                  className="object-cover object-top"
                />
                {/* Bottom gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent z-10" />
              </div>

              {/* Home indicator */}
              <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[35%] h-1 bg-gray-200 rounded-full z-20" />
            </div>

            {/* Label below phone */}
            <div className="text-center mt-4">
              <h4 className="font-bold text-[clamp(13px,1.3vw,17px)] text-gray-900">{s.label}</h4>
              <p className="text-[clamp(9px,1vw,13px)] text-gray-400 mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 17: Gelecek Vizyonu ───
function SlideFuture({}: SlideProps) {
  const visions = [
    { icon: Smartphone, title: "Mobil Uygulama", desc: "iOS & Android — cebinizde Bloomberg kalitesinde analiz", timeline: "Q1 2027", color: "emerald", iconClass: "text-emerald-400" },
    { icon: Globe, title: "MENA Genişleme", desc: "Mısır, Suudi Arabistan, BAE pazarlarına çok dilli giriş", timeline: "Q2 2027", color: "teal", iconClass: "text-teal-400" },
    { icon: Code, title: "API Marketplace", desc: "3. parti geliştiricilere açık quant fonksiyon ekosistemi", timeline: "Q3 2027", color: "blue", iconClass: "text-blue-400" },
    { icon: Database, title: "Kurumsal Veri Ürünleri", desc: "Anonim sentiment verileri, piyasa duyarlılık endeksi", timeline: "Q4 2027", color: "violet", iconClass: "text-violet-400" },
    { icon: Rocket, title: "Series A Hedefi", desc: "50K+ aktif kullanıcı ile yatırım turu", timeline: "2028", color: "amber", iconClass: "text-amber-400" },
    { icon: Award, title: "Regülasyon Uyumu", desc: "SPK lisanslı bilgi platformu sertifikası", timeline: "2028", color: "red", iconClass: "text-red-400" },
  ];

  return (
    <div className="w-full max-w-[90vw] xl:max-w-6xl">
      <SectionTitle tag="Vizyon" title="Gelecekte Neler Yapacağız?" subtitle="Nexia'nın 2 yıllık büyüme haritası" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-[clamp(0.5rem,1vw,1rem)]">
        {visions.map((v, i) => (
          <GlowCard key={i} glowColor={v.color}>
            <div className="flex items-center justify-between mb-2">
              <v.icon className={`w-[clamp(1rem,2vw,1.5rem)] h-[clamp(1rem,2vw,1.5rem)] ${v.iconClass}`} />
              <Tag color={v.color}>{v.timeline}</Tag>
            </div>
            <h4 className="font-bold text-[clamp(11px,1.1vw,14px)] mb-0.5">{v.title}</h4>
            <p className="text-[clamp(8px,0.9vw,12px)] text-gray-500">{v.desc}</p>
          </GlowCard>
        ))}
      </div>
    </div>
  );
}

// ─── 18: Globalleşme Stratejisi ───
function SlideGlobal({}: SlideProps) {
  const regions = [
    {
      region: "Türkiye (Temel Pazar)",
      flag: "🇹🇷",
      users: "8.6M yatırımcı",
      status: "Aktif",
      color: "emerald",
      details: ["BIST + KAP + TCMB tam entegrasyon", "Türkçe AI asistan", "₺199/ay fiyatlandırma", "İlk yıl 50K kullanıcı hedefi"],
    },
    {
      region: "MENA Bölgesi",
      flag: "🇸🇦",
      users: "45M+ yatırımcı",
      status: "2027 Q2",
      color: "teal",
      details: ["Arapça dil desteği", "Tadawul, EGX, ADX borsa entegrasyonu", "İslami finans uyumlu analiz modülleri", "Bölgesel partnerlik anlaşmaları"],
    },
    {
      region: "Güney & Güneydoğu Asya",
      flag: "🇮🇳",
      users: "150M+ yatırımcı",
      status: "2028",
      color: "blue",
      details: ["Hindistan (NSE/BSE), Endonezya (IDX)", "İngilizce + yerel dil desteği", "Düşük maliyet modeli ile penetrasyon", "Mikro-yatırımcı segmentine odaklanma"],
    },
    {
      region: "Latin Amerika",
      flag: "🇧🇷",
      users: "80M+ yatırımcı",
      status: "2029",
      color: "violet",
      details: ["Brezilya (B3), Meksika (BMV)", "Portekizce & İspanyolca destek", "Yüksek enflasyon ortamı uzmanlığı", "Gelişen piyasa analiz modelleri"],
    },
  ];

  return (
    <div className="w-full max-w-[92vw] xl:max-w-6xl">
      <SectionTitle tag="Globalleşme" title="Dünya Pazarına Açılma Stratejisi" subtitle="Gelişmekte olan ülkelerde 300M+ yatırımcıya ulaşma planı" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[clamp(0.5rem,1.2vw,1rem)]">
        {regions.map((r, i) => (
          <GlowCard key={i} glowColor={r.color} delay={i * 150} autoGlow={i === 0}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[clamp(1.5rem,2.5vw,2rem)]">{r.flag}</span>
              <Tag color={r.color}>{r.status}</Tag>
            </div>
            <h4 className="font-bold text-[clamp(12px,1.2vw,16px)] mb-1">{r.region}</h4>
            <p className="text-[clamp(10px,1vw,14px)] text-emerald-400/60 font-semibold mb-3">{r.users}</p>
            <ul className="space-y-1.5">
              {r.details.map((d, j) => (
                <li key={j} className="text-[clamp(9px,0.9vw,12px)] text-gray-500 flex items-start gap-1.5">
                  <ArrowRight className="w-3 h-3 mt-0.5 shrink-0 text-gray-300" />{d}
                </li>
              ))}
            </ul>
          </GlowCard>
        ))}
      </div>
    </div>
  );
}

// ─── 19: Exit Strategy ───
function SlideExitStrategy({}: SlideProps) {
  return (
    <div className="w-full max-w-[90vw] xl:max-w-5xl">
      <SectionTitle tag="Exit Stratejisi" title="Yatırımcı Çıkış Senaryoları" subtitle="3 potansiyel exit yolu — 3-5 yıl zaman dilimi" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(0.75rem,1.5vw,1.5rem)] mb-[2vh]">
        {/* Senaryo 1: Stratejik Satın Alma */}
        <GlowCard glowColor="emerald" autoGlow delay={0}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-[clamp(2.5rem,4vw,3.5rem)] h-[clamp(2.5rem,4vw,3.5rem)] rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Target className="w-[clamp(1.2rem,2vw,1.8rem)] h-[clamp(1.2rem,2vw,1.8rem)] text-emerald-400" />
            </div>
            <div>
              <Tag color="emerald">Öncelikli</Tag>
              <h4 className="font-bold text-[clamp(14px,1.5vw,18px)] mt-1">Stratejik Satın Alma</h4>
            </div>
          </div>
          <ul className="space-y-2">
            {[
              "Aracı kurum veya fintech tarafından akuisition",
              "Midas, A1 Capital, İş Yatırım gibi oyuncular",
              "Teknoloji + kullanıcı tabanı değer önerisi",
              "Hedef değerleme: 10-20x ARR",
              "Zaman çerçevesi: 3-4 yıl",
            ].map((item, j) => (
              <li key={j} className="text-[clamp(10px,1.1vw,14px)] text-gray-500 flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />{item}
              </li>
            ))}
          </ul>
        </GlowCard>

        {/* Senaryo 2: Series A → Growth */}
        <GlowCard glowColor="blue" delay={200}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-[clamp(2.5rem,4vw,3.5rem)] h-[clamp(2.5rem,4vw,3.5rem)] rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <TrendingUp className="w-[clamp(1.2rem,2vw,1.8rem)] h-[clamp(1.2rem,2vw,1.8rem)] text-blue-400" />
            </div>
            <div>
              <Tag color="blue">Büyüme</Tag>
              <h4 className="font-bold text-[clamp(14px,1.5vw,18px)] mt-1">Venture Backed Growth</h4>
            </div>
          </div>
          <ul className="space-y-2">
            {[
              "Pre-Seed → Seed → Series A yol haritası",
              "50K kullanıcıda Series A ($2-5M)",
              "Çok ülkeli genişleme finansmanı",
              "Hedef: bölgesel pazar lideri konumu",
              "Zaman çerçevesi: 4-5 yıl",
            ].map((item, j) => (
              <li key={j} className="text-[clamp(10px,1.1vw,14px)] text-gray-500 flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />{item}
              </li>
            ))}
          </ul>
        </GlowCard>

        {/* Senaryo 3: Kârlı Bağımsız Şirket */}
        <GlowCard glowColor="amber" delay={400}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-[clamp(2.5rem,4vw,3.5rem)] h-[clamp(2.5rem,4vw,3.5rem)] rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Award className="w-[clamp(1.2rem,2vw,1.8rem)] h-[clamp(1.2rem,2vw,1.8rem)] text-amber-400" />
            </div>
            <div>
              <Tag color="amber">Sürdürülebilir</Tag>
              <h4 className="font-bold text-[clamp(14px,1.5vw,18px)] mt-1">Kârlı Bağımsız Şirket</h4>
            </div>
          </div>
          <ul className="space-y-2">
            {[
              "Yüksek marj (%96) ile organik büyüme",
              "Dış yatırım almadan kârlılık",
              "Niche pazar hakimiyeti (Türkçe fintech)",
              "Temettü bazlı getiri modeli",
              "Zaman çerçevesi: süresiz",
            ].map((item, j) => (
              <li key={j} className="text-[clamp(10px,1.1vw,14px)] text-gray-500 flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />{item}
              </li>
            ))}
          </ul>
        </GlowCard>
      </div>
    </div>
  );
}

// ─── 20: Takım (fotoğraflı) ───
function SlideTeam({}: SlideProps) {
  const team = [
    {
      name: "Yiğit Gümüş",
      photo: "/yigit.jpeg",
      role: "Sistem Mimarı",
      color: "from-emerald-500 to-teal-500",
      responsibilities: ["Sistem mimarisi & full-stack geliştirme", "90+ fonksiyonluk financelib kütüphanesi", "Next.js frontend & FastAPI backend", "DevOps, CI/CD & deployment"],
    },
    {
      name: "Ömer Şerifoğlu",
      photo: "/omer.jpeg",
      role: "Market Analizi & Saha Araştırması",
      color: "from-blue-500 to-violet-500",
      responsibilities: ["Pazar araştırması & rakip analizi", "Saha çalışmaları & kullanıcı görüşmeleri", "TAM/SAM/SOM & pazar büyüklüğü analizi", "İş geliştirme & partnerlik stratejisi"],
    },
    {
      name: "Barış Demhat Çifçi",
      photo: "/baris.jpeg",
      role: "Yalın Kanvas & Persona Tasarımı",
      color: "from-amber-500 to-orange-500",
      responsibilities: ["Yalın kanvas & iş modeli tasarımı", "Persona araştırması & kullanıcı senaryoları", "Edge case analizi & UX akışları", "Finansal modelleme & birim ekonomi"],
    },
  ];

  return (
    <div className="w-full max-w-[85vw] xl:max-w-5xl">
      <SectionTitle tag="Takım" title="Arkasındaki Takım" subtitle="Koç Üniversitesi · IGNITE'26" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(0.5rem,1.5vw,1.5rem)]">
        {team.map((t, i) => (
          <GlowCard key={i} glowColor={["emerald", "blue", "amber"][i]} className="text-center">
            <div className="relative mx-auto mb-3 group cursor-pointer">
              <div className={`absolute -inset-3 bg-gradient-to-r ${t.color} rounded-full blur-xl opacity-20 group-hover:opacity-50 transition-opacity duration-700`} />
              <div className={`relative w-[clamp(4rem,8vw,5.5rem)] h-[clamp(4rem,8vw,5.5rem)] rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-emerald-400/40 group-hover:scale-110 transition-all duration-500 shadow-xl mx-auto`}>
                <Image src={t.photo} alt={t.name} fill className="object-cover" />
              </div>
            </div>
            <h4 className="text-[clamp(13px,1.3vw,17px)] font-bold">{t.name}</h4>
            <p className={`text-[clamp(10px,1vw,13px)] font-semibold mb-3 bg-gradient-to-r ${t.color} bg-clip-text text-transparent`}>{t.role}</p>
            <ul className="space-y-1.5 text-left">
              {t.responsibilities.map((r, j) => (
                <li key={j} className="text-[clamp(8px,0.9vw,11px)] text-gray-500 flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />{r}
                </li>
              ))}
            </ul>
          </GlowCard>
        ))}
      </div>
    </div>
  );
}

// ─── 19: Kapanış & Teşekkürler ───
function SlideClosing({}: SlideProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-[2.5vh]">
      <div className="relative group cursor-pointer">
        <div className="absolute -inset-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-[60px] opacity-15 group-hover:opacity-40 transition-opacity duration-1000 animate-pulse" />
        <div className="absolute -inset-16 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-emerald-500/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative w-[clamp(3.5rem,7vw,5rem)] h-[clamp(3.5rem,7vw,5rem)] bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
          <span className="text-[clamp(1.2rem,3vw,2rem)] font-black text-white">NX</span>
        </div>
      </div>

      <div className="max-w-3xl space-y-3">
        <h2 className="text-[clamp(1.5rem,4vw,3.5rem)] font-extrabold tracking-tight leading-tight bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 bg-clip-text text-transparent">
          &ldquo;Finansal güvenlik bir lüks değil, temel haktır.&rdquo;
        </h2>
        <p className="text-[clamp(0.9rem,2vw,1.4rem)] text-gray-500">
          Nexia, bu hakkı 8.6 milyon insanın cebine taşıyor.
        </p>
      </div>

      {/* Team photos row */}
      <div className="flex items-center gap-6 mt-2">
        {[
          { photo: "/yigit.jpeg", name: "Yiğit" },
          { photo: "/omer.jpeg", name: "Ömer" },
          { photo: "/baris.jpeg", name: "Barış" },
        ].map((m) => (
          <div key={m.name} className="flex flex-col items-center gap-1 group">
            <div className="relative w-[clamp(3rem,5vw,4rem)] h-[clamp(3rem,5vw,4rem)] rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-emerald-400/40 transition-all duration-500 group-hover:scale-110">
              <Image src={m.photo} alt={m.name} fill className="object-cover" />
            </div>
            <span className="text-[clamp(9px,1vw,12px)] text-gray-400">{m.name}</span>
          </div>
        ))}
      </div>

      <div className="text-[clamp(1.5rem,3.5vw,2.5rem)] font-bold text-gray-800 mt-2">
        Teşekkürler!
      </div>

      <div className="flex items-center gap-4 text-[clamp(10px,1vw,13px)] text-gray-400">
        <span>nexia.app</span>
        <span>|</span>
        <span>info@nexia.app</span>
        <span>|</span>
        <span>IGNITE&apos;26</span>
      </div>

      <div className="mt-[2vh]">
        <div className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-500 cursor-pointer">
          <Award className="w-5 h-5 group-hover:rotate-12 transition-transform duration-500" />
          Sorularınızı almaktan mutluluk duyarız
        </div>
      </div>
    </div>
  );
}

// ─── 21: Video ───
function SlideVideo({}: SlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Sesli autoplay dene, tarayıcı engellerse muted dene
    v.play().catch(() => {
      v.muted = true;
      v.play();
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-4">
      <div className="relative w-[clamp(70vw,80vw,1200px)] max-h-[75vh] rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-gray-200">
        <video
          ref={videoRef}
          src="/Video.mp4"
          autoPlay
          loop
          controls
          playsInline
          className="w-full h-full object-contain bg-black"
        />
      </div>
      <p className="text-[clamp(10px,1.1vw,14px)] text-gray-400 font-medium">
        Nexia &mdash; Yapay Zek&#226; Destekli Finansal G&#252;venlik Asistan&#305;
      </p>
    </div>
  );
}

/* ═══════════════════════════════════
   SLIDES ARRAY
   ═══════════════════════════════════ */

const slides: ((props: SlideProps) => React.ReactNode)[] = [
  SlideCover,           // 1  — Kapak
  SlideProblem,         // 2  — Problem
  SlideSolution,        // 3  — Çözüm
  SlideTamSamSom,       // 4  — TAM/SAM/SOM
  SlidePersonas,        // 5  — Personalar
  SlideUseCases,        // 6  — Edge Cases
  SlideProduct,         // 7  — Ürün Altyapısı
  SlideArchitecture,    // 8  — Sistem Mimarisi
  SlideCompetitor,      // 9  — Rakip Analizi
  SlidePricing,         // 10 — Fiyatlandırma
  SlideBusinessModel,   // 11 — İş Modeli
  SlideCapexOpex,       // 12 — CAPEX/OPEX
  SlideUnitEconomics,   // 13 — Birim Ekonomi
  SlideGoToMarket,      // 14 — Go-to-Market
  SlideDemo,            // 15 — Demo
  SlideFuture,          // 16 — Gelecek Vizyonu
  SlideGlobal,          // 17 — Globalleşme
  SlideExitStrategy,    // 18 — Exit Strategy
  SlideTeam,            // 19 — Takım
  SlideClosing,         // 20 — Kapanış + Teşekkürler
  SlideVideo,           // 21 — Video
];
