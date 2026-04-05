"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Coins,
  Activity,
  Globe,
} from "lucide-react";

interface MarketItem {
  name: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
}

const marketData: MarketItem[] = [
  {
    name: "BIST 100",
    value: "9,842.31",
    change: "+1.24%",
    positive: true,
    icon: <Activity className="w-4 h-4" />,
  },
  {
    name: "USD/TRY",
    value: "38.42",
    change: "+0.18%",
    positive: true,
    icon: <DollarSign className="w-4 h-4" />,
  },
  {
    name: "EUR/TRY",
    value: "41.85",
    change: "-0.06%",
    positive: false,
    icon: <Globe className="w-4 h-4" />,
  },
  {
    name: "Altın (gr)",
    value: "3,245",
    change: "+0.52%",
    positive: true,
    icon: <Coins className="w-4 h-4" />,
  },
];

export function MarketOverview() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {marketData.map((item) => (
        <Card
          key={item.name}
          className="min-w-[180px] flex-shrink-0 bg-gradient-to-br from-card to-card/80 border-border/50"
        >
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                {item.icon}
                <span className="text-xs font-medium">{item.name}</span>
              </div>
              {item.positive ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-400" />
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold font-mono">{item.value}</span>
              <span
                className={`text-xs font-mono font-medium ${
                  item.positive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {item.change}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
