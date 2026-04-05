"use client";

import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard,
  LineChart,
  Brain,
  Briefcase,
  Settings,
  TrendingUp,
  Newspaper,
  Shield,
  LogOut,
  Upload,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    label: "Ana",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "portfolio", label: "Portföy", icon: Briefcase },
    ],
  },
  {
    label: "Analiz",
    items: [
      { id: "analysis", label: "Teknik Analiz", icon: LineChart },
      { id: "risk", label: "Kantitatif", icon: TrendingUp },
      { id: "ai", label: "AI Asistan", icon: Brain },
    ],
  },
  {
    label: "Veri",
    items: [
      { id: "news", label: "Haberler", icon: Newspaper },
      { id: "files", label: "Dosya Analizi", icon: Upload },
    ],
  },
  {
    label: "Yönetim",
    items: [
      { id: "enterprise", label: "Kurumsal", icon: Shield },
      { id: "settings", label: "Ayarlar", icon: Settings },
    ],
  },
];

// Bottom nav tabs for mobile — most important screens
const MOBILE_TABS = [
  { id: "dashboard", label: "Ana Sayfa", icon: LayoutDashboard },
  { id: "portfolio", label: "Portföy", icon: Briefcase },
  { id: "analysis", label: "Analiz", icon: LineChart },
  { id: "ai", label: "AI", icon: Brain },
  { id: "news", label: "Haberler", icon: Newspaper },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* ═══ Desktop Sidebar ═══ */}
      <aside className="hidden md:flex w-14 lg:w-52 border-r border-border/60 bg-card/50 flex-col shrink-0 h-screen">
        {/* Logo */}
        <div className="h-14 flex items-center px-3 lg:px-4 border-b border-border/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-emerald-600 to-emerald-400 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
              NX
            </div>
            <span className="hidden lg:block font-semibold text-[13px] tracking-tight">
              Nexia
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="hidden lg:block text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider px-2 mb-1">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[13px] transition-colors",
                        isActive
                          ? "bg-emerald-500/10 text-emerald-400 font-medium"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      <Icon className={cn("w-[15px] h-[15px] shrink-0", isActive && "text-emerald-400")} />
                      <span className="hidden lg:block truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="px-2 py-3 border-t border-border/60 shrink-0">
          <div className="flex items-center gap-2 px-1">
            <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-[11px] font-semibold shrink-0">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="hidden lg:block flex-1 min-w-0">
              <p className="text-[12px] font-medium truncate leading-tight">{user?.name || "Kullanıcı"}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="hidden lg:flex w-7 h-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shrink-0"
              title="Çıkış Yap"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ═══ Mobile Bottom Navbar ═══ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/60 safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {MOBILE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[56px]",
                  isActive
                    ? "text-emerald-400"
                    : "text-muted-foreground active:scale-95"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  isActive && "bg-emerald-500/10"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  "text-[9px] font-medium",
                  isActive ? "text-emerald-400" : "text-muted-foreground/70"
                )}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
