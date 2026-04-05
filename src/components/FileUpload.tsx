"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload,
  FileSpreadsheet,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  Brain,
  Table,
} from "lucide-react";

interface AnalysisResult {
  type: string;
  rows?: number;
  columns?: string[];
  preview?: Record<string, unknown>[];
  stats?: Record<string, Record<string, number>>;
  error?: string;
  aiSummary?: string;
}

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(selectedFile: File) {
    setFile(selectedFile);
    setUploading(true);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": selectedFile.type || "application/octet-stream",
          "X-Filename": selectedFile.name,
        },
        body: selectedFile,
      });
      const data = await res.json();
      setResult(data);

      // AI analysis
      if (data.preview || data.stats) {
        setAnalyzing(true);
        try {
          const aiRes = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: `Bu finansal veriyi analiz et ve önemli bulguları özetle:\n\nSütunlar: ${data.columns?.join(", ")}\nSatır sayısı: ${data.rows}\nİstatistikler: ${JSON.stringify(data.stats)}`,
              history: [],
            }),
          });
          const aiData = await aiRes.json();
          setResult((prev) =>
            prev ? { ...prev, aiSummary: aiData.response } : prev
          );
        } finally {
          setAnalyzing(false);
        }
      }
    } catch {
      setResult({ type: "error", error: "Dosya yüklenemedi" });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border-dashed border-2 border-border/50 hover:border-emerald-600/30 transition-colors">
        <CardContent className="p-8">
          <div
            className="text-center cursor-pointer"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const droppedFile = e.dataTransfer.files[0];
              if (droppedFile) handleUpload(droppedFile);
            }}
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-600/15 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-sm font-medium mb-1">
              Dosya yükleyin veya sürükleyip bırakın
            </p>
            <p className="text-xs text-muted-foreground">
              Excel (.xlsx, .xls), CSV (.csv) veya PDF (.pdf) formatları desteklenir
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <Badge variant="outline" className="text-[10px]">
                <FileSpreadsheet className="w-3 h-3 mr-1" />
                Excel
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                <FileText className="w-3 h-3 mr-1" />
                CSV
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                <FileText className="w-3 h-3 mr-1" />
                PDF
              </Badge>
            </div>
            {file && !uploading && !result && (
              <p className="text-xs text-emerald-400 mt-2">Son yüklenen: {file.name}</p>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.pdf,.csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
            }}
          />
        </CardContent>
      </Card>

      {uploading && (
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
            <div>
              <p className="text-sm font-medium">Dosya analiz ediliyor...</p>
              <p className="text-xs text-muted-foreground">{file?.name}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {result && !uploading && (
        <div className="space-y-4">
          {/* File Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                {result.error ? (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                )}
                {file?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.error ? (
                <p className="text-sm text-red-400">{result.error}</p>
              ) : (
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Tip: {result.type?.toUpperCase()}</span>
                  {result.rows && <span>Satır: {result.rows}</span>}
                  {result.columns && (
                    <span>Sütun: {result.columns.length}</span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data Preview */}
          {result.preview && result.preview.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Table className="w-4 h-4" />
                  Veri Önizleme
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="max-h-[300px]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          {result.columns?.map((col) => (
                            <th
                              key={col}
                              className="px-3 py-2 text-left font-medium text-muted-foreground"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.preview.map((row, i) => (
                          <tr
                            key={i}
                            className="border-b border-border/50 hover:bg-accent/30"
                          >
                            {result.columns?.map((col) => (
                              <td key={col} className="px-3 py-1.5 font-mono">
                                {String(row[col] ?? "")}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* AI Analysis */}
          {(analyzing || result.aiSummary) && (
            <Card className="border-emerald-600/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="w-4 h-4 text-emerald-400" />
                  AI Analiz
                  {analyzing && (
                    <Loader2 className="w-3 h-3 animate-spin ml-1" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.aiSummary ? (
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {result.aiSummary}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    AI analizi yapılıyor...
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
