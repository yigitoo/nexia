"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  Shield,
  Users,
  FileText,
  Clock,
  UserCheck,
  Lock,
  Activity,
} from "lucide-react";

const auditLogs = [
  { time: "14:32:18", action: "LOGIN", user: "admin@nexia.app", detail: "Başarılı giriş" },
  { time: "14:30:05", action: "TRADE", user: "analyst@nexia.app", detail: "THYAO 500 adet alım" },
  { time: "14:28:44", action: "VIEW_REPORT", user: "viewer@nexia.app", detail: "Risk raporu görüntülendi" },
  { time: "14:25:12", action: "POSITION_OPENED", user: "analyst@nexia.app", detail: "GARAN 1000 adet @ 128.4" },
  { time: "14:20:00", action: "ROLE_CHANGE", user: "admin@nexia.app", detail: "user3 -> manager" },
  { time: "14:15:30", action: "EXPORT", user: "analyst@nexia.app", detail: "Portföy raporu PDF export" },
  { time: "14:10:18", action: "LOGIN", user: "viewer@nexia.app", detail: "Başarılı giriş" },
  { time: "14:05:00", action: "ALERT_TRIGGERED", user: "system", detail: "EREGL fiyat alarmı tetiklendi" },
];

const users = [
  { email: "admin@nexia.app", name: "Admin", role: "admin", status: "active" },
  { email: "analyst@nexia.app", name: "Analist", role: "manager", status: "active" },
  { email: "viewer@nexia.app", name: "İzleyici", role: "viewer", status: "active" },
];

const actionColors: Record<string, string> = {
  LOGIN: "text-blue-400",
  TRADE: "text-emerald-400",
  POSITION_OPENED: "text-emerald-400",
  VIEW_REPORT: "text-purple-400",
  ROLE_CHANGE: "text-orange-400",
  EXPORT: "text-cyan-400",
  ALERT_TRIGGERED: "text-yellow-400",
};

export function EnterprisePanel() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          Kurumsal Yönetim
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          RBAC, Audit Trail, Compliance ve kullanıcı yönetimi
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Toplam Kullanıcı", value: "3", icon: Users, color: "blue" },
          { label: "Aktif Oturum", value: "2", icon: UserCheck, color: "emerald" },
          { label: "Rol Sayısı", value: "4", icon: Lock, color: "purple" },
          { label: "Audit Kaydı", value: "156", icon: FileText, color: "orange" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="bg-gradient-to-br from-card to-card/50">
              <CardContent className="p-3 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg bg-${stat.color}-600/15 flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 text-${stat.color}-400`} />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                  <p className="text-base font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* User Management */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4" />
              Kullanıcı Yönetimi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {users.map((u) => (
                <div
                  key={u.email}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 hover:border-border transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600/20 flex items-center justify-center text-xs font-bold text-emerald-400">
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{u.name}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        {u.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        u.role === "admin"
                          ? "border-red-600/50 text-red-400"
                          : u.role === "manager"
                            ? "border-orange-600/50 text-orange-400"
                            : "border-blue-600/50 text-blue-400"
                      }
                    >
                      {u.role}
                    </Badge>
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                </div>
              ))}
            </div>
            {user?.role === "admin" && (
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3 text-xs"
              >
                <Users className="w-3 h-3 mr-1" />
                Kullanıcı Ekle
              </Button>
            )}
          </CardContent>
        </Card>

        {/* RBAC Permissions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Rol Yetkileri (RBAC)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  role: "Admin",
                  perms: ["Tüm yetkiler", "Kullanıcı yönetimi", "Sistem ayarları"],
                  color: "red",
                },
                {
                  role: "Manager",
                  perms: ["Portföy yönetimi", "Trade", "Raporlar", "Audit", "Export"],
                  color: "orange",
                },
                {
                  role: "Trader",
                  perms: ["Portföy görüntüleme", "Trade", "Raporlar"],
                  color: "emerald",
                },
                {
                  role: "Viewer",
                  perms: ["Portföy görüntüleme", "Raporlar"],
                  color: "blue",
                },
              ].map((r) => (
                <div key={r.role} className="p-2.5 rounded-lg border border-border/50">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge
                      variant="outline"
                      className={`border-${r.color}-600/50 text-${r.color}-400 text-[10px]`}
                    >
                      {r.role}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {r.perms.map((p) => (
                      <span
                        key={p}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Trail */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Audit Trail
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[300px]">
            <div className="divide-y divide-border/50">
              {auditLogs.map((log, i) => (
                <div
                  key={i}
                  className="px-4 py-2.5 flex items-center gap-3 text-sm hover:bg-accent/30 transition-colors"
                >
                  <span className="text-xs text-muted-foreground font-mono w-16 shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {log.time}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-mono min-w-[100px] justify-center ${actionColors[log.action] || "text-foreground"}`}
                  >
                    {log.action}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono truncate w-44 shrink-0">
                    {log.user}
                  </span>
                  <span className="text-xs truncate">{log.detail}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
