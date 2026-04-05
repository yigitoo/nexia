"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Markdown } from "./Markdown";
import { Brain, Send, Loader2, User, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  time: string;
}

const SUGGESTIONS = [
  "THYAO'nun risk analizi",
  "GARAN ile AKBNK karşılaştır",
  "Portföy önerisi",
  "USD/TRY kuru",
];

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Merhaba! BIST hisse analizi, risk değerlendirmesi veya portföy optimizasyonu için yardımcı olabilirim.",
      time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const now = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    setMessages((p) => [...p, { role: "user", content: text, time: now }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: messages.slice(-6) }),
      });
      const data = await res.json();
      const t = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
      setMessages((p) => [...p, { role: "assistant", content: data.response || "Hata oluştu.", time: t }]);
    } catch {
      const t = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
      setMessages((p) => [...p, { role: "assistant", content: "Bağlantı hatası. Backend çalıştığından emin olun.", time: t }]);
    } finally {
      setLoading(false);
    }
  }

  const showSuggestions = messages.length <= 1;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-14 flex items-center gap-2 px-5 border-b border-border/40 shrink-0">
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <span className="text-[13px] font-medium">AI Asistan</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
              msg.role === "assistant" ? "bg-emerald-500/10" : "bg-muted"
            }`}>
              {msg.role === "assistant" ? <Brain className="w-3 h-3 text-emerald-400" /> : <User className="w-3 h-3 text-muted-foreground" />}
            </div>
            <div className={`max-w-[80%] ${msg.role === "user" ? "text-right" : ""}`}>
              <div className={`inline-block rounded-lg px-3 py-2 text-[13px] leading-relaxed ${
                msg.role === "user" ? "bg-emerald-600/15 text-foreground" : "bg-muted/50"
              }`}>
                {msg.role === "assistant" ? <Markdown content={msg.content} /> : <p className="whitespace-pre-wrap">{msg.content}</p>}
              </div>
              <p className="text-[10px] text-muted-foreground/50 mt-1 px-1">{msg.time}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5">
            <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Loader2 className="w-3 h-3 text-emerald-400 animate-spin" />
            </div>
            <div className="bg-muted/50 rounded-lg px-3 py-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggestions */}
      {showSuggestions && (
        <div className="px-5 pb-2 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="text-[11px] px-2.5 py-1 rounded-full border border-border/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        className="px-5 pb-4 pt-2 flex gap-2 shrink-0"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Bir soru sorun..."
          className="text-[13px] h-9 bg-muted/30 border-border/50"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="h-9 w-9 flex items-center justify-center rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          <Send className="w-3.5 h-3.5 text-white" />
        </button>
      </form>
    </div>
  );
}
