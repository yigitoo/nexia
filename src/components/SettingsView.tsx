"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Mail, FileText, Download, Loader2, CheckCircle, AlertCircle, Shield, Key, Clock } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function SettingsView() {
  const { user, logout } = useAuth();
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [schedulerOn, setSchedulerOn] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [twoFAStatus, setTwoFAStatus] = useState<"idle" | "verifying" | "enabled" | "error">("idle");
  const [sessionDays, setSessionDays] = useState(7);

  async function sendTestEmail() {
    setEmailStatus("sending");
    try {
      const res = await fetch(`${API}/api/email/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: user?.email || "" }),
      });
      setEmailStatus(res.ok ? "sent" : "error");
    } catch { setEmailStatus("error"); }
    setTimeout(() => setEmailStatus("idle"), 3000);
  }

  async function sendSummary() {
    setEmailStatus("sending");
    try {
      const res = await fetch(`${API}/api/email/send-summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: user?.email || "", attach_pdf: true }),
      });
      setEmailStatus(res.ok ? "sent" : "error");
    } catch { setEmailStatus("error"); }
    setTimeout(() => setEmailStatus("idle"), 3000);
  }

  async function downloadPDF() {
    try {
      const res = await fetch(`${API}/api/reports/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ include_risk: true }),
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nexia_rapor_${new Date().toISOString().split("T")[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* skip */ }
  }

  async function toggleScheduler() {
    const endpoint = schedulerOn ? "stop" : "start";
    try {
      await fetch(`${API}/api/email/scheduler/${endpoint}`, { method: "POST" });
      setSchedulerOn(!schedulerOn);
    } catch { /* skip */ }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-base font-semibold">Ayarlar</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">Hesap, e-posta ve rapor ayarları</p>
      </div>

      {/* Account */}
      <Section title="Hesap Bilgileri">
        <Row label="Ad" value={user?.name} />
        <Row label="E-posta" value={user?.email} mono />
        <Row label="Rol" value={user?.role} />
        <Row label="User ID" value={user?.user_id} mono />
      </Section>

      {/* Email & Reports */}
      <Section title="E-posta ve Raporlar">
        <div className="px-4 py-3 space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={sendTestEmail}
              disabled={emailStatus === "sending"}
              className="h-8 px-3 rounded-md border border-border/50 text-[12px] font-medium hover:bg-muted/30 transition-colors flex items-center gap-1.5 disabled:opacity-40"
            >
              {emailStatus === "sending" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
              Test E-postası
            </button>
            <button
              onClick={sendSummary}
              disabled={emailStatus === "sending"}
              className="h-8 px-3 rounded-md border border-emerald-500/30 text-emerald-400 text-[12px] font-medium hover:bg-emerald-500/5 transition-colors flex items-center gap-1.5 disabled:opacity-40"
            >
              {emailStatus === "sending" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
              Portföy Özeti Gönder (PDF)
            </button>
            <button
              onClick={downloadPDF}
              className="h-8 px-3 rounded-md border border-border/50 text-[12px] font-medium hover:bg-muted/30 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3 h-3" />
              PDF İndir
            </button>
          </div>

          {emailStatus === "sent" && (
            <p className="text-[12px] text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> E-posta gönderildi</p>
          )}
          {emailStatus === "error" && (
            <p className="text-[12px] text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Gönderilemedi — backend kontrol edin</p>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <div>
              <p className="text-[12px] font-medium">Günlük Otomatik Rapor</p>
              <p className="text-[11px] text-muted-foreground">Her gün 18:00&apos;da portföy özeti + PDF gönderir</p>
            </div>
            <button
              onClick={toggleScheduler}
              className={`h-7 px-3 rounded-full text-[11px] font-medium transition-colors ${
                schedulerOn
                  ? "bg-emerald-600 text-white"
                  : "bg-muted/30 text-muted-foreground border border-border/50"
              }`}
            >
              {schedulerOn ? "Aktif" : "Pasif"}
            </button>
          </div>
        </div>
      </Section>

      {/* Security */}
      <Section title="Güvenlik">
        <div className="px-4 py-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-[12px] font-medium">İki Faktörlü Doğrulama (2FA)</p>
                <p className="text-[11px] text-muted-foreground">TOTP tabanlı güvenlik kodu</p>
              </div>
            </div>
            <button
              onClick={async () => {
                if (twoFAEnabled) {
                  try {
                    await fetch(`${API}/api/auth/2fa/disable`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: user?.email }),
                    });
                    setTwoFAEnabled(false);
                  } catch {}
                } else {
                  try {
                    await fetch(`${API}/api/auth/2fa/enable`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: user?.email }),
                    });
                    setTwoFAEnabled(true);
                    setTwoFAStatus("idle");
                  } catch {}
                }
              }}
              className={`h-7 px-3 rounded-full text-[11px] font-medium transition-colors ${
                twoFAEnabled
                  ? "bg-emerald-600 text-white"
                  : "bg-muted/30 text-muted-foreground border border-border/50"
              }`}
            >
              {twoFAEnabled ? "Aktif" : "Pasif"}
            </button>
          </div>

          {twoFAEnabled && (
            <div className="flex items-center gap-2 pt-2 border-t border-border/30">
              <Key className="w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="6 haneli doğrulama kodu"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="h-8 px-3 rounded-md border border-border/50 bg-muted/30 text-[12px] font-mono w-36 text-center tracking-widest"
              />
              <button
                onClick={async () => {
                  setTwoFAStatus("verifying");
                  try {
                    const res = await fetch(`${API}/api/auth/2fa/verify`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: user?.email, code: otpCode }),
                    });
                    setTwoFAStatus(res.ok ? "enabled" : "error");
                  } catch { setTwoFAStatus("error"); }
                  setOtpCode("");
                  setTimeout(() => setTwoFAStatus("idle"), 3000);
                }}
                disabled={otpCode.length !== 6 || twoFAStatus === "verifying"}
                className="h-8 px-3 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-medium disabled:opacity-40 transition-colors"
              >
                {twoFAStatus === "verifying" ? <Loader2 className="w-3 h-3 animate-spin" /> : "Doğrula"}
              </button>
              {twoFAStatus === "enabled" && <CheckCircle className="w-4 h-4 text-emerald-400" />}
              {twoFAStatus === "error" && <AlertCircle className="w-4 h-4 text-red-400" />}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-[12px] font-medium">Oturum Süresi</p>
                <p className="text-[11px] text-muted-foreground">Bu süre sonunda tekrar giriş gerekir</p>
              </div>
            </div>
            <select
              value={sessionDays}
              onChange={(e) => setSessionDays(Number(e.target.value))}
              className="h-7 px-2 rounded-md border border-border/50 bg-muted/30 text-[11px] text-foreground"
            >
              <option value={1}>1 gün</option>
              <option value={3}>3 gün</option>
              <option value={7}>7 gün</option>
              <option value={14}>14 gün</option>
              <option value={30}>30 gün</option>
            </select>
          </div>
        </div>
      </Section>

      {/* API */}
      <Section title="API Bağlantısı">
        <Row label="Backend" value={API} mono />
        <Row label="Durum" value="Bağlı" />
      </Section>

      <button
        onClick={logout}
        className="text-[13px] px-4 py-2 rounded-md border border-red-500/20 text-red-400 hover:bg-red-500/5 transition-colors"
      >
        Çıkış Yap
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider mb-1.5">{title}</p>
      <div className="rounded-lg border border-border/50 divide-y divide-border/30 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value?: string | null; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <span className="text-[12px] text-muted-foreground">{label}</span>
      <span className={`text-[13px] ${mono ? "font-mono" : ""}`}>{value || "—"}</span>
    </div>
  );
}
