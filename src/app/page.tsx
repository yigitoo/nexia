"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { LandingPage } from "@/components/LandingPage";
import { LoginPage } from "@/components/LoginPage";
import { Sidebar } from "@/components/Sidebar";
import { DashboardView } from "@/components/DashboardView";
import { AIChat } from "@/components/AIChat";
import { NewsPanel } from "@/components/NewsPanel";
import { EnterprisePanel } from "@/components/EnterprisePanel";
import { FileUpload } from "@/components/FileUpload";
import { PortfolioView } from "@/components/PortfolioView";
import { AnalysisView } from "@/components/AnalysisView";
import { RiskView } from "@/components/RiskView";
import { SettingsView } from "@/components/SettingsView";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showLogin, setShowLogin] = useState(false);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background gap-4">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-xl opacity-30 animate-pulse" />
          <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-400 flex items-center justify-center text-white font-black text-xl shadow-2xl shadow-emerald-500/30 animate-pulse">
            NX
          </div>
        </div>
        <p className="text-xs text-muted-foreground/50 animate-pulse">Yükleniyor...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (!showLogin) return <LandingPage onGetStarted={() => setShowLogin(true)} />;
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex min-w-0 pb-16 md:pb-0">
        {activeTab === "dashboard" && (
          <>
            <DashboardView />
            <aside className="w-[340px] border-l border-border/40 hidden xl:flex flex-col shrink-0">
              <AIChat />
            </aside>
          </>
        )}

        {activeTab === "ai" && (
          <div className="flex-1 max-w-2xl mx-auto">
            <AIChat />
          </div>
        )}

        {activeTab === "portfolio" && <PageShell><PortfolioView /></PageShell>}
        {activeTab === "analysis" && <PageShell><AnalysisView /></PageShell>}
        {activeTab === "news" && <PageShell><NewsPanel /></PageShell>}
        {activeTab === "risk" && <PageShell><RiskView /></PageShell>}
        {activeTab === "enterprise" && <PageShell><EnterprisePanel /></PageShell>}
        {activeTab === "files" && <PageShell><FileUploadView /></PageShell>}
{activeTab === "settings" && <PageShell><SettingsView /></PageShell>}
      </div>
    </div>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 overflow-y-auto p-6">{children}</div>;
}

function FileUploadView() {
  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h1 className="text-base font-semibold">Dosya Analizi</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">Excel veya PDF yükleyerek AI ile analiz ettirin</p>
      </div>
      <FileUpload />
    </div>
  );
}
