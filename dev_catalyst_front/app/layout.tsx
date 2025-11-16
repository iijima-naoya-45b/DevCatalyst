import type { Metadata, Viewport } from "next";
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
  applicationName: "devCatalyst",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    other: [
      { rel: "mask-icon", url: "/favicon.svg", color: "#b78032" },
    ],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f0e8" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a1e" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning className="overflow-x-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
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
