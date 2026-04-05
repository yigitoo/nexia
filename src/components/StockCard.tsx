"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StockCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  onClick?: () => void;
}

export function StockCard({
  symbol,
  name,
  price,
  change,
  changePercent,
  onClick,
}: StockCardProps) {
  const isPositive = change >= 0;

  return (
    <Card
      className="cursor-pointer hover:border-emerald-600/50 transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono font-semibold text-sm">{symbol}</span>
          <Badge
            variant={isPositive ? "default" : "destructive"}
            className={
              isPositive
                ? "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30"
                : ""
            }
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {changePercent >= 0 ? "+" : ""}
            {changePercent.toFixed(2)}%
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate mb-1">{name}</p>
        <p className="text-lg font-bold font-mono">
          {price.toLocaleString("tr-TR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <p
          className={`text-xs font-mono ${isPositive ? "text-emerald-400" : "text-red-400"}`}
        >
          {change >= 0 ? "+" : ""}
          {change.toFixed(2)}
        </p>
      </CardContent>
    </Card>
  );
}
