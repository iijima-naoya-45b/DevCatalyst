import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SystemColorProvider } from "@/components/system-color-provider";
import { AuthProvider } from "../contexts/auth-context";
import { ErrorBoundary } from "../components/error-boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "devCatalyst MVP - ソロプレナー支援プラットフォーム",
  description: "Webエンジニア向けソロプレナー支援アプリケーション。AI伴走機能、自動競合分析、MVPロードマップ生成で事業アイデアの検証と収益化をサポート。",
  keywords: ["ソロプレナー", "Webエンジニア", "事業検証", "AI", "競合分析", "MVP"],
  authors: [{ name: "devCatalyst Team" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange={false}
            storageKey="theme"
            forcedTheme={undefined}
          >
            <SystemColorProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </SystemColorProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
