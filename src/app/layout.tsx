import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexia — AI-Powered Financial Terminal",
  description:
    "Türk finans profesyonelleri için yapay zekâ destekli analiz terminali. BIST, KAP, teknik analiz, stokastik süreçler ve risk yönetimi.",
  metadataBase: new URL("https://nexia.app"),
  keywords: [
    "finans",
    "BIST",
    "teknik analiz",
    "yapay zeka",
    "portföy",
    "risk yönetimi",
    "kaos teorisi",
    "stokastik",
  ],
  authors: [{ name: "Nexia — IGNITE'26" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
