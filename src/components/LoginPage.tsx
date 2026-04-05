"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { Eye, EyeOff } from "lucide-react";

const DEMO_ACCOUNTS = [
  { email: "gumusyigit101@gmail.com", pass: "templekiller", label: "Founder" },
  { email: "admin@nexia.app", pass: "admin123", label: "Admin" },
  { email: "analyst@nexia.app", pass: "analyst123", label: "Manager" },
  { email: "viewer@nexia.app", pass: "viewer123", label: "Viewer" },
];

export function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const err = mode === "login" ? await login(email, password) : await register(email, name, password);
    if (err) setError(err);
    setLoading(false);
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Left: branding */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] bg-emerald-950/30 border-r border-border/30 p-10">
        <div>
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-emerald-600 to-emerald-400 flex items-center justify-center text-white font-bold text-xs">NX</div>
            <span className="font-semibold text-[15px]">Nexia</span>
          </div>
          <h2 className="text-2xl font-bold leading-tight">
            AI-Powered<br />Financial Terminal
          </h2>
          <p className="text-[14px] text-muted-foreground mt-3 leading-relaxed">
            Türk finans profesyonelleri için yapay zekâ destekli analiz terminali.
            BIST, KAP, teknik analiz ve risk yönetimi tek platformda.
          </p>
        </div>
        <p className="text-[12px] text-muted-foreground/50">
          IGNITE&apos;26 &middot; Koç Üniversitesi KUEC x Paribu Hub
        </p>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-emerald-600 to-emerald-400 flex items-center justify-center text-white font-bold text-[10px]">NX</div>
            <span className="font-semibold text-[14px]">Nexia</span>
          </div>

          <div>
            <h1 className="text-lg font-semibold">{mode === "login" ? "Giriş Yap" : "Kayıt Ol"}</h1>
            <p className="text-[13px] text-muted-foreground mt-0.5">
              {mode === "login" ? "Hesabınızla giriş yapın" : "Yeni hesap oluşturun"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "register" && (
              <div>
                <label className="text-[12px] text-muted-foreground mb-1 block">Ad Soyad</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Adınız" className="h-9 text-[13px]" required />
              </div>
            )}
            <div>
              <label className="text-[12px] text-muted-foreground mb-1 block">E-posta</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="h-9 text-[13px]" required />
            </div>
            <div>
              <label className="text-[12px] text-muted-foreground mb-1 block">Şifre</label>
              <div className="relative">
                <Input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-9 text-[13px] pr-9" required />
                <button type="button" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {error && <p className="text-[12px] text-red-400 bg-red-500/5 border border-red-500/10 rounded-md px-3 py-2">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-9 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] font-medium transition-colors disabled:opacity-40"
            >
              {loading ? "Yükleniyor..." : mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
            </button>
          </form>

          <p className="text-center text-[12px] text-muted-foreground">
            {mode === "login" ? "Hesabınız yok mu?" : "Zaten hesabınız var mı?"}{" "}
            <button className="text-emerald-400 hover:underline" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); }}>
              {mode === "login" ? "Kayıt Ol" : "Giriş Yap"}
            </button>
          </p>

          {mode === "login" && (
            <div className="pt-3 border-t border-border/30">
              <p className="text-[11px] text-muted-foreground/60 mb-2">Demo hesaplar</p>
              <div className="space-y-1">
                {DEMO_ACCOUNTS.map((d) => (
                  <button
                    key={d.email}
                    onClick={() => { setEmail(d.email); setPassword(d.pass); }}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-[12px] hover:bg-muted/30 transition-colors"
                  >
                    <span className="font-mono text-muted-foreground">{d.email}</span>
                    <span className="text-[10px] text-muted-foreground/60 border border-border/40 rounded px-1.5 py-px">{d.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
